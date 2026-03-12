import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ── Firebase Admin init (server-side only – bypasses all Firestore rules) ─────
function getAdminDb() {
  if (!getApps().length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) return null;
    try {
      initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
    } catch {
      return null;
    }
  }
  try { return getFirestore(); } catch { return null; }
}

// ── POST /api/registration/save ───────────────────────────────────────────────
// Accepts the full registration payload and writes it to Firestore server-side,
// bypassing all client-side security rules.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, ...rest } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Missing orderId.' }, { status: 400 });
    }

    const db = getAdminDb();

    if (db) {
      // Admin SDK path – guaranteed to succeed regardless of security rules
      await db.collection('participant_registrations').doc(orderId).set(
        { id: orderId, orderId, ...rest },
        { merge: true }
      );
      return NextResponse.json({ success: true });
    }

    // ── Fallback: no Admin SDK (local dev without service account JSON) ───────
    // Return a special flag so the client can fall back to a direct write.
    return NextResponse.json({ success: false, fallbackToClient: true });

  } catch (err) {
    console.error('[registration/save]', err);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
