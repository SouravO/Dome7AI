import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, getImageUrl } from "../src/lib/supabase";
import StaggeredMenu from "../src/components/ui/components/StaggeredMenu";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalleryData();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel("gallery_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery_images" },
        () => {
          loadGalleryData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadGalleryData = async () => {
    try {
      setLoading(true);

      // Load images from Supabase
      const { data: imagesData, error: imgError } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (imgError) {
        console.error("Error loading images:", imgError);
        throw imgError;
      }

      console.log({ imagesData });

      // Generate URLs for each image from image_path
      const imagesWithUrls =
        imagesData?.map((img) => {
          const url = getImageUrl(img.image_path);
          console.log(`Generated URL for ${img.image_path}:`, url);
          return {
            ...img,
            url: url,
          };
        }) || [];

      setImages(imagesWithUrls);
      console.log("Images with URLs:", imagesWithUrls);

      // Load categories
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (catError) throw catError;

      const uniqueCategories = [
        "all",
        ...(categoriesData?.map((cat) => cat.name) || []),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error loading gallery data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <>
     
      <section className="min-h-screen bg-black py-16 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs tracking-widest mb-4 text-gray-400"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              GALLERY
            </p>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              OUR WORK
            </h1>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-white text-black"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Loading gallery...</p>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image, index) => {
                console.log(`Rendering image ${index}:`, image);
                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-lg bg-gray-900 aspect-square"
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      onError={(e) => {
                        console.error(`Failed to load image: ${image.url}`, e);
                        e.target.src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" fill="white">Error</text></svg>';
                      }}
                      onLoad={() =>
                        console.log(`Successfully loaded: ${image.url}`)
                      }
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {image.title}
                      </h3>
                      <p className="text-sm text-gray-300">{image.category}</p>
                    </div>
                  </div> */}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No images available yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Gallery;
