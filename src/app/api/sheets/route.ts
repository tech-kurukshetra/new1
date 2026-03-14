import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json({ success: false, message: 'Google Script URL not set.' }, { status: 500 });
    }

    const response = await fetch(scriptUrl);
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[sheets/GET]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json({ success: false, message: 'Google Script URL not set.' }, { status: 500 });
    }

    const body = await req.json();
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Prevent CORS preflight issues with GAS
      body: JSON.stringify(body)
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[sheets/POST]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
