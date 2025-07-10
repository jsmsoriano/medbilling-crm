import { 
  Users, 
  TrendingUp, 
  FileText,
  Settings,
  DollarSign,
  BarChart3,
  CheckSquare,
  UserCheck,
  FolderOpen,
  CreditCard,
  Upload,
  RefreshCw,
  ClipboardList,
  Calendar,
  AlertCircle,
  Target,
  UserPlus,
  Building2,
  Shield,
  Home,
  PieChart,
  Activity
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  subscriptionRequired?: 'starter' | 'professional' | 'growth';
  children?: NavigationItem[];
}

export interface NavigationGroup {
  name: string;
  items: NavigationItem[];
  subscriptionRequired?: 'starter' | 'professional' | 'growth';
}

export const navigationConfig: NavigationGroup[] = [
  {
    name: 'DASHBOARD',
    items: [
      { 
        name: 'Overview', 
        href: '/dashboard', 
        icon: Home,
        description: 'Main dashboard overview'
      },
      { 
        name: 'Performance', 
        href: '/dashboard/performance', 
        icon: Activity,
        description: 'Performance metrics and KPIs'
      },
      { 
        name: 'Analytics', 
        href: '/dashboard/analytics', 
        icon: PieChart,
        description: 'Detailed analytics and insights'
      },
    ]
  },
  {
    name: 'OPERATIONS',
    items: [
      { 
        name: 'Clients & Providers', 
        href: '/clients', 
        icon: Users,
        description: 'Manage clients and providers',
        children: [
          { name: 'All Clients', href: '/clients', icon: Users, description: 'View all clients' },
          { name: 'Patient Insurance', href: '/clients/insurance', icon: Shield, description: 'Manage patient insurance information' }
        ]
      },
      { 
        name: 'Claims', 
        href: '/claims', 
        icon: FileText,
        description: 'Track and manage insurance claims',
        children: [
          { name: 'All Claims', href: '/claims', icon: FileText, description: 'View all claims' },
          { name: 'Denials Management', href: '/claims/denials', icon: AlertCircle, description: 'Manage denied claims' }
        ]
      },
      { 
        name: 'Payments', 
        href: '/payments', 
        icon: CreditCard,
        description: 'Payment processing and reconciliation',
        children: [
          { name: 'Payment Posting', href: '/payments/posting', icon: CreditCard, description: 'Post payments' },
          { name: 'ERA Upload', href: '/payments/era', icon: Upload, description: 'Upload ERA files' },
          { name: 'Reconciliation', href: '/payments/reconciliation', icon: RefreshCw, description: 'Reconcile payments' }
        ]
      },
      { 
        name: 'AR & Reports', 
        href: '/reports', 
        icon: BarChart3,
        description: 'Accounts receivable and reporting',
        children: [
          { name: 'AR Dashboard', href: '/reports/ar-dashboard', icon: BarChart3, description: 'AR overview dashboard' },
          { name: 'Aging Buckets', href: '/reports/aging', icon: Calendar, description: 'Aging analysis' },
          { name: 'Claims Status Reports', href: '/reports/claims-status', icon: ClipboardList, description: 'Claims status reporting' },
          { name: 'Denials Reports', href: '/reports/denials', icon: AlertCircle, description: 'Denials analysis' },
          { name: 'Payments Report', href: '/reports/payments', icon: CreditCard, description: 'Payment reporting' }
        ]
      },
      { 
        name: 'Tasks', 
        href: '/tasks', 
        icon: CheckSquare,
        description: 'Task management',
        children: [
          { name: 'All Tasks', href: '/tasks', icon: CheckSquare, description: 'View all tasks' },
          { name: 'My Tasks', href: '/tasks/my-tasks', icon: CheckSquare, description: 'View my assigned tasks' }
        ]
      },
      { 
        name: 'Credentialing', 
        href: '/credentialing', 
        icon: UserCheck,
        description: 'Provider credentialing management',
        subscriptionRequired: 'professional',
        children: [
          { name: 'Applications', href: '/credentialing', icon: UserCheck, description: 'Credentialing applications' },
          { name: 'Renewals', href: '/credentialing/renewals', icon: RefreshCw, description: 'Credential renewals' }
        ]
      },
      { 
        name: 'File Vault', 
        href: '/file-vault', 
        icon: FolderOpen,
        description: 'Secure document storage',
        subscriptionRequired: 'professional',
        children: [
          { name: 'All Files', href: '/file-vault', icon: FolderOpen, description: 'View all files' },
          { name: 'Upload Files', href: '/file-vault/upload', icon: Upload, description: 'Upload documents' }
        ]
      },
    ]
  },
  {
    name: 'GROWTH & SALES',
    items: [
      { 
        name: 'Sales Pipeline', 
        href: '/pipeline', 
        icon: TrendingUp,
        description: 'Sales pipeline management',
        subscriptionRequired: 'professional',
        children: [
          { name: 'Pipeline Board', href: '/pipeline', icon: TrendingUp, description: 'Visual pipeline board' },
          { name: 'Leads & Prospects', href: '/pipeline/leads', icon: UserPlus, description: 'Manage leads and prospects' },
          { name: 'Deals', href: '/pipeline/deals', icon: Target, description: 'Manage deals' },
          { name: 'Sales Tasks', href: '/pipeline/tasks', icon: CheckSquare, description: 'Sales-related tasks' },
          { name: 'Conversion Reports', href: '/pipeline/reports', icon: BarChart3, description: 'Sales conversion analytics' }
        ]
      },
    ]
  },
  {
    name: 'ADMIN',
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