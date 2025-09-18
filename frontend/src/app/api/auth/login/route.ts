//src/app/api/auth/login/route.ts

import { NextRequest } from 'next/server';
import { proxyToBackend, runtime } from '@/server/bff';

export { runtime };

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/auth/login', 'POST', true);
}
