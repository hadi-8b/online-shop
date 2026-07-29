import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/server/bff';

export const runtime = 'nodejs';

export async function GET(
 req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return proxyToBackend(
    req,
    `/api/v1/admin/users/${id}`,
    'GET'
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return proxyToBackend(
    req,
    `/api/v1/admin/users/${id}`,
    'PUT',
    true
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return proxyToBackend(
    req,
    `/api/v1/admin/users/${id}`,
    'DELETE',
    false
  );
}