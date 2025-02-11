import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken, verifyUserByAccessToken } from '@/lib/server-utils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Unauthorized: No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  const user = await verifyUserByAccessToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(body.id_token);

    return NextResponse.json({ user, decoded }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Forbidden: ${error.message}` },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { message: 'Forbidden: Invalid token' },
      { status: 403 }
    );
  }
}
