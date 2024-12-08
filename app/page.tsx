import JobList from '@/components/job-list';
import ChatInterface from '@/components/chat-interface';
import ResumeUpload from '@/components/resume-upload';

export default function JobApplicationAssistant() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div className="flex-1 overflow-auto">
          <JobList />
        </div>
        <ResumeUpload />
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between">
          <h1 className="text-xl font-bold text-gray-800">Interview Buddy</h1>
          <a className="text-blue-400" href="https://linkedin.com/in/emaisl" target="_blank">by Elliot Maisl</a>
        </header>
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}

