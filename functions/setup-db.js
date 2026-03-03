const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const app = initializeApp();
const db = getFirestore(app);

async function setupDatabase() {
    console.log('Initializing Firestore collections...');

    try {
        // 1. user_profiles
        // Columns: id uuid, kjl_app_uid text, created_at timestamptz, updated_at timestamptz
        const profilesRef = db.collection('user_profiles').doc('_schema_placeholder');
        await profilesRef.set({
            kjl_app_uid: "schema_init",
            created_at: new Date(),
            updated_at: new Date()
        });
        await profilesRef.delete(); // Collection stays logically present
        console.log('✔ _user_profiles_ collection initialized');

        // 1b. user_tokens
        // Columns: id uuid, open_api_token text, token_expires_at timestamptz, created_at timestamptz, updated_at timestamptz
        const tokensRef = db.collection('user_tokens').doc('_schema_placeholder');
        await tokensRef.set({
            open_api_token: "schema_init",
            token_expires_at: null,
            created_at: new Date(),
            updated_at: new Date()
        });
        await tokensRef.delete();
        console.log('✔ _user_tokens_ collection initialized');

        // 2. categories
        const catsRef = db.collection('categories').doc('_placeholder');
        await catsRef.set({ init: true });
        await catsRef.delete();
        console.log('✔ _categories_ collection initialized');

        // 3. gallery_images collection
        const galleryRef = db.collection('gallery_images').doc('_placeholder');
        await galleryRef.set({ init: true });
        await galleryRef.delete();
        console.log('✔ _gallery_images_ collection initialized');

        console.log('Database collections setup complete!');
    } catch (err) {
        console.error('Error setting up database:', err);
    }
}

setupDatabase();
