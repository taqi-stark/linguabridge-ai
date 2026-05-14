import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Building, Briefcase, Landmark, Heart, Train, Plane } from "lucide-react";

interface StudentGuideNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const getLucideIcon = (key: string, className: string = "w-5 h-5") => {
  const props = { className, strokeWidth: 1.5 };
  switch(key) {
    case "visa": return <Plane {...props} />;
    case "housing": return <Building {...props} />;
    case "banking": return <Landmark {...props} />;
    case "work": return <Briefcase {...props} />;
    case "health": return <Heart {...props} />;
    case "transport": return <Train {...props} />;
    default: return <BookOpen {...props} />;
  }
};

export function StudentGuideNav({
  categories,
  activeCategory,
  onCategoryChange,
}: StudentGuideNavProps) {
  const categoryNames: Record<string, string> = {
    visa: "Visa",
    housing: "Housing",
    banking: "Banking",
    work: "Work",
    health: "Health",
    transport: "Transport",
  };

  return (
    <div className="sticky top-0 z-30 bg-card border-b border-border/80 shadow-sm w-full">
      <div className="flex overflow-x-auto scrollbar-hide max-w-4xl mx-auto px-2">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => onCategoryChange(category)}
            variant="ghost"
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-none flex-1 min-w-[72px] h-16 sm:h-[72px] hover:bg-transparent",
              activeCategory === category
                ? "text-primary relative"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {activeCategory === category && (
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-b-full shadow-sm" />
            )}
            {getLucideIcon(category, activeCategory === category ? "w-[22px] h-[22px] sm:w-[26px] sm:h-[26px]" : "w-5 h-5 sm:w-6 sm:h-6")}
            <span className="text-[10px] sm:text-xs font-medium tracking-wide">{categoryNames[category]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
