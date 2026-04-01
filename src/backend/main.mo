import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type CrawlRequest = {
    url : Text;
    depth : Nat;
    followInternalLinks : Bool;
  };

  type PageAudit = {
    url : Text;
    title : Text;
    metaDescription : Text;
    h1Headings : [Text];
    h2Headings : [Text];
    imageAltTexts : [Text];
    canonicalUrl : Text;
    slug : Text;
    issues : [Text];
  };

  type CrawlSession = {
    id : Text;
    rootUrl : Text;
    pages : [PageAudit];
    timestamp : Int;
  };

  type CompetitorData = {
    url : Text;
    title : Text;
    metaDescription : Text;
    keywordDensity : Nat;
    contentLength : Nat;
  };

  type SeoRecommendation = {
    id : Text;
    category : Text;
    targetKeyword : Text;
    recommendedTitle : Text;
    recommendedMetaDescription : Text;
    recommendedSlug : Text;
    competitorAnalysis : [CompetitorData];
    timestamp : Int;
  };

  module SeoRecommendation {
    public func compareByCategory(a : SeoRecommendation, b : SeoRecommendation) : Order.Order {
      switch (Text.compare(a.category, b.category)) {
        case (#equal) { Text.compare(a.targetKeyword, b.targetKeyword) };
        case (order) { order };
      };
    };
  };

  // Data storage
  var nextCrawlSessionId = 0;
  var nextRecommendationId = 0;
  let crawlSessions = Map.empty<Text, CrawlSession>();
  let recommendations = Map.empty<Text, SeoRecommendation>();
  var competitorData : [CompetitorData] = [];

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper functions
  func generateId(prefix : Text, counter : Nat) : Text {
    prefix # counter.toText();
  };

  func analyzePageAudit(page : PageAudit) : PageAudit {
    var issues : [Text] = [];

    if (page.title.size() > 60) {
      issues := issues.concat(["Title too long"]);
    } else if (page.title.size() < 10) {
      issues := issues.concat(["Title too short"]);
    };

    if (page.metaDescription.size() < 50) {
      issues := issues.concat(["Meta description too short"]);
    };

    if (page.h1Headings.size() == 0) {
      issues := issues.concat(["Missing H1 heading"]);
    };

    if (page.imageAltTexts.size() < 3) {
      issues := issues.concat(["Missing image alt texts"]);
    };

    {
      url = page.url;
      title = page.title;
      metaDescription = page.metaDescription;
      h1Headings = page.h1Headings;
      h2Headings = page.h2Headings;
      imageAltTexts = page.imageAltTexts;
      canonicalUrl = page.canonicalUrl;
      slug = page.slug;
      issues;
    };
  };

  // Transform function for HTTP outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Convert Blob to Text
  func blobToText(_blob : Blob) : Text {
    "";
  };

  // Public methods
  public shared ({ caller }) func crawlWebsite(request : CrawlRequest) : async CrawlSession {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform website crawl");
    };

    let _httpResponse = await OutCall.httpGetRequest(request.url, [], transform);

    let pageAudit : PageAudit = {
      url = request.url;
      title = "Sample Title";
      metaDescription = "Sample Meta Description";
      h1Headings = ["Sample H1"];
      h2Headings = ["Sample H2"];
      imageAltTexts = ["Sample Image Alt"];
      canonicalUrl = request.url;
      slug = request.url;
      issues = ["Sample Issue"];
    };

    let analyzedPage = analyzePageAudit(pageAudit);

    let crawlSession : CrawlSession = {
      id = generateId("crawlSession", nextCrawlSessionId);
      rootUrl = request.url;
      pages = [analyzedPage];
      timestamp = Time.now();
    };

    nextCrawlSessionId += 1;
    crawlSessions.add(crawlSession.id, crawlSession);

    crawlSession;
  };

  public query ({ caller }) func getCrawlSessionById(id : Text) : async ?CrawlSession {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access crawl sessions");
    };
    crawlSessions.get(id);
  };

  public query ({ caller }) func getAllCrawlSessions() : async [CrawlSession] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access all crawl sessions");
    };
    crawlSessions.values().toArray();
  };

  public shared ({ caller }) func analyzeCompetitors(category : Text, targetKeyword : Text) : async [CompetitorData] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform competitor analysis");
    };

    let _httpResponse = await OutCall.httpGetRequest("https://www.google.com/search?q=" # targetKeyword, [], transform);

    let newCompetitorData : [CompetitorData] = [{
      url = "https://www.competitor1.com";
      title = "Competitor 1 Title";
      metaDescription = "Competitor 1 Meta Description";
      keywordDensity = 3;
      contentLength = 2000;
    }];

    let combinedCompetitorData = competitorData.concat(newCompetitorData);
    competitorData := combinedCompetitorData;

    competitorData;
  };

  public shared ({ caller }) func generateSeoRecommendation(category : Text, targetKeyword : Text) : async SeoRecommendation {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can generate SEO recommendations");
    };

    let competitorArray = competitorData;

    let recommendation : SeoRecommendation = {
      id = generateId("recommendation", nextRecommendationId);
      category;
      targetKeyword;
      recommendedTitle = "Optimized Title for " # targetKeyword;
      recommendedMetaDescription = "Optimized Meta Description for " # targetKeyword;
      recommendedSlug = "/optimized-slug";
      competitorAnalysis = competitorArray;
      timestamp = Time.now();
    };

    nextRecommendationId += 1;
    recommendations.add(recommendation.id, recommendation);

    recommendation;
  };

  public query ({ caller }) func getRecommendationByCategory(category : Text) : async ?SeoRecommendation {
    recommendations.values().find(
      func(rec) {
        rec.category == category;
      }
    );
  };

  public query ({ caller }) func getAllRecommendations() : async [SeoRecommendation] {
    recommendations.values().toArray().sort(SeoRecommendation.compareByCategory);
  };
};
