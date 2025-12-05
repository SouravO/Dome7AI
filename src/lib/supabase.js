import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables!");
    console.log("URL:", supabaseUrl);
    console.log("Key exists:", !!supabaseAnonKey);
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            persistSession: false
        }
    }
);

// ✅ MUST match Supabase bucket exactly
export const GALLERY_BUCKET = "gallery";

// Upload image
export const uploadImage = async (file, fileName) => {
    const { data, error } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw error;
    return data;
};

// Get public URL
export const getImageUrl = (filePath) => {
    const { data } = supabase.storage
        .from(GALLERY_BUCKET)
        .getPublicUrl(filePath);

    console.log("IMAGE URL:", data.publicUrl);
    return data.publicUrl;
};

// Delete image
export const deleteImage = async (filePath) => {
    const { error } = await supabase.storage
        .from(GALLERY_BUCKET)
        .remove([filePath]);

    if (error) throw error;
};
