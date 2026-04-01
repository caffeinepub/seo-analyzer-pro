import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CompetitorData,
  CrawlRequest,
  CrawlSession,
  SeoRecommendation,
} from "../backend.d";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllCrawlSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<CrawlSession[]>({
    queryKey: ["crawlSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCrawlSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllRecommendations() {
  const { actor, isFetching } = useActor();
  return useQuery<SeoRecommendation[]>({
    queryKey: ["recommendations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecommendations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCrawlWebsite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<CrawlSession, Error, CrawlRequest>({
    mutationFn: async (request) => {
      if (!actor) throw new Error("Not connected");
      return actor.crawlWebsite(request);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crawlSessions"] });
    },
  });
}

export function useGenerateSeoRecommendation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<
    SeoRecommendation,
    Error,
    { category: string; targetKeyword: string }
  >({
    mutationFn: async ({ category, targetKeyword }) => {
      if (!actor) throw new Error("Not connected");
      return actor.generateSeoRecommendation(category, targetKeyword);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}

export function useAnalyzeCompetitors() {
  const { actor } = useActor();
  return useMutation<
    CompetitorData[],
    Error,
    { category: string; targetKeyword: string }
  >({
    mutationFn: async ({ category, targetKeyword }) => {
      if (!actor) throw new Error("Not connected");
      return actor.analyzeCompetitors(category, targetKeyword);
    },
  });
}
