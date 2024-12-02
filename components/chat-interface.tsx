"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';
import { useChat } from 'ai/react';
import Markdown from 'react-markdown';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function ChatInterface() {
  const queryClient = useQueryClient();
  const { messages, setMessages, input, handleInputChange, handleSubmit } = useChat({
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === 'upsertApplication') {
        queryClient.refetchQueries(['jobs']);
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

