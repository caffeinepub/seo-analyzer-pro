import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import LockScreen from "./components/LockScreen";
import Sidebar from "./components/Sidebar";
import { useIsAdmin } from "./hooks/useQueries";
import Dashboard from "./pages/Dashboard";
import KeywordAnalyzer from "./pages/KeywordAnalyzer";
import SeoRecommendations from "./pages/SeoRecommendations";
import SiteCrawler from "./pages/SiteCrawler";

const queryClient = new QueryClient();

export type Page = "dashboard" | "crawler" | "keywords" | "recommendations";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">
            Initializing SEO Analyzer...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <LockScreen />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {currentPage === "dashboard" && (
          <Dashboard onNavigate={setCurrentPage} />
        )}
        {currentPage === "crawler" && <SiteCrawler />}
        {currentPage === "keywords" && <KeywordAnalyzer />}
        {currentPage === "recommendations" && <SeoRecommendations />}
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
