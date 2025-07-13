import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Download,
  FileText,
  Calendar,
  Users
} from 'lucide-react';
import { formatCurrencyAbbreviated, getFullCurrencyAmount, formatPercentage } from '@/utils/formatters';

const ARDashboard = () => {
  // Mock AR data
  const arMetrics = {
    totalAR: 875000,
    currentAR: 425000,
    pastDue: 450000,
    daysInAR: 45,
    collectionRate: 92.5,
    denialRate: 7.2
  };

  const agingBuckets = [
    { range: '0-30 Days', amount: 425000, percentage: 48.5, status: 'current' },
    { range: '31-60 Days', amount: 189000, percentage: 21.6, status: 'attention' },
    { range: '61-90 Days', amount: 134000, percentage: 15.3, status: 'warning' },
    { range: '90+ Days', amount: 127000, percentage: 14.6, status: 'critical' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-success/10 text-success border-success/20';
      case 'attention':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'warning':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <header className="border-b border-border bg-background px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-left">AR Dashboard</h1>
            <p className="text-muted-foreground">Accounts receivable overview and aging analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Summary Cards Section */}
      <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Card className="border-border/50 transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3 px-4 pt-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Total AR</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xl sm:text-2xl font-bold truncate cursor-help">
                        {formatCurrencyAbbreviated(arMetrics.totalAR)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getFullCurrencyAmount(arMetrics.totalAR)}</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">All outstanding receivables</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3 px-4 pt-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Current AR</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xl sm:text-2xl font-bold text-success truncate cursor-help">
                        {formatCurrencyAbbreviated(arMetrics.currentAR)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getFullCurrencyAmount(arMetrics.currentAR)}</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">0-30 days outstanding</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3 px-4 pt-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Past Due</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xl sm:text-2xl font-bold text-destructive truncate cursor-help">
                        {formatCurrencyAbbreviated(arMetrics.pastDue)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getFullCurrencyAmount(arMetrics.pastDue)}</p>
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">30+ days outstanding</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3 px-4 pt-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Days in AR</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-xl sm:text-2xl font-bold">{arMetrics.daysInAR}</div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Average collection time</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3 px-4 pt-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Collection Rate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-xl sm:text-2xl font-bold text-success">{formatPercentage(arMetrics.collectionRate)}</div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Overall collection efficiency</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3 px-4 pt-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Denial Rate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-xl sm:text-2xl font-bold text-warning">{formatPercentage(arMetrics.denialRate)}</div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Claims denied percentage</p>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Aging Buckets */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                AR Aging Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agingBuckets.map((bucket, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium text-foreground min-w-[100px]">
                        {bucket.range}
                      </div>
                      <Badge className={`${getStatusColor(bucket.status)} border font-medium`}>
                        {bucket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-lg font-semibold cursor-help">
                              {formatCurrencyAbbreviated(bucket.amount)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getFullCurrencyAmount(bucket.amount)}</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="text-sm text-muted-foreground">{formatPercentage(bucket.percentage)}</div>
                      </div>
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            bucket.status === 'current' ? 'bg-success' :
                            bucket.status === 'attention' ? 'bg-warning' :
                            bucket.status === 'warning' ? 'bg-orange-500' :
                            'bg-destructive'
                          }`}
                          style={{ width: `${bucket.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Generate Statements</div>
                    <div className="text-sm text-muted-foreground">Create patient statements</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Follow-up Tasks</div>
                    <div className="text-sm text-muted-foreground">Create collection tasks</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Insurance Follow-up</div>
                    <div className="text-sm text-muted-foreground">Contact insurance carriers</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Aging Report</div>
                    <div className="text-sm text-muted-foreground">Detailed aging analysis</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </TooltipProvider>
  );
};

export default ARDashboard;