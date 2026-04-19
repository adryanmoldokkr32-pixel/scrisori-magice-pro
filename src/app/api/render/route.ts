import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: "Funcția de randare video este în curs de activare pe server. Îarcă din nou în câteva minute." },
    { status: 202 }
  );
}
