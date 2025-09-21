//src/app/api/auth/logout/route.ts

import { NextRequest } from 'next/server';
import { proxyToBackend, runtime } from '@/server/bff';

export { runtime };

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/auth/logout', 'POST', false);
}
