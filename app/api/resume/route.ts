import { NextResponse } from 'next/server';
import PDFParser from "pdf2json";
import prisma from '@/lib/prisma';

const pdfParser = new PDFParser(this, true);

function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', (errData) => reject(errData.parserError));
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const text = decodeURIComponent(
        pdfData.Pages[0].Texts.map((text) => text.R[0].T).join(" ")
      );
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const content = await parsePdfBuffer(buffer);

  const resume = await prisma.resume.create({ data: { content } });

  return NextResponse.json(resume);
}

export async function GET() {
  const resume = await prisma.resume.findFirst({ orderBy: { createdAt: 'desc' } });

  return NextResponse.json(resume);
}
