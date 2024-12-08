import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const application = await prisma.jobApplication.findMany();

  return NextResponse.json(application);
}
