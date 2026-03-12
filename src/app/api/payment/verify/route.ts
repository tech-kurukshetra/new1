import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ---------------------------------------------------------------------------
// Lazy-init Firebase Admin (runs server-side only on Vercel)
// ---------------------------------------------------------------------------
function getAdminFirestore() {
  if (!getApps().length) {
    // On Vercel, set FIREBASE_SERVICE_ACCOUNT_JSON env var with the full
    // service account JSON (as a single-line string). For local dev without
    // admin SDK, we fall back to the client SDK approach below.
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJson) {
      initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
    } else {
      // No admin credentials – return null to indicate unavailability
      return null;
    }
  }
  return getFirestore();
}

// ---------------------------------------------------------------------------
// POST /api/payment/verify
// Body: { utrNumber: string, registrationId: string }
// Returns: { success: boolean, message: string }
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const { utrNumber, registrationId } = await req.json();

    // ── 1. Validate UTR format (12-digit numeric) ────────────────────────
    if (!utrNumber || !/^\d{12}$/.test(utrNumber.trim())) {
      return NextResponse.json(
        { success: false, message: 'Invalid UTR number. Must be a 12-digit number found in your UPI app.' },
        { status: 400 }
      );
    }

    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: 'Registration ID is missing.' },
        { status: 400 }
      );
    }

    const db = getAdminFirestore();

    // ── 2. Admin SDK available – do full dedup check ─────────────────────
    if (db) {
      // Check for duplicate UTR across all registrations
      const dupSnap = await db
        .collection('participant_registrations')
        .where('utrNumber', '==', utrNumber.trim())
        .limit(1)
        .get();

      if (!dupSnap.empty) {
        const existingId = dupSnap.docs[0].id;
        if (existingId !== registrationId) {
          return NextResponse.json(
            { success: false, message: 'This UTR number has already been used for another registration.' },
            { status: 409 }
          );
        }
      }

      // Mark payment as verified
      await db
        .collection('participant_registrations')
        .doc(registrationId)
        .update({
          paymentStatus: 'Verified',
          utrNumber: utrNumber.trim(),
          paymentVerifiedAt: new Date().toISOString(),
        });

      return NextResponse.json({ success: true, message: 'Payment verified successfully.' });
    }

    // ── 3. Admin SDK not available – optimistic verification ─────────────
    // Without Admin SDK we cannot do server-side dedup, but the client
    // already writes to Firestore. We still validate UTR format (done above)
    // and return success. Admins can cross-check UTRs in the console.
    return NextResponse.json({
      success: true,
      message: 'Payment recorded. Admin will verify UTR against bank statement.',
    });
  } catch (err) {
    console.error('[verify-payment]', err);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
