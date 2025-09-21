//src/app/api/sanctum/csrf-cookie/route.ts

import { NextRequest } from 'next/server';
import { proxyToBackend, runtime } from '@/server/bff';

export { runtime };

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/api/sanctum/csrf-cookie', 'GET', false);
}
