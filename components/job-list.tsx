"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { capitalize, titleCase } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface JobApplication {
  id: number;
  company: string;
  position?: string;
  status: string;
  createdAt: Date;
}

export default function JobList() {
  const queryClient = useQueryClient();

  const jobs = useQuery<JobApplication[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await fetch("/api/job-applications");
      return response.json();
    },
    staleTime: 1,
  });

  const removeJob = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/job-applications/${id}`, { method: "DELETE" });
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });

      const previousJobs = queryClient.getQueryData(['jobs']);
      queryClient.setQueryData(['jobs'], (prevJobs: JobApplication[] | undefined) => prevJobs?.filter((job) => job.id !== id));

      return { previousJobs };
    },
    onError: (err, newJob, context) => {
      queryClient.setQueryData(['jobs'], context?.previousJobs);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Applications History</h2>
      </div>
      <ScrollArea className="flex-1">
        <ul className="divide-y divide-gray-200">
          {jobs.isLoading && (
            <>
              <li>
                <Skeleton className="h-4 m-2 w-[30%]" />
                <Skeleton className="h-4 m-2 w-[70%]" />
              </li>
              <li>
                <Skeleton className="h-4 m-2 w-[30%]" />
                <Skeleton className="h-4 m-2 w-[70%]" />
              </li>
              <li>
                <Skeleton className="h-4 m-2 w-[30%]" />
                <Skeleton className="h-4 m-2 w-[70%]" />
              </li>
            </>
          )}
          {jobs.data?.map((job) => (
            <li key={job.id} className="p-4 group flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-800">{capitalize(job.company)}{job.position && ` • ${titleCase(job.position)}`}</div>
                <div className="text-sm text-gray-500">{capitalize(job.status)}</div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => removeJob.mutate(job.id)} className="hover:text-red-700">
                  <Trash size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {jobs.data?.length === 0 && (
          <div className="p-4 text-gray-500 text-center">You haven‘t applied anywhere yet!</div>
        )}
      </ScrollArea>
    </div>
  );
}

