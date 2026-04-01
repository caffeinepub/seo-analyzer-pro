# SEO Analyzer Pro

## Current State
New project. Empty workspace.

## Requested Changes (Diff)

### Add
- Website crawler: user enters a URL, backend fetches pages via HTTP outcalls, extracts title, meta description, h1/h2/h3, images alt tags, canonical, slug, page speed hints
- SEO audit report: per-page scoring with issues list (missing meta, duplicate titles, long/short descriptions, missing alt, bad slugs, etc.)
- Category keyword analyzer: user enters category names, app fetches Google search results via HTTP outcalls to simulate competitor analysis, extracts top-ranking page titles and meta descriptions
- SEO recommendations engine: suggests optimized meta description, SEO title, keyphrase, and slug for each category/page based on competitor data
- Dashboard: overview of total pages scanned, issues found, score breakdown
- Authorization: admin-only access
- Data persistence: store crawl results, keyword analyses, and recommendations in backend

### Modify
Nothing (new project)

### Remove
Nothing

## Implementation Plan
1. Backend: define data types for CrawlResult, PageAudit, KeywordAnalysis, SEORecommendation
2. Backend: crawlPage(url) - HTTP outcall to fetch page HTML, parse meta tags, title, headings, images
3. Backend: crawlSite(baseUrl) - crawl up to 50 pages following internal links
4. Backend: analyzeKeyword(keyword, category) - HTTP outcall to search engines for competitor data
5. Backend: generateRecommendations(category, competitorData) - produce winning title/meta/keyphrase/slug suggestions
6. Backend: store and retrieve crawl sessions and recommendations
7. Frontend: Dashboard page with stats cards
8. Frontend: Site Crawler page - enter URL, trigger crawl, show per-page audit results with issues
9. Frontend: Keyword Analyzer page - enter category keywords, show competitor analysis and recommendations table
10. Frontend: Recommendations page - per-category SEO suggestions (title, meta, keyphrase, slug)
