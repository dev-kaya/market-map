import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  children: React.ReactNode;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, children, ...props }, ref) => {
    return (
      <div className={cn('relative inline-block', className)} ref={ref} {...props}>
        {children}
        <div className="absolute z-10 invisible opacity-0 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
          {content}
        </div>
      </div>
    );
  },
);
Tooltip.displayName = 'Tooltip';

export { Tooltip };