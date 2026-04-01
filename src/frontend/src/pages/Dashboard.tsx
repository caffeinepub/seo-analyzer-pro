import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Lightbulb,
  Tag,
} from "lucide-react";
import type { ComponentType } from "react";
import type { Page } from "../App";
import {
  useAllCrawlSessions,
  useAllRecommendations,
} from "../hooks/useQueries";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-display font-bold text-foreground">
              {value}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: sessions, isLoading: sessionsLoading } = useAllCrawlSessions();
  const { data: recommendations, isLoading: recsLoading } =
    useAllRecommendations();

  const totalPages = sessions?.reduce((acc, s) => acc + s.pages.length, 0) ?? 0;
  const totalIssues =
    sessions?.reduce(
      (acc, s) => acc + s.pages.reduce((p, pg) => p + pg.issues.length, 0),
      0,
    ) ?? 0;
  const categories = [...new Set(recommendations?.map((r) => r.category) ?? [])]
    .length;

  return (
    <div className="p-8 max-w-7xl" data-ocid="dashboard.page">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          SEO Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of your website's SEO health and optimization status
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sessionsLoading || recsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              icon={Globe}
              label="Pages Crawled"
              value={totalPages}
              color="bg-primary/10 text-primary"
            />
            <StatCard
              icon={AlertTriangle}
              label="Issues Found"
              value={totalIssues}
              color="bg-destructive/10 text-destructive"
            />
            <StatCard
              icon={Tag}
              label="Categories Analyzed"
              value={categories}
              color="bg-success/10 text-success"
            />
            <StatCard
              icon={Lightbulb}
              label="Recommendations"
              value={recommendations?.length ?? 0}
              color="bg-warning/10 text-warning"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className="bg-card border-border"
          data-ocid="dashboard.crawl_sessions.card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-base font-semibold">
              Recent Crawl Sessions
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="dashboard.crawler.button"
              onClick={() => onNavigate("crawler")}
              className="text-primary hover:text-primary text-xs"
            >
              Start New <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessionsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : sessions?.length === 0 ? (
              <div
                className="text-center py-8"
                data-ocid="dashboard.sessions.empty_state"
              >
                <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No crawl sessions yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => onNavigate("crawler")}
                  data-ocid="dashboard.start_crawl.button"
                >
                  Start Crawling
                </Button>
              </div>
            ) : (
              sessions?.slice(0, 5).map((session, i) => (
                <div
                  key={session.id}
                  data-ocid={`dashboard.session.item.${i + 1}`}
                  className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                      <p className="text-sm font-medium text-foreground truncate">
                        {session.rootUrl}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          Number(session.timestamp) / 1_000_000,
                        ).toLocaleDateString()}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0"
                      >
                        {session.pages.length} pages
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card
          className="bg-card border-border"
          data-ocid="dashboard.recommendations.card"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-base font-semibold">
              Recent Recommendations
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="dashboard.keywords.button"
              onClick={() => onNavigate("keywords")}
              className="text-primary hover:text-primary text-xs"
            >
              Analyze <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : recommendations?.length === 0 ? (
              <div
                className="text-center py-8"
                data-ocid="dashboard.recommendations.empty_state"
              >
                <Lightbulb className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No recommendations generated yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => onNavigate("keywords")}
                  data-ocid="dashboard.start_analysis.button"
                >
                  Analyze Keywords
                </Button>
              </div>
            ) : (
              recommendations?.slice(0, 5).map((rec, i) => (
                <div
                  key={rec.id}
                  data-ocid={`dashboard.recommendation.item.${i + 1}`}
                  className="p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-primary/20 text-primary border-0 text-xs">
                      {rec.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {rec.targetKeyword}
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-medium truncate">
                    {rec.recommendedTitle}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
