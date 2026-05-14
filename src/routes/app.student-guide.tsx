import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { studentGuideBlogData } from "@/lib/student-guide-blog-data";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, BookOpen, Building, Briefcase, Landmark, Heart, Train, Plane, Info, MapPin, CheckCircle2, Target, MessageSquare } from "lucide-react";

const getLucideIcon = (iconName: string, className: string = "w-5 h-5 mx-auto") => {
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

export const Route = createFileRoute("/app/student-guide")({
  component: StudentGuideLayout,
});

/** Parent of `/app/student-guide/$country` — must render `<Outlet />` or child routes never appear. */
function StudentGuideLayout() {
  const isIndex = useRouterState({
    select: (s) => {
      const segments = s.location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
      return (
        segments.length === 2 && segments[0] === "app" && segments[1] === "student-guide"
      );
    },
  });
  return isIndex ? <StudentGuideLanding /> : <Outlet />;
}

function StudentGuideLanding() {
  const countries = Object.values(studentGuideBlogData);

  return (
    <div className="space-y-8 pb-10">
      <div className="z-10 bg-card border-b border-border/50 -mx-4 px-4 py-5 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              Student Guide
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-[15px] max-w-2xl leading-relaxed">
            Visa, housing, banking, work, health, and transport — pick a country, then a topic.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="font-display text-lg font-semibold">Countries</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Each guide includes checklists, timelines, and costs.
          </p>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-lg border border-border/60 bg-card/50 p-6 shadow-sm"
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" /> How to Use This Guide
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-primary" />
              <span>Select your destination country</span>
            </li>
            <li className="flex items-start gap-3">
              <Building className="w-4 h-4 mt-0.5 text-primary" />
              <span>Browse through each category (Visa, Housing, Banking, Work, Health, Transport)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
              <span>Check off documents as you gather them</span>
            </li>
            <li className="flex items-start gap-3">
              <Target className="w-4 h-4 mt-0.5 text-primary" />
              <span>Follow step-by-step instructions with timelines and costs</span>
            </li>
            <li className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 mt-0.5 text-primary" />
              <span>Use Roleplay Coach to practice conversations for important interactions</span>
            </li>
          </ul>
        </motion.div>

        {/* Country Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, idx) => (
            <motion.div
              key={country.countryCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to="/app/student-guide/$country"
                params={{ country: country.countryCode.toLowerCase() }}
              >
                <div className="group h-full bg-card rounded-lg p-6 border border-border/60 hover:border-primary/40 hover:shadow-sm transition-all duration-300 cursor-pointer">
                  <div className="space-y-4 h-full flex flex-col">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {country.country}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {Object.keys(country.categories).length} categories • Complete guides
                      </p>
                    </div>

                    {/* Category Preview */}
                    <div className="grid grid-cols-3 gap-2 py-4">
                      {Object.values(country.categories)
                        .slice(0, 6)
                        .map((cat) => (
                          <div
                            key={cat.id}
                            className="text-center text-muted-foreground hover:text-primary hover:scale-110 transition-all flex flex-col items-center justify-center gap-1"
                            title={cat.name}
                          >
                            {getLucideIcon(cat.icon, "w-5 h-5")}
                            <span className="text-[10px] uppercase font-medium tracking-wider">{cat.name}</span>
                          </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        View Guide <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
