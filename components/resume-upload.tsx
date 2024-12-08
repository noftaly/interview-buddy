"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Resume {
  id: number;
  content: string;
  createdAt: string;
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);

  const resume = useQuery<Resume>({
    queryKey: ['resume'],
    queryFn: async () => {
      const response = await fetch("/api/resume");
      return response.json();
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      fetch('/api/resume', { method: 'POST', body: formData })
        .then(response => {
          if (!response.ok) alert('Failed to upload resume');
        });

        setFile(null);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{resume.data ? "Update" : "Upload"} Your Resume</h3>
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="text-sm"
        />
        <Button onClick={handleUpload} disabled={!file} size="sm">
          <Upload className="h-4 w-4" />
        </Button>
      </div>
      {file && (
        <p className="text-sm text-gray-500 mt-2">
          Selected file: {file.name}
        </p>
      )}
      {resume.data && (
        <p className="text-sm text-gray-500 mt-2">
          Last uploaded: {new Date(resume.data.createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

