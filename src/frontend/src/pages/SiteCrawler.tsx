import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CrawlSession, PageAudit } from "../backend.d";
import { useCrawlWebsite } from "../hooks/useQueries";

function PageAuditCard({ audit, index }: { audit: PageAudit; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasIssues = audit.issues.length > 0;

  const toggle = () => setExpanded((v) => !v);

  return (
    <Card
      data-ocid={`crawler.audit.item.${index}`}
      className="bg-card border-border overflow-hidden"
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/20 transition-colors text-left"
        onClick={toggle}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {hasIssues ? (
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {audit.url}
            </p>
            {audit.title && (
              <p className="text-xs text-muted-foreground truncate">
                {audit.title}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {hasIssues && (
            <Badge variant="destructive" className="text-xs">
              {audit.issues.length} issue{audit.issues.length !== 1 ? "s" : ""}
            </Badge>
          )}
          {!hasIssues && (
            <Badge className="bg-success/20 text-success border-0 text-xs">
              Pass
            </Badge>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <CardContent className="pt-0 pb-4 px-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Meta Description
              </p>
              <p className="text-sm text-foreground">
                {audit.metaDescription || (
                  <span className="text-destructive italic">Missing</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Slug
              </p>
              <p className="text-sm font-mono text-primary">
                {audit.slug || "/"}
              </p>
            </div>
            {audit.h1Headings.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  H1 Headings
                </p>
                <ul className="space-y-1">
                  {audit.h1Headings.map((h) => (
                    <li key={h} className="text-sm text-foreground">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {audit.h2Headings.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  H2 Headings
                </p>
                <ul className="space-y-1">
                  {audit.h2Headings.slice(0, 4).map((h) => (
                    <li key={h} className="text-sm text-foreground">
                      {h}
                    </li>
                  ))}
                  {audit.h2Headings.length > 4 && (
                    <li className="text-xs text-muted-foreground">
                      +{audit.h2Headings.length - 4} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {hasIssues && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Issues Found
              </p>
              <div className="flex flex-wrap gap-2">
                {audit.issues.map((issue) => (
                  <Badge
                    key={issue}
                    variant="destructive"
                    className="text-xs font-normal"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {issue}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function SiteCrawler() {
  const [url, setUrl] = useState("");
  const [followLinks, setFollowLinks] = useState(true);
  const [depth, setDepth] = useState("2");
  const [result, setResult] = useState<CrawlSession | null>(null);
  const crawl = useCrawlWebsite();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    try {
      const session = await crawl.mutateAsync({
        url: url.trim(),
        followInternalLinks: followLinks,
        depth: BigInt(depth),
      });
      setResult(session);
      toast.success(`Crawled ${session.pages.length} pages successfully`);
    } catch {
      toast.error("Crawl failed. Please check the URL and try again.");
    }
  };

  const passCount =
    result?.pages.filter((p) => p.issues.length === 0).length ?? 0;
  const failCount =
    result?.pages.filter((p) => p.issues.length > 0).length ?? 0;

  return (
    <div className="p-8 max-w-5xl" data-ocid="crawler.page">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Site Crawler
        </h1>
        <p className="text-muted-foreground mt-1">
          Scan your website for SEO issues and optimization opportunities
        </p>
      </div>

      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="font-display text-base">
            Configure Crawl
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="crawl-url">Website URL</Label>
              <Input
                id="crawl-url"
                data-ocid="crawler.url.input"
                type="url"
                placeholder="https://yourwebshop.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="follow-links"
                  data-ocid="crawler.follow_links.checkbox"
                  checked={followLinks}
                  onCheckedChange={(v) => setFollowLinks(!!v)}
                />
                <Label htmlFor="follow-links" className="cursor-pointer">
                  Follow Internal Links
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="crawl-depth">Crawl Depth</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger
                    id="crawl-depth"
                    data-ocid="crawler.depth.select"
                    className="w-24 bg-input border-border"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              data-ocid="crawler.start.button"
              disabled={crawl.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {crawl.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Globe className="w-4 h-4 mr-2" />
              )}
              {crawl.isPending
                ? "Crawling... this may take a while"
                : "Start Crawl"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {crawl.isPending && (
        <div
          className="flex flex-col items-center gap-4 py-16"
          data-ocid="crawler.loading_state"
        >
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 border-2 border-primary/20 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Crawling website...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Analyzing pages, checking SEO elements
            </p>
          </div>
        </div>
      )}

      {result && !crawl.isPending && (
        <div data-ocid="crawler.results.panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">
              Results: {result.rootUrl}
            </h2>
            <div className="flex gap-2">
              <Badge className="bg-success/20 text-success border-0">
                {passCount} passed
              </Badge>
              <Badge variant="destructive">{failCount} failed</Badge>
            </div>
          </div>
          <div className="space-y-3">
            {result.pages.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="crawler.results.empty_state"
              >
                <p className="text-muted-foreground">
                  No pages found in this crawl session.
                </p>
              </div>
            ) : (
              result.pages.map((page, i) => (
                <PageAuditCard key={page.url} audit={page} index={i + 1} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
