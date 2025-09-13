// src/services/api/auth/token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { action, token } = req.body;

  if (action === 'store' && token) {
    res.setHeader('Set-Cookie', serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 روز
    }));
    return res.status(200).json({ success: true });
  }

  if (action === 'remove') {
    res.setHeader('Set-Cookie', serialize('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    }));
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false });
}
