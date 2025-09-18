//src/app/api/auth/verify/route.ts

import { NextRequest } from 'next/server';
import { proxyToBackend, runtime } from '@/server/bff';

export { runtime };

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/auth/verify', 'POST', true);
}
