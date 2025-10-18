import { User, Users, Building, Scale, Home, Hammer, Wrench, Briefcase } from 'lucide-react';
import type { Person, Category } from './types';

export const personsData: Person[] = [
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
    role: 'Petitioner\'s Counsel',
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

export const categories: Category[] = [
  { id: 'party', title: 'Parties to Case', icon: <Users className="h-5 w-5" /> },
  { id: 'legal', title: 'Legal Counsel', icon: <Scale className="h-5 w-5" /> },
  { id: 'buyer', title: 'Property Buyers', icon: <Home className="h-5 w-5" /> },
  { id: 'vendor', title: 'Vendors & Contractors', icon: <Hammer className="h-5 w-5" /> },
  { id: 'other', title: 'Other Parties', icon: <Briefcase className="h-5 w-5" /> }
];
