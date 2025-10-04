'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ pressed = false, onPressedChange, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-pressed={pressed}
        onClick={(event) => {
          event.preventDefault();
          onPressedChange?.(!pressed);
        }}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition',
          pressed
            ? 'border-brand bg-brand text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Toggle.displayName = 'Toggle';
