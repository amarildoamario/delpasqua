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
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
          {title}
        </h1>

        {subtitle ? (
          <div className="mt-1 text-sm text-neutral-600">
            {subtitle}
          </div>
        ) : null}

        {meta ? (
          <div className="mt-1 text-sm text-neutral-500">
            {meta}
          </div>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
