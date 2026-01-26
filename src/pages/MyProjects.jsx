import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Loader from "../components/ui/loader";
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 15

const MyProjects = () => {
    const [designs, setDesigns] = useState([]);
    const [start, setStart] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(null);

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

    const loadMore = () => {
      console.log("load more", start)
        fetchDesigns(start);
    };

    const onViewClick = (designId) => {
      const params = new URLSearchParams({ designid: String(designId) });
      window.open(`/console?${params.toString()}`, "_blank", "noopener,noreferrer");
    }

    // const refresh = () => {
    //     setStart(0);
    //     setHasMore(true);
    //     fetchDesigns(0);
    // };

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1
                        className="text-4xl mt-16 md:text-5xl font-bold text-white mb-4 tracking-tight"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                        My Projects
                    </h1>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                        Explore our portfolio of innovative interior design
                        projects showcasing creativity, functionality, and
                        attention to detail.
                    </p>
                </div>

                {loading && !totalCount ? (
                    <div className="flex w-full align-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div>
                        <InfiniteScroll
                            dataLength={designs.length}
                            next={loadMore}
                            hasMore={hasMore}
                            loader={<Loader />}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-10"
                        >
                            {designs.map((project) => (
                                <div
                                    key={project.planId}
                                    className="group relative bg-gradient-to-b from-[#1a0033] to-[#2d0b4e] rounded-2xl border border-gray-800 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    {/* Project Image/Thumbnail */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={project.coverPic}
                                            alt={project.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                        {/* Status badge overlay */}
                                    </div>

                                    {/* Project Content */}
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <span className="inline-block px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-xs font-medium mb-3 border border-indigo-700/50">
                                                {project.commName}
                                            </span>
                                            <h3
                                                className="text-xl font-bold text-white group-hover:text-[#31b5f9] transition-colors duration-300 mb-2"
                                                style={{
                                                    fontFamily:
                                                        "Poppins, sans-serif",
                                                }}
                                            >
                                                {project.name}
                                            </h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
                                            <button onClick={() => onViewClick(project.designId)} className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-[#f516ff] to-[#31b5f9] text-white font-medium rounded-lg hover:from-[#31b5f9] hover:to-[#f516ff] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#31b5f9]/50 focus:ring-opacity-50">
                                                View Details
                                            </button>

                                            <div className="flex space-x-2">
                                                <button className="p-2 rounded-lg border border-gray-700 hover:border-[#31b5f9] hover:bg-[#31b5f9]/10 text-gray-300 hover:text-[#31b5f9] transition-colors">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button className="p-2 rounded-lg border border-gray-700 hover:border-[#31b5f9] hover:bg-[#31b5f9]/10 text-gray-300 hover:text-[#31b5f9] transition-colors">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </InfiniteScroll>

                        {totalCount === 0 && (
                            <div className="text-center py-16">
                                <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                </div>
                                <h3
                                    className="text-2xl font-bold text-white mb-2"
                                    style={{
                                        fontFamily: "Poppins, sans-serif",
                                    }}
                                >
                                    No projects yet
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Start creating your first project to
                                    showcase your work.
                                </p>
                                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-[#f516ff] to-[#31b5f9] text-white font-medium rounded-lg hover:from-[#31b5f9] hover:to-[#f516ff] transition-all duration-300">
                                    Create New Project
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProjects;
