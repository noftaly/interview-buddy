import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    await prisma.resume.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: 'Resume deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
