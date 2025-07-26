import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { DigitalData, Streak, Tip } from "@shared/schema";

export function useDigitalData(userId: number) {
  return useQuery<DigitalData>({
    queryKey: ["/api/digital-data", userId],
    enabled: !!userId && userId > 0,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useStreak(userId: number) {
  return useQuery<Streak>({
    queryKey: ["/api/streaks", userId],
    enabled: !!userId && userId > 0,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useRandomTip() {
  return useQuery<Tip>({
    queryKey: ["/api/tips/random"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useScanDigitalData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("POST", `/api/digital-data/${userId}/scan`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/digital-data", data.userId] });
    },
  });
}

export function useUpdateStreak() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("POST", `/api/streaks/${userId}/update`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/streaks", data.userId] });
    },
  });
}

export function useUpdateDigitalData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: number; updates: Partial<DigitalData> }) => {
      const response = await apiRequest("PATCH", `/api/digital-data/${userId}`, updates);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/digital-data", data.userId] });
    },
  });
}
