import { MetadataRoute } from 'next';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// This function safely initializes Firebase on the server-side if needed.
async function fetchCollection(collectionName: string) {
    try {
        const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const snapshot = await getDocs(collection(db, collectionName));
        return snapshot.docs;
    } catch (error) {
        console.error(`Error fetching '${collectionName}' for sitemap:`, error);
        return [];
    }
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.techkurukshetra.in';

  // Fetch dynamic routes from Firestore
  const eventDocs = await fetchCollection('events');
  const eventRoutes = eventDocs.map(doc => ({
    url: `${siteUrl}/arenas/${doc.data().slug}`,
    lastModified: doc.data().updatedAt ? new Date(doc.data().updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  const announcementDocs = await fetchCollection('announcements');
  const announcementRoutes = announcementDocs.map(doc => ({
    url: `${siteUrl}/announcements/${doc.data().slug}`,
    lastModified: doc.data().timestamp ? new Date(doc.data().timestamp) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Static routes
  const staticRoutes = [
    '/',
    '/arenas',
    '/timeline',
    '/announcements',
    '/team',
    '/contact',
    '/register',
    '/privacy-protocol',
    '/terms-of-entry',
  ].map(route => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.7,
  }));

  return [...staticRoutes, ...eventRoutes, ...announcementRoutes];
}

    