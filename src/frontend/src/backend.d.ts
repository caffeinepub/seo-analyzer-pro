import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CrawlRequest {
    url: string;
    followInternalLinks: boolean;
    depth: bigint;
}
export interface CrawlSession {
    id: string;
    rootUrl: string;
    timestamp: bigint;
    pages: Array<PageAudit>;
}
export interface SeoRecommendation {
    id: string;
    recommendedMetaDescription: string;
    recommendedSlug: string;
    competitorAnalysis: Array<CompetitorData>;
    timestamp: bigint;
    category: string;
    recommendedTitle: string;
    targetKeyword: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CompetitorData {
    url: string;
    metaDescription: string;
    title: string;
    contentLength: bigint;
    keywordDensity: bigint;
}
export interface PageAudit {
    url: string;
    metaDescription: string;
    title: string;
    imageAltTexts: Array<string>;
    slug: string;
    h2Headings: Array<string>;
    issues: Array<string>;
    h1Headings: Array<string>;
    canonicalUrl: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    analyzeCompetitors(category: string, targetKeyword: string): Promise<Array<CompetitorData>>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    crawlWebsite(request: CrawlRequest): Promise<CrawlSession>;
    generateSeoRecommendation(category: string, targetKeyword: string): Promise<SeoRecommendation>;
    getAllCrawlSessions(): Promise<Array<CrawlSession>>;
    getAllRecommendations(): Promise<Array<SeoRecommendation>>;
    getCallerUserRole(): Promise<UserRole>;
    getCrawlSessionById(id: string): Promise<CrawlSession | null>;
    getRecommendationByCategory(category: string): Promise<SeoRecommendation | null>;
    isCallerAdmin(): Promise<boolean>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
