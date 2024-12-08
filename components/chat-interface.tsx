"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';
import { useChat } from 'ai/react';
import Markdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function ChatInterface() {
  const [suggestions, setSuggestions] = useState<Array<{ display: string; content: string }>>([]);

  const queryClient = useQueryClient();
  const { messages, setMessages, input, handleInputChange, handleSubmit } = useChat({
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === 'upsertApplication') {
        queryClient.refetchQueries({ queryKey: ['jobs'] });
      }
    },
  });

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [setMessages]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages.filter(m => !!m.content)));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    handleSubmit();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.filter(m => !!m.content).map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-gray-200 p-4">
        <div className="flex flex-col gap-2 pb-4">
          <div className="flex gap-4">
            <div className="font-bold bg-blue-50 text-blue-500 rounded-full px-4 py-1 cursor-pointer" onClick={() => {
              setSuggestions([
                { display: 'I‘ve applied', content: "I've just applied at … as a …!" },
                { display: 'I am interviewing', content: 'I am now interviewing at …' },
                { display: 'I was given an offer', content: 'I was given an offer at …' },
              ]);
            }}>
              Track my applications
            </div>
            <div className="font-bold bg-amber-50 text-amber-500 rounded-full px-4 py-1 cursor-pointer" onClick={() => {
              setSuggestions([
                { display: 'Rate my resume', content: "Give me feedback on my resume, what can I improve, what's great, what do hiring managers in my field expect?" },
                { display: 'Create a cover letter', content: 'I need help creating a cover letter for …' },
                { display: 'Working environment', content: 'The interviewer told me that …. Is this reflective of a good working environment? What can I expect working at this company?' },
              ]);
            }}>
              Give advice
            </div>
            <div className="font-bold bg-purple-50 text-purple-500 rounded-full px-4 py-1 cursor-pointer" onClick={() => {
              setSuggestions([
                { display: 'My upcoming interviews', content: 'Based on my applications, where can I expect to be interviewed at next?' },
                { display: 'Company ideas', content: 'Give me some ideas of companies I should apply to, based on my skills, interests and past experiences.' },
              ]);
            }}>
              Figure out what‘s next
            </div>
            <div className="font-bold bg-green-50 text-green-500 rounded-full px-4 py-1 cursor-pointer" onClick={() => {
              setSuggestions([
                { display: 'STAR method', content: 'Can you explain the STAR method to me?' },
                { display: 'Interview questions', content: 'What are some common interview questions I should prepare for?' },
                { display: 'Interview preparation', content: 'How should I prepare for an interview?' },
              ]);
            }}>
              Prepare for an interview
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="flex gap-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.content}
                  className="bg-gray-50 rounded-full px-3 py-1 cursor-pointer"
                  onClick={() => {
                    setSuggestions([]);
                    // @ts-expect-error: This is an easy way to set the input value. It's not a real event.
                    handleInputChange({ target: { value: suggestion.content } });
                  }}
                >
                  {suggestion.display}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyUp={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

