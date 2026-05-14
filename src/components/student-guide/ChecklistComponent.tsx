import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { DocumentRequirement } from "@/lib/student-guide-data";

interface ChecklistComponentProps {
  documents: DocumentRequirement[];
  storageKey?: string;
}

export function ChecklistComponent({ documents, storageKey }: ChecklistComponentProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof localStorage !== "undefined" && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {};
  });

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      if (typeof localStorage !== "undefined" && storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.name}
          className="flex items-start gap-3 p-2 rounded hover:bg-accent transition-colors"
        >
          <Checkbox
            id={doc.name}
            checked={checkedItems[doc.name] || false}
            onCheckedChange={() => toggleItem(doc.name)}
            className="mt-1"
          />
          <Label
            htmlFor={doc.name}
            className={`flex-1 cursor-pointer text-sm ${
              checkedItems[doc.name] ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            <div className="flex items-start gap-2">
              <span>{doc.name}</span>
              {doc.required && (
                <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 px-2 py-0.5 rounded">
                  Required
                </span>
              )}
              {!doc.required && (
                <span className="text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100 px-2 py-0.5 rounded">
                  Optional
                </span>
              )}
            </div>
            {doc.description && (
              <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
            )}
          </Label>
        </div>
      ))}
    </div>
  );
}
