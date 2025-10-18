/**
 * Icon Mapping Utility
 * Maps icon names (strings) to lucide-react components
 * DRY: Single source for icon rendering
 */

import {
  Baby,
  Users,
  Home,
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
  Scale,
  AlertTriangle,
  CheckCircle,
  Building,
  User,
  Mail,
  Clock,
  type LucideIcon
} from 'lucide-react'

export const iconMap: Record<string, LucideIcon> = {
  Baby,
  Users,
  Home,
  Briefcase,
  FileText,
  DollarSign,
  Calendar,
  Scale,
  AlertTriangle,
  CheckCircle,
  Building,
  User,
  Mail,
  Clock,
}

/**
 * Get icon component by name
 *
 * @param iconName - Name of the icon (e.g., 'Baby', 'Users')
 * @param fallback - Fallback icon if name not found (default: FileText)
 * @returns Lucide icon component
 */
export function getIcon(iconName: string, fallback: LucideIcon = FileText): LucideIcon {
  return iconMap[iconName] || fallback
}

/**
 * Render icon by name with custom className
 *
 * @param iconName - Name of the icon
 * @param className - Tailwind classes
 * @returns JSX element
 */
export function renderIcon(iconName: string, className?: string) {
  const Icon = getIcon(iconName)
  return <Icon className={className} />
}
