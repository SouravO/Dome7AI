import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import Loader from "../components/ui/loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";

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
            const params = new URLSearchParams({
                start: String(nextStart),
                num: String(PAGE_SIZE),
            });

            const { data, error } = await supabase.functions.invoke(
                `design-list?${params.toString()}`,
                {
                    method: "GET",
                },
            );

            if (error) throw error;

            /**
             * Expected response structure example:
             * data.d.result = items array
             * data.d.count = number
             * data.d.hasMore = boolean
             * data.d.totalCount = number
             */
            const result = data?.d;

            const items = result?.result;
            const count = result?.count;
            const more = result?.hasMore;
            const total = result?.totalCount;

            setTotalCount(total);
            setHasMore(more);

            // If it's first page => reset
            if (nextStart === 0) {
                setDesigns(items);
            } else {
                // Append (avoid duplicates by id if needed)
                setDesigns((prev) => [...prev, ...items]);
            }

            // Move offset forward based on count returned
            setStart(nextStart + count);
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
        console.log("load more", start);
        fetchDesigns(start);
    };

    const onViewClick = (designId) => {
        const params = new URLSearchParams({ designid: String(designId) });
        window.open(
            `/console?${params.toString()}`,
            "_blank",
            "noopener,noreferrer",
        );
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
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onViewClick(project.designId)
                                    }}
                                    className="cursor-pointer group bg-black border border-gray-900 overflow-hidden hover:border-gray-700 transition-all duration-500 flex flex-col h-10/12"
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
                                                // onClick={(e) => {
                                                //     e.stopPropagation()
                                                //  navigate to project details
                                                // }}
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
                                                            setActiveDropdown(activeDropdown === project.planId ? null : project.planId)}}
                                                    >
                                                        More
                                                    </button>

                                                    {activeDropdown === project.planId && (
                                                        <div className="project-dropdown-menu absolute right-0 -top-48 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10 overflow-hidden">
                                                            <ul className="py-1">
                                                                <li>
                                                                    <button
                                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            alert(`Edit project: ${project.name}`);
                                                                            setActiveDropdown(null);
                                                                        }}
                                                                    >
                                                                        Edit Project
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            alert(`Duplicate project: ${project.name}`);
                                                                            setActiveDropdown(null);
                                                                        }}
                                                                    >
                                                                        Duplicate
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            alert(`Share project: ${project.name}`);
                                                                            setActiveDropdown(null);
                                                                        }}
                                                                    >
                                                                        Share
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            alert(`Export project: ${project.name}`);
                                                                            setActiveDropdown(null);
                                                                        }}
                                                                    >
                                                                        Export
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
                                                                                alert(`Delete project: ${project.name}`);
                                                                                setActiveDropdown(null);
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
        </div>
    );
};

export default MyProjects;
