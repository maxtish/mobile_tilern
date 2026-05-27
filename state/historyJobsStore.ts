import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HistoryJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type HistoryJobStepStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export type HistoryJobStep = {
  key: string;
  title: string;
  status: HistoryJobStepStatus;
  error?: string;
};

export type HistoryJob = {
  id: string;
  userId: string;
  status: HistoryJobStatus;
  progress: number;
  steps: HistoryJobStep[];
  error?: string;
  resultHistoryId?: string;
  createdAt: string;
  updatedAt: string;
};

type HistoryJobsState = {
  jobs: HistoryJob[];
  hiddenJobIds: string[];
  statusExpanded: boolean;

  setStatusExpanded: (expanded: boolean) => void;
  toggleStatusExpanded: () => void;

  upsertJob: (job: HistoryJob) => void;
  setJobs: (jobs: HistoryJob[]) => void;
  removeJob: (jobId: string) => void;
  clearFinishedJobs: () => void;
  reset: () => void;
};

export const useHistoryJobsStore = create<HistoryJobsState>()(
  persist(
    set => ({
      jobs: [],
      hiddenJobIds: [],
      statusExpanded: true,

      setStatusExpanded: expanded => set({ statusExpanded: expanded }),

      toggleStatusExpanded: () =>
        set(state => ({ statusExpanded: !state.statusExpanded })),

      upsertJob: job =>
        set(state => {
          if (state.hiddenJobIds.includes(job.id)) {
            return state;
          }

          const exists = state.jobs.some(item => item.id === job.id);

          return {
            jobs: exists
              ? state.jobs.map(item => (item.id === job.id ? job : item))
              : [job, ...state.jobs],
          };
        }),

      setJobs: jobs =>
        set(state => {
          const localJobsMap = new Map(state.jobs.map(job => [job.id, job]));

          for (const serverJob of jobs) {
            if (state.hiddenJobIds.includes(serverJob.id)) {
              continue;
            }

            localJobsMap.set(serverJob.id, serverJob);
          }

          return {
            jobs: [...localJobsMap.values()].sort((a, b) =>
              b.createdAt.localeCompare(a.createdAt),
            ),
          };
        }),

      removeJob: jobId =>
        set(state => ({
          hiddenJobIds: [...new Set([...state.hiddenJobIds, jobId])],
          jobs: state.jobs.filter(job => job.id !== jobId),
        })),

      clearFinishedJobs: () =>
        set(state => {
          const finishedJobs = state.jobs.filter(
            job => job.status === 'completed' || job.status === 'failed',
          );

          return {
            hiddenJobIds: [
              ...new Set([
                ...state.hiddenJobIds,
                ...finishedJobs.map(job => job.id),
              ]),
            ],
            jobs: state.jobs.filter(
              job => job.status === 'queued' || job.status === 'processing',
            ),
          };
        }),

      reset: () =>
        set({
          jobs: [],
          hiddenJobIds: [],
          statusExpanded: true,
        }),
    }),
    {
      name: 'history-jobs-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
