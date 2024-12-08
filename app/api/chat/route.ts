import prisma from '@/lib/prisma';
import { mistral } from '@ai-sdk/mistral';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: mistral('mistral-large-latest'),
    messages,
    system: 'You are a helpful AI assistant, here to help the user with one and only one task: getting a job. The user might ask you for help with writing a resume, preparing for an interview, or finding job listings. You can also ask the user questions to better understand their needs. Answer concisely and clearly. If the user asks you to do something that is not related to job searching, politely decline and remind them of your purpose.',
    tools: {
      upsertApplication: tool({
        description: 'Use this tool to create or update an application. You need the name of the company, and the status such as "applied", "interviewing", "offered" or "rejected".',
        parameters: z.object({
          company: z.string().describe('The company name.'),
          position: z.string().optional().describe('The position/role. This is optional and should be left empty if not provided.'),
          status: z.string().describe('The status of the application.'),
        }),
        execute: async ({ company, position, status }) => {
          const existingApplication = await prisma.jobApplication.findFirst({ where: { company, position } });
          if (existingApplication) {
            if (existingApplication.status !== status) {
              await prisma.jobApplication.update({
                where: { id: existingApplication.id },
                data: { status },
              });
            }
            return `Updated status for ${company} ${position ? ` - ${position}` : ''} to ${status}.`;
          } else {
            await prisma.jobApplication.create({
              data: { company, position, status },
            });
            return `Created a new application for ${company} ${position ? ` - ${position}` : ''} with status ${status}.`;
          }
        },
      }),
      listApplications: tool({
        description: 'List all the user’s job applications in a concise list.',
        parameters: z.object({}),
        execute: async () => {
          const applications = await prisma.jobApplication.findMany();
          return applications.map(({ company, position, status }) => `${company} ${position ? ` - ${position}` : ''}: ${status}`);
        },
      }),
      getResume: tool({
        description: 'Retrieve the user’s resume / CV. Use this IF and ONLY IF they ask for advice for an interview, where to apply, to create a cover letter or to contact a hiring manager, or anything personal about them (interests, education, projects...). You only get the extracted text, so refrain from commenting on its formatting and appearance.',
        parameters: z.object({}),
        execute: async () => {
          const resume = await prisma.resume.findFirst({ orderBy: { createdAt: 'desc' } });
          return resume?.content ?? 'The user has not uploaded a resume yet.';
        },
      }),
    },
    maxSteps: 2,
  });

  return result.toDataStreamResponse();
}
