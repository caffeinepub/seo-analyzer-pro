import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SeoRecommendation } from "../backend.d";
import { useAllRecommendations } from "../hooks/useQueries";

function ExpandableRow({
  rec,
  index,
}: { rec: SeoRecommendation; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        className="border-border cursor-pointer hover:bg-muted/20 transition-colors"
        data-ocid={`recommendations.item.${index}`}
        onClick={() => setExpanded((v) => !v)}
      >
        <TableCell className="py-3">
          <Badge className="bg-primary/20 text-primary border-0 text-xs whitespace-nowrap">
            {rec.category}
          </Badge>
        </TableCell>
        <TableCell className="py-3">
          <span className="text-xs text-foreground">{rec.targetKeyword}</span>
        </TableCell>
        <TableCell className="py-3 max-w-56">
          <p className="text-xs text-foreground truncate">
            {rec.recommendedTitle}
          </p>
        </TableCell>
        <TableCell className="py-3 max-w-56">
          <p className="text-xs text-muted-foreground truncate">
            {rec.recommendedMetaDescription}
          </p>
        </TableCell>
        <TableCell className="py-3">
          <p className="text-xs font-mono text-primary truncate max-w-32">
            {rec.recommendedSlug}
          </p>
        </TableCell>
        <TableCell className="py-3">
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(Number(rec.timestamp) / 1_000_000).toLocaleDateString()}
          </p>
        </TableCell>
        <TableCell className="py-3">
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </TableCell>
      </TableRow>
      {expanded && rec.competitorAnalysis.length > 0 && (
        <TableRow className="border-border">
          <TableCell colSpan={7} className="p-0">
            <div className="bg-muted/20 p-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Competitor Analysis
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-1.5 pr-3 text-muted-foreground font-medium">
                        URL
                      </th>
                      <th className="text-left py-1.5 pr-3 text-muted-foreground font-medium">
                        Title
                      </th>
                      <th className="text-left py-1.5 pr-3 text-muted-foreground font-medium">
                        Meta Description
                      </th>
                      <th className="text-right py-1.5 pr-3 text-muted-foreground font-medium">
                        Content Length
                      </th>
                      <th className="text-right py-1.5 text-muted-foreground font-medium">
                        KW Density
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rec.competitorAnalysis.map((comp, i) => (
                      <tr
                        key={comp.url}
                        data-ocid={`recommendations.competitor.item.${i + 1}`}
                      >
                        <td className="py-2 pr-3">
                          <a
                            href={comp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 max-w-40 truncate"
                          >
                            {comp.url}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </td>
                        <td className="py-2 pr-3 text-foreground max-w-40 truncate">
                          {comp.title}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground max-w-48 truncate">
                          {comp.metaDescription}
                        </td>
                        <td className="py-2 pr-3 text-right text-foreground">
                          {comp.contentLength.toString()}
                        </td>
                        <td className="py-2 text-right">
                          <Badge variant="outline" className="text-xs">
                            {comp.keywordDensity.toString()}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function SeoRecommendations() {
  const { data: recommendations, isLoading } = useAllRecommendations();

  const exportCsv = () => {
    if (!recommendations || recommendations.length === 0) return;
    const headers = [
      "Category",
      "Keyword",
      "Recommended Title",
      "Meta Description",
      "Slug",
      "Date",
    ];
    const rows = recommendations.map((r) => [
      `"${r.category}"`,
      `"${r.targetKeyword}"`,
      `"${r.recommendedTitle.replace(/"/g, "'")}"`,
      `"${r.recommendedMetaDescription.replace(/"/g, "'")}"`,
      `"${r.recommendedSlug}"`,
      `"${new Date(Number(r.timestamp) / 1_000_000).toLocaleDateString()}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "seo-recommendations.csv";
    a.click();
    URL.revokeObjectURL(objectUrl);
    toast.success("CSV exported successfully");
  };

  return (
    <div className="p-8 max-w-7xl" data-ocid="recommendations.page">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            SEO Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            All generated SEO recommendations and competitor insights
          </p>
        </div>
        <Button
          variant="outline"
          data-ocid="recommendations.export.button"
          onClick={exportCsv}
          disabled={!recommendations || recommendations.length === 0}
          className="shrink-0"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="font-display text-base">
              All Recommendations
            </CardTitle>
            {recommendations && (
              <Badge variant="secondary" className="ml-auto">
                {recommendations.length} total
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="p-6 space-y-3"
              data-ocid="recommendations.loading_state"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recommendations?.length === 0 ? (
            <div
              className="text-center py-16 px-6"
              data-ocid="recommendations.empty_state"
            >
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground mb-1">
                No recommendations yet
              </p>
              <p className="text-sm text-muted-foreground">
                Use the Keyword Analyzer to generate your first SEO
                recommendation.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      Keyword
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      Recommended Title
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      Meta Description
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      Slug
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations?.map((rec, i) => (
                    <ExpandableRow key={rec.id} rec={rec} index={i + 1} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
