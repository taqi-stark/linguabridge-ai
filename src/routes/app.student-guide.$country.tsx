import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { studentGuideBlogData } from "@/lib/student-guide-blog-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen, Building, Briefcase, Landmark, Heart, Train, Plane } from "lucide-react";

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

export const Route = createFileRoute("/app/student-guide/$country")({
  component: CountryGuidePage,
});

/** Parent of `$category` — must render `<Outlet />` or the detailed guide never appears. */
function CountryGuidePage() {
  const params = Route.useParams();
  const countryKey = (params.country ?? "").toLowerCase();
  const countryData = studentGuideBlogData[countryKey];

  const isCountryHub = useRouterState({
    select: (s) => {
      const segments = s.location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
      return (
        segments.length === 3 &&
        segments[0] === "app" &&
        segments[1] === "student-guide" &&
        segments[2]?.toLowerCase() === countryKey
      );
    },
  });

  if (!countryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Country Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The country guide you're looking for doesn't exist.
          </p>
          <Link to="/app/student-guide">
            <Button>Back to Countries</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isCountryHub) {
    return <Outlet />;
  }

  const categories = Object.values(countryData.categories);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-card/50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <Link to="/app/student-guide" className="mb-3 sm:mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Countries
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-secondary flex items-center justify-center shadow-inner border border-border/60">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-foreground/80" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold">{countryData.country}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Complete student guide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Select a Category</h2>
          <p className="text-muted-foreground">
            Choose a section to see detailed step-by-step guides
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to="/app/student-guide/$country/$category"
                params={{ country: countryKey, category: category.id }}
              >
                <Card className="group h-full hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="h-12 w-12 mb-4 rounded-xl bg-muted border border-border/80 flex items-center justify-center text-foreground group-hover:bg-primary/5 group-hover:border-primary/30 group-hover:text-primary transition-all shadow-sm">
                          {getLucideIcon(category.icon, "w-6 h-6")}
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm">{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 px-3 py-1 rounded-full">
                        {category.links?.length || 0} External Resources
                      </span>
                      {category.roleplayScenario && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 px-3 py-1 rounded-full">
                          💬 Roleplay available
                        </span>
                      )}
                    </div>

                    <Button
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground mt-4"
                      variant="outline"
                    >
                      View Details <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
