# Interview Buddy

Simple but effective chat app to help you prepare for your next interview.\
Chat with Mistral to track your current applications, get advice on your resume, generate a cover letter, get ideas of where to apply, get help on how to prepare, and more!

## Features

- Unlimited. This is an LLM, so chat as much as you want!
- Upload your resume and let Mistral access it to give personalized advice.
- Automatically keep track of your applications based on what you tell Mistral.

## Demo

https://github.com/user-attachments/assets/45b80fde-d812-48e9-9895-2e040d8292cd

## Getting Started

First, install dependencies.
```bash
npm install
```

Then, start prisma. This generates an SQLite database in the `prisma` directory.

```bash
npx prisma migrate deploy
```

Then, fill in the `.env` file with your Mistral API Key.
```bash
MISTRAL_API_KEY=
```

Finally, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the chat app!

## Explanations

This project uses Next.js, Prisma, and Tailwind CSS.\
The chat app is built on the Mistral public API. We use Vercel’s `ai` package to interact with the API
and stream the conversation in real-time.

We have 3 tools available to the LLM:
- Upsert an application
- Get a list of applications
- Get the user’s resume

The app doesn't have authentication, and is meant to be used by a single user, in localhost.
