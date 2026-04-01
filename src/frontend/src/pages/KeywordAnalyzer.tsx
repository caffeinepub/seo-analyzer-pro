import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Copy, Loader2, Search, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SeoRecommendation } from "../backend.d";
import {
  useAllRecommendations,
  useGenerateSeoRecommendation,
} from "../hooks/useQueries";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="flex gap-2">
        <p className="flex-1 text-sm text-foreground bg-muted/30 rounded-md px-3 py-2 font-mono break-all">
          {value}
        </p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 h-auto w-9"
          onClick={handleCopy}
          data-ocid={`keywords.copy_${label.toLowerCase().replace(/\s+/g, "_")}.button`}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-success" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

function RecommendationResult({ rec }: { rec: SeoRecommendation }) {
  return (
    <Card className="bg-card border-border" data-ocid="keywords.result.card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <CardTitle className="font-display text-base">
            SEO Recommendation
          </CardTitle>
          <Badge className="bg-primary/20 text-primary border-0 ml-auto">
            {rec.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <CopyField label="Recommended Title" value={rec.recommendedTitle} />
          <CopyField
            label="Meta Description"
            value={rec.recommendedMetaDescription}
          />
          <CopyField label="Slug" value={rec.recommendedSlug} />
          <CopyField label="Target Keyphrase" value={rec.targetKeyword} />
        </div>

        {rec.competitorAnalysis.length > 0 && (
          <>
            <Separator className="bg-border" />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">
                  Competitor Analysis
                </p>
              </div>
              <div className="overflow-x-auto rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs text-muted-foreground">
                        URL
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground">
                        Title
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground">
                        Meta Description
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground text-right">
                        Content
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground text-right">
                        KW Density
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rec.competitorAnalysis.map((comp, i) => (
                      <TableRow
                        key={comp.url}
                        className="border-border"
                        data-ocid={`keywords.competitor.item.${i + 1}`}
                      >
                        <TableCell className="text-xs font-mono text-primary max-w-32 truncate">
                          {comp.url}
                        </TableCell>
                        <TableCell className="text-xs max-w-40 truncate">
                          {comp.title}
                        </TableCell>
                        <TableCell className="text-xs max-w-48 truncate text-muted-foreground">
                          {comp.metaDescription}
                        </TableCell>
                        <TableCell className="text-xs text-right">
                          {comp.contentLength.toString()}
                        </TableCell>
                        <TableCell className="text-xs text-right">
                          <Badge variant="outline" className="text-xs">
                            {comp.keywordDensity.toString()}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function KeywordAnalyzer() {
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [currentResult, setCurrentResult] = useState<SeoRecommendation | null>(
    null,
  );
  const generate = useGenerateSeoRecommendation();
  const { data: allRecs, isLoading: recsLoading } = useAllRecommendations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !keyword.trim()) return;
    try {
      const rec = await generate.mutateAsync({
        category: category.trim(),
        targetKeyword: keyword.trim(),
      });
      setCurrentResult(rec);
      toast.success("SEO recommendation generated!");
    } catch {
      toast.error("Failed to generate recommendation.");
    }
  };

  return (
    <div className="p-8 max-w-5xl" data-ocid="keywords.page">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Keyword Analyzer
        </h1>
        <p className="text-muted-foreground mt-1">
          Analyze competitors and generate winning SEO recommendations for your
          categories
        </p>
      </div>

      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="font-display text-base">
            Generate SEO Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  data-ocid="keywords.category.input"
                  placeholder="e.g. Decorative Boxes"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-keyword">Target Keyword</Label>
                <Input
                  id="target-keyword"
                  data-ocid="keywords.keyword.input"
                  placeholder="e.g. luxury gift boxes"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  required
                  className="bg-input border-border"
                />
              </div>
            </div>
            <Button
              type="submit"
              data-ocid="keywords.analyze.button"
              disabled={generate.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {generate.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {generate.isPending
                ? "Analyzing competitors..."
                : "Analyze & Generate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generate.isPending && (
        <div
          className="flex flex-col items-center gap-4 py-12"
          data-ocid="keywords.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Analyzing competitors and generating recommendations...
          </p>
        </div>
      )}

      {currentResult && !generate.isPending && (
        <div className="mb-8">
          <RecommendationResult rec={currentResult} />
        </div>
      )}

      <div>
        <h2 className="font-display text-lg font-semibold mb-4">
          Saved Recommendations
        </h2>
        {recsLoading ? (
          <div className="space-y-3">
            {["sk-1", "sk-2", "sk-3"].map((id) => (
              <Card
                key={id}
                className="bg-card border-border h-24 animate-pulse"
              />
            ))}
          </div>
        ) : allRecs?.length === 0 ? (
          <div
            className="text-center py-12"
            data-ocid="keywords.saved.empty_state"
          >
            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              No saved recommendations yet. Generate your first one above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allRecs?.map((rec, i) => (
              <Card
                key={rec.id}
                data-ocid={`keywords.saved.item.${i + 1}`}
                className="bg-card border-border"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-primary/20 text-primary border-0 text-xs">
                          {rec.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {rec.targetKeyword}
                        </span>
                      </div>
                      <p className="font-medium text-sm text-foreground truncate">
                        {rec.recommendedTitle}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {rec.recommendedMetaDescription}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground font-mono">
                        {rec.recommendedSlug}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          Number(rec.timestamp) / 1_000_000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
