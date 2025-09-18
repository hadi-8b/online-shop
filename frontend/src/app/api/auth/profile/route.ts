import { NextRequest } from 'next/server';
import { proxyToBackend, runtime } from '@/server/bff';

export { runtime };

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/profile', 'GET');
}

export async function PUT(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/profile', 'PUT');
}
