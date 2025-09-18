//src/app/api/auth/register/route.ts

import { NextRequest } from 'next/server';
import { proxyToBackend, runtime } from '@/server/bff';

export { runtime };

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/auth/register', 'POST', true);
}
