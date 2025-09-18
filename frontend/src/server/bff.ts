// src/server/bff.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function proxyToBackend(
  req: NextRequest,
  backendPath: string,
  method: string = req.method,
  withBody?: boolean
) {
  // اگر explicitly با withBody نیاد، خودش تصمیم می‌گیره
  const hasBody = withBody ?? (method !== 'GET' && method !== 'HEAD');

  const url = `${BACKEND_URL}${backendPath}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Cookie: req.headers.get('cookie') || '',
  };

  if (hasBody && req.headers.get('content-type')) {
    headers['Content-Type'] = req.headers.get('content-type')!;
  }

  let body: string | undefined = undefined;
  if (hasBody) {
    try {
      body = await req.text();
    } catch {
      body = undefined;
    }
  }

  console.log('➡️ Forwarding to backend:', url, { method, headers, body });

  try {
    const backendRes = await fetch(url, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    // هندل 204 (مثل csrf-cookie)
    if (backendRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // raw body
    const rawBody = await backendRes.text();
    console.log('⬅️ Backend status:', backendRes.status);
    console.log('⬅️ Backend body:', rawBody);

    const res = new NextResponse(rawBody, {
      status: backendRes.status,
    });

    const contentType = backendRes.headers.get('content-type') || 'application/json';
    res.headers.set('content-type', contentType);

    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      res.headers.set('set-cookie', setCookie);
    }

    return res;
  } catch (err: any) {
    console.error('❌ proxyToBackend error:', err);
    return NextResponse.json(
      { error: 'Proxy crashed', details: err.message },
      { status: 500 }
    );
  }
}
