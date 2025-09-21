//src/app/api/cart/route.ts (for GET, POST)

import { NextRequest } from 'next/server';
import { proxyToBackend, runtime } from '@/server/bff';

export { runtime };

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/cart', 'GET', false);
}

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/cart', 'POST', true);
}
