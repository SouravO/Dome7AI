import { useEffect, useState } from "react";
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
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-16">
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
                        className="group inline-flex items-center gap-3 px-8 py-4 border border-white text-white text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300"
                    >
                        START PROJECT
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
                {loading && !totalCount ? (
                    <LoaderWrapper />
                ) : (
                    <>
                        <InfiniteScroll
                            dataLength={designs.length}
                            next={loadMore}
                            hasMore={hasMore}
                            loader={<LoaderWrapper />}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {designs.map((project) => (
                                <div
                                    key={project.planId}
                                    className="group bg-black border border-gray-900 overflow-hidden hover:border-gray-700 transition-all duration-500"
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
                                    <div className="p-8 bg-black">
                                        <h3 className="text-2xl font-light text-white mb-3 group-hover:text-gray-300 transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                            {project.description || 'A sophisticated design project showcasing innovation and elegance.'}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-900">
                                            <button
                                                onClick={() => onViewClick(project.designId)}
                                                className="group/btn inline-flex items-center gap-2 text-white text-xs tracking-widest uppercase hover:text-gray-400 transition-colors"
                                            >
                                                VIEW DETAILS
                                                <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>

                                            <div className="flex items-center gap-3">
                                                <button className="text-gray-500 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                </button>
                                                <button className="text-gray-500 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                    </svg>
                                                </button>
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
