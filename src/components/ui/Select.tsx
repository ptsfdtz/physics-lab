import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from './Button';

interface Option<T extends string> {
  value: T;
  label: React.ReactNode;
}

interface SelectProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** button variant to use */
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Select<T extends string>({
  options,
  value,
  onChange,
  className = '',
  variant = 'outline',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const currentLabel = options.find(o => o.value === value)?.label ?? '';

  return (
    <div className={`relative inline-block ${className}`} ref={rootRef}>
      <Button
        variant={variant}
        onClick={() => setOpen(s => !s)}
        className="px-2 py-1 text-sm flex items-center justify-center gap-2"
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md z-50 min-w-24">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-50 ${opt.value === value ? 'bg-gray-100' : ''}`}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
