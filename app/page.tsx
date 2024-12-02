import JobList from '@/components/job-list';
import ChatInterface from '@/components/chat-interface';

export default function JobApplicationAssistant() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r border-gray-200">
        <JobList />
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between">
          <h1 className="text-xl font-bold text-gray-800">Interview Buddy</h1>
          <p className="text-muted-foreground">by Elliot Maisl</p>
        </header>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}

