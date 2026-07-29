import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/server/bff';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/auth/login', 'POST', true);
}
