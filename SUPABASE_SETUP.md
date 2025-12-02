# Supabase Setup Instructions

## Step 1: Create Database Tables

Go to your Supabase project SQL Editor and run these commands:

### 1. Create Categories Table

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations on categories" ON categories
  FOR ALL USING (true);
```

### 2. Create Gallery Images Table

```sql
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations on gallery_images" ON gallery_images
  FOR ALL USING (true);
```

## Step 2: Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New Bucket**
3. Name it: `gallery-images`
4. Make it **Public** (so images can be accessed)
5. Click **Create Bucket**

## Step 3: Set Storage Bucket Policies

Go to the `gallery-images` bucket policies and add:

### Policy for Upload (INSERT)

```sql
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'gallery-images');
```

### Policy for View (SELECT)

```sql
CREATE POLICY "Allow public access" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'gallery-images');
```

### Policy for Delete (DELETE)

```sql
CREATE POLICY "Allow public deletes" ON storage.objects
  FOR DELETE TO public
  USING (bucket_id = 'gallery-images');
```

## Step 4: Test the Setup

1. Restart your development server
2. Go to `/login` and login with admin/pass
3. Add a category
4. Upload an image
5. Check the gallery page to see your images

## Notes

- Images are stored in Supabase Storage
- Image metadata (title, category, etc.) is stored in the database
- The gallery auto-updates when new images are added (realtime subscription)
- Maximum file size is 5MB (adjustable in Dashboard.jsx)
