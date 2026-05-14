import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { studentGuideBlogData } from "@/lib/student-guide-blog-data";
import { Button } from "@/components/ui/button";
import { StudentGuideNav } from "@/components/student-guide/StudentGuideNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, ExternalLink, Loader2, BookOpen, Building, Briefcase, Landmark, Heart, Train, Plane } from "lucide-react";

const getLucideIcon = (iconName: string, className: string = "w-6 h-6") => {
  const props = { className, strokeWidth: 1.5 };
  switch(iconName) {
    case "Passport": return <Plane {...props} />;
    case "Building": return <Building {...props} />;
    case "Landmark": return <Landmark {...props} />;
    case "Briefcase": return <Briefcase {...props} />;
    case "Heart": return <Heart {...props} />;
    case "Train": return <Train {...props} />;
    default: return <BookOpen {...props} />;
  }
};
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { getVisaRequirements } from "@/server-functions/ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/student-guide/$country/$category")({
  component: DetailedGuidePage,
});

const ORIGIN_PASSPORTS = [
  { id: "AR", name: "Argentina" },
  { id: "AU", name: "Australia" },
  { id: "BR", name: "Brazil" },
  { id: "CA", name: "Canada" },
  { id: "CN", name: "China" },
  { id: "EG", name: "Egypt" },
  { id: "IN", name: "India" },
  { id: "ID", name: "Indonesia" },
  { id: "JP", name: "Japan" },
  { id: "MX", name: "Mexico" },
  { id: "NG", name: "Nigeria" },
  { id: "PK", name: "Pakistan" },
  { id: "RU", name: "Russia" },
  { id: "SA", name: "Saudi Arabia" },
  { id: "ZA", name: "South Africa" },
  { id: "KR", name: "South Korea" },
  { id: "TR", name: "Turkey" },
  { id: "AE", name: "United Arab Emirates" },
  { id: "US", name: "United States" },
  { id: "VN", name: "Vietnam" },
];

function DetailedGuidePage() {
  const params = Route.useParams();
  const countryKey = (params.country ?? "").toLowerCase();
  const categoryKey = (params.category ?? "").toLowerCase();
  const nav = useNavigate();
  const countryData = studentGuideBlogData[countryKey];
  const [activeCategory, setActiveCategory] = useState(categoryKey);

  // AI fetcher states
  const [origin, setOrigin] = useState("");
  const [visaMarkdown, setVisaMarkdown] = useState("");
  const [fetchingVisa, setFetchingVisa] = useState(false);
  const fetchVisaFn = useServerFn(getVisaRequirements);

  useEffect(() => {
    setActiveCategory(categoryKey);
  }, [categoryKey]);

  if (!countryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Country Not Found</h1>
          <Link to="/app/student-guide">
            <Button>Back to Guide</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryData = countryData.categories[activeCategory];

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <Link to="/app/student-guide/$country" params={{ country: countryKey }}>
            <Button>Back to Country</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCategoryChange = (newCategory: string) => {
    setActiveCategory(newCategory);
    nav({
      to: "/app/student-guide/$country/$category",
      params: { country: countryKey, category: newCategory },
    });
  };

  const handleRoleplay = () => {
    if (categoryData.roleplayScenario) {
      toast.success(`Starting roleplay: ${categoryData.roleplayScenario}`);
      nav({ 
        to: "/app/roleplay", 
        search: { lang: countryData.countryCode.toLowerCase(), scenario: categoryData.roleplayScenario } 
      });
    }
  };

  const handleFetchVisa = async () => {
    if (!origin) return toast.error("Please select your passport");
    setFetchingVisa(true);
    setVisaMarkdown("");
    try {
      const originName = ORIGIN_PASSPORTS.find((p) => p.id === origin)?.name || origin;
      const res = await fetchVisaFn({
        data: { originCountry: originName, destinationCountry: countryData.country },
      });
      setVisaMarkdown(res.markdown);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setFetchingVisa(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card/50 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <Link
            to="/app/student-guide/$country"
            params={{ country: countryKey }}
            className="mb-3 sm:mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to {countryData.country}
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-muted border border-border/80 flex items-center justify-center text-foreground shadow-sm shrink-0">
                  {getLucideIcon(categoryData.icon, "w-6 h-6 sm:w-8 sm:h-8")}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold">
                    {categoryData.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {categoryData.description}
                  </p>
                </div>
              </div>
            </div>

            {categoryData.roleplayScenario && (
              <Button
                onClick={handleRoleplay}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-white shadow-sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Practice with Roleplay
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation */}
      <StudentGuideNav
        categories={Object.keys(countryData.categories)}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Visa Dynamic Section */}
        {categoryKey === "visa" && (
          <Card className="mb-8 border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 rounded-t-xl">
              <CardTitle>Visa Checker</CardTitle>
              <CardDescription>
                Select your passport to get highly accurate, AI-powered visa requirements for {countryData.country}.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger className="flex-1 h-11">
                    <SelectValue placeholder="Select Origin Passport..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ORIGIN_PASSPORTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  disabled={fetchingVisa}
                  onClick={handleFetchVisa}
                  className="shrink-0 h-11 w-full sm:w-auto"
                >
                  {fetchingVisa ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Generate Guide
                </Button>
              </div>

              {visaMarkdown && (
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="prose dark:prose-invert max-w-none prose-h2:text-xl prose-h2:mt-6 prose-a:text-primary">
                    <ReactMarkdown>{visaMarkdown}</ReactMarkdown>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Static Blog Content */}
        {categoryKey !== "visa" && categoryData.markdownContent && (
          <div className="prose dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:tracking-tight prose-h2:font-display prose-h2:font-bold prose-h2:text-foreground prose-a:text-primary mb-8 bg-card p-6 sm:p-8 rounded-lg border border-border/50 shadow-sm leading-relaxed prose-li:marker:text-primary">
            <ReactMarkdown>{categoryData.markdownContent}</ReactMarkdown>
          </div>
        )}

        {/* Useful Links / Apps */}
        {categoryData.links && categoryData.links.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 font-display">Useful Links & Apps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoryData.links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all h-full group">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-[15px] group-hover:text-primary transition-colors">
                          {link.title}
                        </h3>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Roleplay Scenario Bottom Callout */}
        {categoryData.roleplayScenario && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r bg-muted/50 dark:bg-muted/20 border-border rounded-lg p-6 mb-8 border border-border"
          >
            <p className="text-sm font-semibold mb-2 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" /> Practice Conversation
            </p>
            <p className="text-sm text-foreground/90 mb-4">{categoryData.roleplayScenario}</p>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
              onClick={handleRoleplay}
            >
              Start Roleplay Practice
            </Button>
          </motion.div>
        )}
      </div>

    </div>
  );
}
