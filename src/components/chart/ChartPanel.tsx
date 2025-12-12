import React from 'react';

interface ChartPanelProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({
  title,
  description,
  actions,
  children,
  className,
}) => {
  return (
    <section
      className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-3 ${className ?? ''}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 text-sm">{actions}</div>}
      </header>
      <div className="space-y-2">{children}</div>
    </section>
  );
};
