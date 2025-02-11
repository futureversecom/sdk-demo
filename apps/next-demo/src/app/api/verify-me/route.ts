import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUser } from '@/lib/server-utils';

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();

    const user = await verifyUser(cookieStore);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
