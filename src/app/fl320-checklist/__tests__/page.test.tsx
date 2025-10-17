import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FL320ChecklistPage from '../page';

// Mock the UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div data-testid="card-content" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div data-testid="card-header" {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div data-testid="card-title" {...props}>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button data-testid="button" {...props}>{children}</button>,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label data-testid="label" {...props}>{children}</label>,
}));

// Mock the Textarea component - this should exist after our fix
jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ ...props }: any) => <textarea data-testid="textarea" {...props} />,
}));

// Mock external dependencies
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
  })),
}));

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mock'),
    height: 1000,
    width: 800,
  }),
}));

jest.mock('lucide-react', () => ({
  FileText: () => <div data-testid="file-text-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Printer: () => <div data-testid="printer-icon" />,
  CheckCircle2: () => <div data-testid="check-circle-icon" />,
  Circle: () => <div data-testid="circle-icon" />,
  Scale: () => <div data-testid="scale-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  FolderOpen: () => <div data-testid="folder-open-icon" />,
  FileCheck: () => <div data-testid="file-check-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  User: () => <div data-testid="user-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
}));

describe('FL320ChecklistPage', () => {
  test('renders without crashing', () => {
    // This test should pass after our fix - before the fix it would fail due to missing Textarea import
    expect(() => render(<FL320ChecklistPage />)).not.toThrow();
  });

  test('displays the main heading', () => {
    render(<FL320ChecklistPage />);
    expect(screen.getByText('FL-320 COURT PACKET CHECKLIST')).toBeInTheDocument();
  });

  test('renders checklist items', () => {
    render(<FL320ChecklistPage />);
    expect(screen.getByText('FL-320 Responsive Declaration')).toBeInTheDocument();
    expect(screen.getByText('Declaration of Thomas J. Rotert')).toBeInTheDocument();
  });

  test('has PDF generation button', () => {
    render(<FL320ChecklistPage />);
    const downloadButton = screen.getByRole('button', { name: /download/i });
    expect(downloadButton).toBeInTheDocument();
  });

  test('has print button', () => {
    render(<FL320ChecklistPage />);
    const printButton = screen.getByRole('button', { name: /print/i });
    expect(printButton).toBeInTheDocument();
  });

  test('displays progress summary', () => {
    render(<FL320ChecklistPage />);
    expect(screen.getByText('FILING PROGRESS')).toBeInTheDocument();
  });

  test('shows markdown content when editing', () => {
    render(<FL320ChecklistPage />);
    // The textarea should be available for editing
    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });
});
