import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

interface StatusBadgeProps {
  delivered: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ delivered }) => {
  if (delivered) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-red-600 text-white border border-red-500">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>DELIVERED</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-neutral-900 text-neutral-300 border border-neutral-700">
      <Clock className="w-3.5 h-3.5 text-red-500" />
      <span>IN TRANSIT</span>
    </span>
  );
};
