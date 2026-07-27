import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/server/bff';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/profile', 'GET');
}

export async function PUT(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/profile', 'PUT');
}
