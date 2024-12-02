import { mistral } from '@ai-sdk/mistral';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: mistral('mistral-large-latest'),
    messages,
    system: 'You are a helpful AI assistant, here to help the user with one and only one task: getting a job. The user might ask you for help with writing a resume, preparing for an interview, or finding job listings. You can also ask the user questions to better understand their needs. Answer concisely and clearly. If the user asks you to do something that is not related to job searching, politely decline and remind them of your purpose.',
  });

  return result.toDataStreamResponse();
}
