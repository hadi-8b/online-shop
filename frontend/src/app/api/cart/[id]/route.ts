//src/app/api/cart/[id]/route.ts (for PUT, DELETE)

import { NextRequest } from 'next/server';
import { proxyToBackend, runtime } from '@/server/bff';

export { runtime };

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyToBackend(req, `/api/v1/cart/${params.id}`, 'PUT', true);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyToBackend(req, `/api/v1/cart/${params.id}`, 'DELETE', false);
}
