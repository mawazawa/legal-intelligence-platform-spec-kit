'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Users,
  Building,
  Scale,
  Home,
  Hammer,
  Wrench,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Person {
  name: string;
  role: string;
  organization?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'resolved' | 'pending' | 'critical';
  description?: string;
  icon: React.ReactNode;
  category: 'party' | 'legal' | 'buyer' | 'vendor' | 'other';
}

const personsData: Person[] = [
  {
    name: 'Mathieu Wauters',
    role: 'Respondent',
    organization: 'Self-Represented',
    email: 'mathieu@example.com',
    status: 'active',
    description: 'Entitled to 65% of property proceeds per court order',
    icon: <User className="h-5 w-5" />,
    category: 'party'
  },
  {
    name: 'Rosanna Claire Alvero',
    role: 'Petitioner',
    organization: 'Former Spouse',
    status: 'critical',
    description: 'Entitled to 35% of proceeds; FTB withholding issue on her portion',
    icon: <User className="h-5 w-5" />,
    category: 'party'
  },
  {
    name: 'Selam Gezahegn',
    role: 'Petitioner&apos;s Counsel',
    organization: 'Law Office of Selam Gezahegn',
    email: 'selam@gezahegnlaw.com',
    status: 'active',
    description: 'Legal representation for petitioner',
    icon: <Scale className="h-5 w-5" />,
    category: 'legal'
  },
  {
    name: 'Ron Melendez',
    role: 'Real Estate Agent',
    organization: 'Compass Real Estate',
    email: 'ron.melendez@compass.com',
    phone: '(415) 555-0123',
    status: 'resolved',
    description: 'Listing agent for 3525 8th Avenue property sale',
    icon: <Home className="h-5 w-5" />,
    category: 'other'
  },
  {
    name: 'Buyer 1',
    role: 'Property Purchaser',
    organization: 'Individual Buyer',
    status: 'resolved',
    description: 'Purchased 3525 8th Avenue on May 30, 2025 for $1,150,000',
    icon: <Users className="h-5 w-5" />,
    category: 'buyer'
  },
  {
    name: 'Buyer 2',
    role: 'Property Purchaser',
    organization: 'Individual Buyer',
    status: 'resolved',
    description: 'Co-purchaser of 3525 8th Avenue',
    icon: <Users className="h-5 w-5" />,
    category: 'buyer'
  },
  {
    name: 'ABC Plumbing Services',
    role: 'Vendor - Plumbing Repairs',
    organization: 'Licensed Contractor',
    phone: '(415) 555-0200',
    status: 'resolved',
    description: 'Provided $3,200 estimate for plumbing repairs (seller credit)',
    icon: <Wrench className="h-5 w-5" />,
    category: 'vendor'
  },
  {
    name: 'Golden Gate Roofing',
    role: 'Vendor - Roof Inspection',
    organization: 'Licensed Contractor',
    phone: '(415) 555-0300',
    status: 'resolved',
    description: 'Provided $5,800 estimate for roof repairs (seller credit)',
    icon: <Hammer className="h-5 w-5" />,
    category: 'vendor'
  },
  {
    name: 'SF Home Inspections',
    role: 'Vendor - Home Inspection',
    organization: 'Certified Inspector',
    phone: '(415) 555-0400',
    status: 'resolved',
    description: 'Conducted property inspection identifying repair needs',
    icon: <Building className="h-5 w-5" />,
    category: 'vendor'
  },
  {
    name: 'Bay Area Pest Control',
    role: 'Vendor - Termite Inspection',
    organization: 'Licensed Pest Control',
    phone: '(415) 555-0500',
    status: 'resolved',
    description: 'Provided $2,100 estimate for termite treatment (seller credit)',
    icon: <Building className="h-5 w-5" />,
    category: 'vendor'
  },
  {
    name: 'Title Trust Escrow',
    role: 'Escrow Company',
    organization: 'Licensed Escrow Holder',
    phone: '(415) 555-0600',
    status: 'resolved',
    description: 'Handled property sale closing and fund distribution',
    icon: <Briefcase className="h-5 w-5" />,
    category: 'other'
  }
];

interface PersonsOfInterestProps {
  showCategories?: string[];
  compact?: boolean;
}

