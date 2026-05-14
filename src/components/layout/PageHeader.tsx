import React from "react";

export function PageHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-end justify-between border-b border-border/50 pb-5">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm sm:text-[15px] mt-1.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {badge && <div className="mt-3 md:mt-0 shrink-0">{badge}</div>}
    </div>
  );
}
