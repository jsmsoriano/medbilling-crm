
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
  description?: string;
}

const KPICard = ({ title, value, change, trend, icon: Icon, color, description }: KPICardProps) => {
  const colorClasses = {
    green: 'text-success bg-success-light border-success/20',
    blue: 'text-primary bg-primary-light border-primary/20',
    purple: 'text-status-review bg-status-review/10 border-status-review/20',
    emerald: 'text-status-approved bg-status-approved/10 border-status-approved/20',
    orange: 'text-warning bg-warning-light border-warning/20',
    red: 'text-destructive bg-destructive-light border-destructive/20',
    indigo: 'text-info bg-info-light border-info/20'
  };

  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</h3>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border",
              colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
            )}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-xl sm:text-2xl font-bold text-foreground">{value}</p>
        <div className="flex items-center flex-wrap gap-1">
          <span className={cn(
            "text-sm font-medium",
            trend === 'up' ? 'text-success' : 'text-destructive'
          )}>
            {change}
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      </div>
    </Card>
  );
};

export default KPICard;
