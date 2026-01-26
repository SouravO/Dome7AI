import React from 'react';

const MyProjects = () => {
  // Sample projects data - replace with your actual data
  const projects = [
    {
      id: 1,
      title: 'Project Alpha',
      description: 'A cutting-edge interior design project featuring modern aesthetics and innovative space utilization.',
      category: 'Residential',
      status: 'Completed',
      thumbnail: '/placeholder-project-image.jpg',
    },
    {
      id: 2,
      title: 'Project Beta',
      description: 'Commercial office space redesign focusing on productivity and employee wellbeing.',
      category: 'Commercial',
      status: 'In Progress',
      thumbnail: '/placeholder-project-image.jpg',
    },
    {
      id: 3,
      title: 'Project Gamma',
      description: 'Luxury apartment renovation with smart home integration and sustainable materials.',
      category: 'Residential',
      status: 'Planning',
      thumbnail: '/placeholder-project-image.jpg',
    },
    {
      id: 4,
      title: 'Project Delta',
      description: 'Restaurant interior design with unique lighting and acoustic solutions.',
      category: 'Hospitality',
      status: 'Completed',
      thumbnail: '/placeholder-project-image.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            My Projects
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore our portfolio of innovative interior design projects showcasing creativity, functionality, and attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-gradient-to-b from-[#1a0033] to-[#2d0b4e] rounded-2xl border border-gray-800 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Project Image/Thumbnail */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status badge overlay */}
                
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-xs font-medium mb-3 border border-indigo-700/50">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#31b5f9] transition-colors duration-300 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {project.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
                  <button className="px-5 py-2.5 bg-gradient-to-r from-[#f516ff] to-[#31b5f9] text-white font-medium rounded-lg hover:from-[#31b5f9] hover:to-[#f516ff] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#31b5f9]/50 focus:ring-opacity-50">
                    View Details
                  </button>

                  <div className="flex space-x-2">
                    <button className="p-2 rounded-lg border border-gray-700 hover:border-[#31b5f9] hover:bg-[#31b5f9]/10 text-gray-300 hover:text-[#31b5f9] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg border border-gray-700 hover:border-[#31b5f9] hover:bg-[#31b5f9]/10 text-gray-300 hover:text-[#31b5f9] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>No projects yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">Start creating your first project to showcase your work.</p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-[#f516ff] to-[#31b5f9] text-white font-medium rounded-lg hover:from-[#31b5f9] hover:to-[#f516ff] transition-all duration-300">
              Create New Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;