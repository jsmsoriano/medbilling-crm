import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  FileText,
  Settings,
  Database,
  UserCheck,
  CheckSquare,
  UsersIcon,
  FolderOpen,
  CalendarCheck,
  DollarSign,
  BarChart3
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  subscriptionRequired?: 'starter' | 'professional' | 'growth';
}

export interface NavigationGroup {
  name: string;
  items: NavigationItem[];
  subscriptionRequired?: 'starter' | 'professional' | 'growth';
}

export const navigationConfig: NavigationGroup[] = [
  {
    name: 'Core Operations',
    items: [
      { 
        name: 'Dashboard', 
        href: '/', 
        icon: LayoutDashboard,
        description: 'Overview of your billing operations'
      },
      { 
        name: 'Reports', 
        href: '/reports', 
        icon: BarChart3,
        description: 'Financial and operational reports'
      },
    ]
  },
  {
    name: 'Client Management',
    items: [
      { 
        name: 'Clients', 
        href: '/clients', 
        icon: Users,
        description: 'Manage your client practices'
      },
      { 
        name: 'Claims', 
        href: '/claims', 
        icon: FileText,
        description: 'Track and manage insurance claims'
      },
      { 
        name: 'Pipeline', 
        href: '/pipeline', 
        icon: TrendingUp,
        description: 'Sales pipeline and prospects',
        subscriptionRequired: 'professional'
      },
    ]
  },
  {
    name: 'Operations',
    items: [
      { 
        name: 'Tasks', 
        href: '/tasks', 
        icon: CheckSquare,
        description: 'Manage workflow and follow-ups'
      },
      { 
        name: 'Data Management', 
        href: '/data-management', 
        icon: Database,
        description: 'Import and manage data'
      },
      { 
        name: 'Month-End Close', 
        href: '/month-end-close', 
        icon: CalendarCheck,
        description: 'Month-end procedures and sign-offs',
        subscriptionRequired: 'professional'
      },
    ]
  },
  {
    name: 'Advanced Features',
    subscriptionRequired: 'professional',
    items: [
      { 
        name: 'Credentialing', 
        href: '/credentialing', 
        icon: UserCheck,
        description: 'Provider credentialing management',
        subscriptionRequired: 'professional'
      },
      { 
        name: 'Team Dashboard', 
        href: '/team-dashboard', 
        icon: UsersIcon,
        description: 'Team performance and assignments',
        subscriptionRequired: 'growth'
      },
      { 
        name: 'File Vault', 
        href: '/file-vault', 
        icon: FolderOpen,
        description: 'Secure document storage',
        subscriptionRequired: 'professional'
      },
    ]
  },
  {
    name: 'Administration',
    items: [
      { 
        name: 'Settings', 
        href: '/settings', 
        icon: Settings,
        description: 'Account and system settings'
      },
    ]
  }
];

// Helper function to check if user can access a feature
export const canAccessFeature = (
  userTier: 'starter' | 'professional' | 'growth',
  requiredTier?: 'starter' | 'professional' | 'growth'
): boolean => {
  if (!requiredTier) return true;
  
  const tierLevels = {
    starter: 1,
    professional: 2,
    growth: 3
  };
  
  return tierLevels[userTier] >= tierLevels[requiredTier];
};

// Get filtered navigation based on user subscription
export const getFilteredNavigation = (
  userTier: 'starter' | 'professional' | 'growth'
): NavigationGroup[] => {
  return navigationConfig
    .filter(group => canAccessFeature(userTier, group.subscriptionRequired))
    .map(group => ({
      ...group,
      items: group.items.filter(item => canAccessFeature(userTier, item.subscriptionRequired))
    }))
    .filter(group => group.items.length > 0);
};