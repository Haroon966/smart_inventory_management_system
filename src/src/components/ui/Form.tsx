import React from 'react';

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export function Form({ onSubmit, children }: FormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(e);
    }}>
      {children}
    </form>
  );
}

interface FormGroupProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}

export function FormGroup({ label, htmlFor, children }: FormGroupProps) {
  return (
    <div className="mb-3">
      <label htmlFor={htmlFor} className="form-label">{label}</label>
      {children}
    </div>
  );
}

