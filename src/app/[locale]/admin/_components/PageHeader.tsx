import React from "react";

export default function PageHeader({
  title,
  subtitle,
  meta,
  actions,
}: {
  title: string;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 min-w-0 max-w-full">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 break-words">
          {title}
        </h1>

        {subtitle ? (
          <div className="mt-1 text-xs sm:text-sm text-neutral-600 break-words">
            {subtitle}
          </div>
        ) : null}

        {meta ? (
          <div className="mt-1 text-xs sm:text-sm text-neutral-500 break-words">
            {meta}
          </div>
        ) : null}
      </div>

      {actions ? (
        <div className="flex w-full sm:w-auto shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
