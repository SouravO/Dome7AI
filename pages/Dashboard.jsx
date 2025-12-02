import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  supabase,
  uploadImage,
  getImageUrl,
  deleteImage as deleteImageFromStorage,
} from "../src/lib/supabase";

const Dashboard = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Image upload form state
  const [newImage, setNewImage] = useState({
    title: "",
    category: "",
    file: null,
  });

  // Preview URL
  const [imagePreview, setImagePreview] = useState("");

  // Category form state
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated");
    const authTime = localStorage.getItem("authTimestamp");

    // Session expires after 24 hours
    if (!isAuth || !authTime || Date.now() - parseInt(authTime) > 86400000) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authTimestamp");
      navigate("/admin");
      return;
    }

    // Load data
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load categories from Supabase
      const { data: categoriesData, error: catError } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (catError) throw catError;
      setCategories(categoriesData?.map((cat) => cat.name) || []);

      // Load images from Supabase
      const { data: imagesData, error: imgError } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (imgError) {
        console.error("Dashboard - Error loading images:", imgError);
        throw imgError;
      }

      console.log("Dashboard - Raw images from DB:", imagesData);

      // Generate URLs for each image from image_path
      const imagesWithUrls =
        imagesData?.map((img) => {
          const url = getImageUrl(img.image_path);
          console.log(`Dashboard - Generated URL for ${img.image_path}:`, url);
          return {
            ...img,
            url: url,
          };
        }) || [];

      console.log("Dashboard - Images with URLs:", imagesWithUrls);
      setImages(imagesWithUrls);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Error loading data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authTimestamp");
    navigate("/login");
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim() || categories.includes(newCategory.trim())) {
      alert("Category already exists or is empty");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name: newCategory.trim() }])
        .select();

      if (error) {
        console.error("Add category error:", error);
        throw error;
      }

      console.log("Added category:", data);

      // Immediately update local state
      setCategories((prevCategories) => [
        ...prevCategories,
        newCategory.trim(),
      ]);
      setNewCategory("");
      alert("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category: " + error.message);
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    // if category deleteing is having images assigned, prevent deletion
    const imagesInCategory = images.filter(
      (img) => img.category === categoryToDelete
    );
    if (imagesInCategory.length > 0) {
      alert(
        `Cannot delete category "${categoryToDelete}" because it has images assigned. Please delete those images first.`
      );
      return;
    }
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      console.log("Attempting to delete category:", categoryToDelete);

      // Delete the category from the database
      const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("name", categoryToDelete)
        .select();

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      console.log("Deleted category response:", data);

      if (!data || data.length === 0) {
        console.warn(
          "No rows were deleted - category might not exist in database"
        );
        alert("Category may not exist in database. Refreshing...");
        await loadData();
        return;
      }

      // Immediately update local state
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat !== categoryToDelete)
      );

      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category: " + error.message);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();

    if (!newImage.file) {
      alert("Please select an image file");
      return;
    }

    try {
      setLoading(true);

      // Generate unique filename
      const fileExt = newImage.file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      // Upload image to Supabase Storage
      await uploadImage(newImage.file, fileName);

      // Save image metadata to database (no url field, just image_path)
      const { error } = await supabase.from("gallery_images").insert([
        {
          title: newImage.title,
          category: newImage.category,
          image_path: fileName,
        },
      ]);

      if (error) throw error;

      // Reload data
      await loadData();

      // Reset form
      setNewImage({ title: "", category: "", file: null });
      setImagePreview("");

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setNewImage({ ...newImage, file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async (image) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      setLoading(true);

      // Delete image from storage
      if (image.image_path) {
        await deleteImageFromStorage(image.image_path);
      }

      // Delete from database
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", image.id);

      if (error) throw error;

      // Reload data
      await loadData();
      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-4 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Admin Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/")}
              className="px-4 sm:px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm sm:text-base"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Categories Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 rounded-lg p-4 sm:p-6"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Manage Categories
            </h2>

            <form onSubmit={handleAddCategory} className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white text-sm sm:text-base"
                  required
                />
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category}
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                  >
                    <span className="font-medium text-sm sm:text-base break-words pr-2">
                      {category}
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="text-red-500 hover:text-red-400 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4 text-sm sm:text-base">
                  No categories yet
                </p>
              )}
            </div>
          </motion.div>

          {/* Upload Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-900 rounded-lg p-4 sm:p-6"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Upload Image
            </h2>

            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Image Title
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) =>
                    setNewImage({ ...newImage, title: e.target.value })
                  }
                  placeholder="Enter image title"
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={newImage.category}
                  onChange={(e) =>
                    setNewImage({ ...newImage, category: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white text-sm sm:text-base"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 text-xs sm:text-base"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Max file size: 5MB</p>
              </div>

              {imagePreview && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">
                    Preview
                  </label>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 sm:h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Images List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900 rounded-lg p-4 sm:p-6"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            Gallery Images ({images.length})
          </h2>

          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-40 sm:h-48 object-cover"
                    onError={(e) => {
                      console.error(`Dashboard - Failed to load: ${image.url}`);
                      e.target.style.background = "#ef4444";
                      e.target.alt = "Failed to load";
                    }}
                    onLoad={() =>
                      console.log(`Dashboard - Loaded: ${image.url}`)
                    }
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold mb-1 text-sm sm:text-base truncate">
                      {image.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 truncate">
                      {image.category}
                    </p>
                    <button
                      onClick={() => handleDeleteImage(image)}
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8 text-sm sm:text-base">
              No images uploaded yet
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