export function PersonsOfInterest({ showCategories, compact = false }: PersonsOfInterestProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['party', 'legal']);
  const [expandedPersons, setExpandedPersons] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePerson = (name: string) => {
    setExpandedPersons(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const filteredPersons = showCategories
    ? personsData.filter(p => showCategories.includes(p.category))
    : personsData;

  const categories = [
    { id: 'party', title: 'Parties to Case', icon: <Users className="h-5 w-5" /> },
    { id: 'legal', title: 'Legal Counsel', icon: <Scale className="h-5 w-5" /> },
    { id: 'buyer', title: 'Property Buyers', icon: <Home className="h-5 w-5" /> },
    { id: 'vendor', title: 'Vendors & Contractors', icon: <Hammer className="h-5 w-5" /> },
    { id: 'other', title: 'Other Parties', icon: <Briefcase className="h-5 w-5" /> }
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="print:break-before-page">
      <Card className="print:shadow-none print:border-2">
        <CardHeader className="print:pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Persons of Interest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map(category => {
            const categoryPersons = filteredPersons.filter(p => p.category === category.id);
            if (categoryPersons.length === 0) return null;

            const isExpanded = expandedCategories.includes(category.id);

            return (
              <div key={category.id} className="print:break-inside-avoid">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-colors print:bg-slate-100 print:hover:from-slate-100"
                >
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="font-semibold">{category.title}</span>
                    <Badge variant="outline" className="ml-2">
                      {categoryPersons.length}
                    </Badge>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 print:hidden" />
                  ) : (
                    <ChevronRight className="h-5 w-5 print:hidden" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-2 ml-4 print:block">
                    {categoryPersons.map(person => {
                      const isPersonExpanded = expandedPersons.includes(person.name);

                      return (
                        <div
                          key={person.name}
                          className="border rounded-lg p-3 bg-white print:break-inside-avoid print:mb-2"
                        >
                          <button
                            onClick={() => togglePerson(person.name)}
                            className="w-full flex items-start justify-between text-left print:cursor-default"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${getStatusColor(person.status)}`}>
                                {person.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-semibold text-sm">{person.name}</h4>
                                  {person.status && (
                                    <Badge
                                      variant="outline"
                                      className={`${getStatusColor(person.status)} text-xs`}
                                    >
                                      {getStatusIcon(person.status)}
                                      <span className="ml-1">{person.status}</span>
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600">{person.role}</p>
                                {person.organization && (
                                  <p className="text-xs text-slate-500">{person.organization}</p>
                                )}
                              </div>
                            </div>
                            {!compact && (
                              isPersonExpanded ? (
                                <ChevronDown className="h-5 w-5 text-slate-400 print:hidden" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-slate-400 print:hidden" />
                              )
                            )}
                          </button>

                          {(isPersonExpanded || compact) && (
                            <div className="mt-3 pt-3 border-t space-y-2 text-sm print:block">
                              {person.description && (
                                <p className="text-slate-700">{person.description}</p>
                              )}
                              <div className="space-y-1 text-slate-600">
                                {person.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <a
                                      href={`mailto:${person.email}`}
                                      className="hover:text-blue-600 print:text-slate-600"
                                    >
                                      {person.email}
                                    </a>
                                  </div>
                                )}
                                {person.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <a
                                      href={`tel:${person.phone}`}
                                      className="hover:text-blue-600 print:text-slate-600"
                                    >
                                      {person.phone}
                                    </a>
                                  </div>
                                )}
                                {person.address && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{person.address}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <style jsx global>{`
        @media print {
          .print\\:break-before-page {
            break-before: page;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          .print\\:shadow-none {
            box-shadow: none;
          }
          .print\\:border-2 {
            border-width: 2px;
          }
          .print\\:pb-2 {
            padding-bottom: 0.5rem;
          }
          .print\\:bg-slate-100 {
            background-color: #f1f5f9;
          }
          .print\\:hover\\:from-slate-100:hover {
            background-image: linear-gradient(to right, #f1f5f9, #f1f5f9);
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none;
          }
          .print\\:cursor-default {
            cursor: default;
          }
          .print\\:mb-2 {
            margin-bottom: 0.5rem;
          }
          .print\\:text-slate-600 {
            color: #475569;
          }
        }
      `}</style>
    </div>
  );
}
