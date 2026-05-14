import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistComponent } from "./ChecklistComponent";
import type { ProcessStep } from "@/lib/student-guide-data";

interface GuideCardProps {
  step: ProcessStep;
  stepNumber?: number;
  onRoleplayClick?: () => void;
  countryKey?: string;
  categoryKey?: string;
}

export function GuideCard({ step, stepNumber, onRoleplayClick, countryKey, categoryKey }: GuideCardProps) {
  return (
    <Card className="mb-4 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            {stepNumber && (
              <span className="inline-block bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mb-2">
                {stepNumber}
              </span>
            )}
            <CardTitle className="text-lg mt-2">{step.title}</CardTitle>
            <CardDescription className="text-base mt-2">
              ⏱️ Timeline: <span className="font-semibold text-foreground">{step.timeline}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {step.notes && (
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Note:</span> {step.notes}
            </p>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <span>📋 Required Documents</span>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
              {step.documents.filter((d) => d.required).length}/{step.documents.length}
            </span>
          </h4>
          <ChecklistComponent 
            documents={step.documents} 
            storageKey={countryKey && categoryKey ? `lb-guide-${countryKey}-${categoryKey}-step${step.step}` : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
}
