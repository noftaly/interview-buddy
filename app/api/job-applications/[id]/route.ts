import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    await prisma.jobApplication.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
