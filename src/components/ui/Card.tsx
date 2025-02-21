import React from 'react';

interface CardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export function Card({ title, className = '', children }: CardProps) {
  return (
    <div className={`bg-card  card text-card-foreground rounded-lg border border-border shadow-custom transition-colors ${className}`}>
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

