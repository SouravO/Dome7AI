import { useEffect, useState } from "react";
import Loader from "../components/ui/loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { buildKujialeWorkbenchDetailUrl } from "../constants/kujialeLinks";

const PAGE_SIZE = 15;

const LoaderWrapper = () => (
    <div className="flex w-full align-center justify-center">
        <Loader />
    </div>
);

const MyProjects = () => {
    const navigate = useNavigate();

    const [designs, setDesigns] = useState([]);
    const [start, setStart] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [actionLoading, setActionLoading] = useState(false);
    const [folderOpen, setFolderOpen] = useState(false);
    const [folders, setFolders] = useState([]);
    const [folderProject, setFolderProject] = useState(null);

    // Handle window resize for responsive banner
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Background configuration based on screen size
    const getBackgroundConfig = () => {
        if (isMobile) {
            return {
                backgroundImage: "url('/assets/myprojectsMobile.png')",
                backgroundSize: "fill",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            };
        } else {
            return {
                backgroundImage: "url('/assets/myprojectbanner.png')",
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            };
        }
    };

    const fetchDesigns = async (nextStart) => {
        if (loading) return;
        if (!hasMore && nextStart !== 0) return;

        setLoading(true);

        try {
            const { functions } = await import("../lib/firebase");
            const { httpsCallable } = await import("firebase/functions");
            const getDesignList = httpsCallable(functions, 'designList');

            const { data } = await getDesignList({
                start: nextStart,
                num: PAGE_SIZE,
            });

            const result = data?.d;

            const items = result?.result;
            const count = result?.count;
            const more = result?.hasMore;
            const total = result?.totalCount;

            setTotalCount(total);
            setHasMore(more);

            if (nextStart === 0) {
                setDesigns(items || []);
            } else {
                setDesigns((prev) => [...prev, ...(items || [])]);
            }

            setStart(nextStart + (count || 0));
        } catch (e) {
            console.error("Pagination fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    // initial load
    useEffect(() => {
        fetchDesigns(0);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if clicked outside of any dropdown
            const dropdowns = document.querySelectorAll('.project-dropdown-menu');
            const isClickInsideDropdown = Array.from(dropdowns).some(dropdown =>
                dropdown.contains(event.target)
            );

            if (!isClickInsideDropdown) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const loadMore = () => {
        fetchDesigns(start);
    };

    const openInConsole = (project) => {
        const id = project?.designId;
        if (!id) {
            alert("This project has no design id yet.");
            return;
        }
        navigate(`/console?designid=${encodeURIComponent(String(id))}`);
    };

    const openProjectDetail = (project) => {
        const id = project?.designId;
        if (!id) {
            alert("This project has no design id yet.");
            return;
        }
        navigate(`/my-projects/${encodeURIComponent(String(id))}`, { state: { project } });
    };

    const callFunctions = async () => {
        const { functions } = await import("../lib/firebase");
        const { httpsCallable } = await import("firebase/functions");
        return { functions, httpsCallable };
    };

    const patchProjectInList = (designId, patch) => {
        setDesigns((prev) =>
            prev.map((p) =>
                String(p.designId) === String(designId) ? { ...p, ...patch } : p,
            ),
        );
    };

    const removeProjectFromList = (designId) => {
        setDesigns((prev) => prev.filter((p) => String(p.designId) !== String(designId)));
        setTotalCount((n) => (typeof n === "number" && n > 0 ? n - 1 : n));
    };

    const handleEditTitle = async (project) => {
        const designId = project?.designId;
        if (!designId) {
            alert("This project has no design id yet.");
            return;
        }
        const next = window.prompt("Project title", project.name || "");
        if (next === null) return;
        const trimmed = next.trim();
        if (!trimmed) {
            alert("Title cannot be empty.");
            return;
        }
        if (trimmed === project.name) return;

        setActiveDropdown(null);
        setActionLoading(true);
        try {
            const { functions, httpsCallable } = await callFunctions();
            await httpsCallable(functions, "updateDesignName")({
                designId: String(designId),
                name: trimmed,
            });
            patchProjectInList(designId, { name: trimmed });
        } catch (error) {
            console.error(error);
            alert(error.message || "Could not update project title.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDuplicate = async (project) => {
        const designId = project?.designId;
        if (!designId) {
            alert("This project has no design id yet.");
            return;
        }
        setActiveDropdown(null);
        setActionLoading(true);
        try {
            const { functions, httpsCallable } = await callFunctions();
            const { data } = await httpsCallable(functions, "copyDesign")({
                designId: String(designId),
            });
            const newId = data?.d?.designId || data?.d?.obsDesignId;
            if (newId) {
                await fetchDesigns(0);
                navigate(`/my-projects/${encodeURIComponent(String(newId))}`);
            } else {
                alert("Copy requested. Refresh My Projects to see the new plan.");
                await fetchDesigns(0);
            }
        } catch (error) {
            console.error(error);
            alert(
                error.message ||
                    "Duplicate failed. The plan may be private or not copyable.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleShare = async (project) => {
        const designId = project?.designId;
        if (!designId) {
            alert("This project has no design id yet.");
            return;
        }
        setActiveDropdown(null);
        const workbench = buildKujialeWorkbenchDetailUrl(designId);
        const dome7 = `${window.location.origin}/my-projects/${encodeURIComponent(String(designId))}`;
        const text = `Design ID: ${designId}\nGallery: ${dome7}\nWorkbench: ${workbench}`;
        try {
            await navigator.clipboard?.writeText(text);
            alert("Share links copied to clipboard.");
        } catch {
            window.prompt("Copy these links:", text);
        }
    };

    const handleExport = (project) => {
        setActiveDropdown(null);
        openProjectDetail(project);
    };

    const openMoveFolder = async (project) => {
        const planId = project?.planId || project?.designId;
        if (!planId) {
            alert("This project has no plan id yet.");
            return;
        }
        setActiveDropdown(null);
        setFolderProject(project);
        setFolderOpen(true);
        try {
            const { functions, httpsCallable } = await callFunctions();
            const { data } = await httpsCallable(functions, "listDesignTags")({
                start: 0,
                num: 50,
            });
            const list = data?.d?.result || data?.d || [];
            setFolders(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error(error);
            setFolders([]);
        }
    };

    const handleMoveToFolder = async (tagId) => {
        const planId = folderProject?.planId || folderProject?.designId;
        if (!tagId || !planId) return;
        setActionLoading(true);
        try {
            const { functions, httpsCallable } = await callFunctions();
            await httpsCallable(functions, "moveDesignToTag")({
                tagId,
                planId: String(planId),
            });
            setFolderOpen(false);
            setFolderProject(null);
            alert("Moved to folder.");
        } catch (error) {
            console.error(error);
            alert("Move to folder failed.");
        } finally {
            setActionLoading(false);
        }
    };

    const onDeleteProject = async (designId) => {
        setActionLoading(true);
        try {
            const { functions, httpsCallable } = await callFunctions();
            await httpsCallable(functions, "deleteDesign")({ designid: designId });
            removeProjectFromList(designId);
        } catch (error) {
            console.error(error);
            alert("Failed to delete design");
        } finally {
            setActionLoading(false);
        }
    };

    const onCreateClick = () => {
        navigate("/console");
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section - Responsive Banner with Dynamic Background */}
            <div
                className="max-w-[95rem] mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-16 min-h-[70vh] flex flex-col justify-center relative"
                style={{
                    ...getBackgroundConfig(),
                }}
            >
                <div className="max-w-3xl">
                    <p className="text-gray-400 text-xs tracking-[0.3em] uppercase mb-6">
                        CURATED EXCELLENCE
                    </p>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
                        Innovative
                        <br />
                        <span className="italic font-serif">Interior Vision.</span>
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                        Defining the next era of high-end architectural environments through monochromatic precision and nocturnal elegance.
                    </p>
                    <button
                        onClick={onCreateClick}
                        className="group inline-flex items-center gap-3 px-8 py-4 border border-white text-lg tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300 bg-white text-black font-medium"
                    >
                        START PROJECT
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-[95rem] mx-auto px-6 sm:px-8 lg:px-12 py-16">
                {loading && !totalCount ? (
                    <LoaderWrapper />
                ) : (
                    <>
                        <InfiniteScroll
                            dataLength={designs.length}
                            next={loadMore}
                            hasMore={hasMore}
                            loader={<LoaderWrapper />}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
                        >
                            {designs.map((project) => (
                                <div
                                    key={project.planId}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openInConsole(project)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            openInConsole(project);
                                        }
                                    }}
                                    className="group bg-black border border-gray-900 overflow-hidden hover:border-gray-700 transition-all duration-500 flex flex-col h-10/12 cursor-pointer"
                                >
                                    {/* Project Image */}
                                    <div className="relative h-80 overflow-hidden bg-neutral-900">
                                        <img
                                            src={project.coverPic}
                                            alt={project.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        {/* Category Badge */}
                                        <div className="absolute top-6 left-6">
                                            <span className="inline-block px-4 py-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] tracking-widest uppercase border border-white/20">
                                                {project.commName || 'DESIGN'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Content */}
                                    <div className="p-8 bg-black flex flex-col h-full">
                                        <div>
                                            <h3 className="text-2xl font-light text-white mb-3 group-hover:text-gray-300 transition-colors">
                                                {project.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                                {project.description || 'A sophisticated design project showcasing innovation and elegance.'}
                                            </p>
                                        </div>

                                        {/* Action Buttons fixed at bottom */}
                                        <div className="flex items-center justify-between  border-t border-gray-900 mt-auto">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openProjectDetail(project);
                                                }}
                                                className="cursor-pointer group/btn inline-flex items-center gap-2 text-white text-xs tracking-widest uppercase hover:text-gray-400 transition-colors  bg-gradient-to-r from-[#f516ff] to-[#31b5f9] p-2"
                                            >
                                                VIEW DETAILS
                                                <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>

                                            <div className="relative flex items-center gap-3">
                                                {/* More button with dropdown */}
                                                <div className="relative">
                                                    <button
                                                        className="cursor-pointer text-gray-400 hover:text-gray-200 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setActiveDropdown(activeDropdown === project.planId ? null : project.planId)
                                                        }}
                                                    >
                                                        More
                                                    </button>

                                                    {activeDropdown === project.planId && (
                                                        <div className="project-dropdown-menu absolute right-0 bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10 overflow-hidden">
                                                            <ul className="py-1">
                                                                <li>
                                                                    <button
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleEditTitle(project);
                                                                        }}
                                                                    >
                                                                        Edit title
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDuplicate(project);
                                                                        }}
                                                                    >
                                                                        Duplicate
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleShare(project);
                                                                        }}
                                                                    >
                                                                        Share
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleExport(project);
                                                                        }}
                                                                    >
                                                                        Open gallery
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            openMoveFolder(project);
                                                                        }}
                                                                    >
                                                                        Move to folder
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        type="button"
                                                                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
                                                                                setActiveDropdown(null);
                                                                                onDeleteProject(project.designId);
                                                                            }
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </InfiniteScroll>

                        {/* Empty State */}
                        {totalCount === 0 && (
                            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-32 text-center">
                                <div className="max-w-md mx-auto">
                                    <p className="text-gray-600 text-xs tracking-[0.3em] uppercase mb-4">
                                        NO PROJECTS
                                    </p>
                                    <h3 className="text-3xl font-light text-white mb-4">
                                        Your gallery awaits
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                        Begin your design journey and showcase your architectural vision.
                                    </p>
                                    <button
                                        onClick={onCreateClick}
                                        className="inline-flex items-center gap-3 px-8 py-4 border border-white text-white text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        CREATE PROJECT
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {folderOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="move-folder-title"
                >
                    <div className="w-full max-w-md border border-gray-800 bg-neutral-950 p-6">
                        <h2 id="move-folder-title" className="text-lg font-light text-white mb-1">
                            Move to folder
                        </h2>
                        {folderProject?.name && (
                            <p className="text-gray-500 text-sm mb-4 truncate">{folderProject.name}</p>
                        )}
                        {folders.length === 0 ? (
                            <p className="text-gray-500 text-sm mb-4">No folders found.</p>
                        ) : (
                            <ul className="max-h-64 overflow-y-auto mb-4 space-y-1">
                                {folders.map((f) => (
                                    <li key={f.tagId || f.id}>
                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() => handleMoveToFolder(f.tagId || f.id)}
                                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-sm transition-colors disabled:opacity-50"
                                        >
                                            {f.tagName || f.name || f.tagId}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setFolderOpen(false);
                                setFolderProject(null);
                            }}
                            className="text-xs tracking-widest uppercase border border-gray-700 px-4 py-2 text-white hover:border-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {actionLoading && (
                <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center pointer-events-none">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default MyProjects;
