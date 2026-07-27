import { NextRequest } from "next/server";
import { proxyToBackend } from "@/server/bff";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    return proxyToBackend(req, '/api/v1/admin/users', 'GET');
}

export async function POST(req: NextRequest) {
    return proxyToBackend(req, '/api/v1/admin/users', 'POST')
}