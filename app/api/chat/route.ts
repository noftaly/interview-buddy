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
    system: 'You are a helpful AI assistant, here to help the user with one and only one task: getting a job. The user might ask you for help with writing a resume, preparing for an interview, or finding job listings. You can also ask the user questions to better understand their needs. Answer concisely and clearly. If the user asks you to do something that is not related to job searching, politely decline and remind them of your purpose. If they mention an application and a status, you can help them update the status of the application. If they want a list of all their applications, you can provide that as well.',
    tools: {
      changeApplicationStatus: tool({
        description: 'Change the status of an application, such as "applied", "interviewing", "offered" or "rejected".',
        parameters: z.object({
          company: z.string(),
          position: z.string().optional(),
          status: z.string(),
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
    },
    maxSteps: 2,
  });

  return result.toDataStreamResponse();
}
