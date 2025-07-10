import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClaimsList from '@/components/claims/ClaimsList';
import ClaimsStats from '@/components/claims/ClaimsStats';
import AddClaimDialog from '@/components/claims/AddClaimDialog';
import PaymentPostingDialog from '@/components/claims/PaymentPostingDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const Claims = () => {
  const [selectedTab, setSelectedTab] = useState('0-30');
  const [showAddClaim, setShowAddClaim] = useState(false);
  const [showPaymentPosting, setShowPaymentPosting] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handlePostPayment = (claimId: string) => {
    setSelectedClaimId(claimId);
    setShowPaymentPosting(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <header className="border-b border-border bg-background px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-left">Claims Management</h1>
            <p className="text-muted-foreground">Track and manage insurance claims</p>
          </div>
        </div>
      </header>

      {/* Summary Cards Section */}
      <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <ClaimsStats />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Claims List */}
          <Card className="animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Claims</CardTitle>
              <Button onClick={() => setShowAddClaim(true)} className="hover-scale">
                <Plus className="w-4 h-4 mr-2" />
                New Claim
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="0-30">0-30 Days</TabsTrigger>
                    <TabsTrigger value="31-60">31-60 Days</TabsTrigger>
                    <TabsTrigger value="61-90">61-90 Days</TabsTrigger>
                    <TabsTrigger value="90+">90+ Days</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="0-30" className="m-0">
                  <ClaimsList 
                    agingBucket="0-30" 
                    onPostPayment={handlePostPayment}
                  />
                </TabsContent>
                <TabsContent value="31-60" className="m-0">
                  <ClaimsList 
                    agingBucket="31-60" 
                    onPostPayment={handlePostPayment}
                  />
                </TabsContent>
                <TabsContent value="61-90" className="m-0">
                  <ClaimsList 
                    agingBucket="61-90" 
                    onPostPayment={handlePostPayment}
                  />
                </TabsContent>
                <TabsContent value="90+" className="m-0">
                  <ClaimsList 
                    agingBucket="90+" 
                    onPostPayment={handlePostPayment}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Dialogs */}
          <AddClaimDialog 
            open={showAddClaim} 
            onOpenChange={setShowAddClaim} 
          />
          <PaymentPostingDialog 
            open={showPaymentPosting}
            onOpenChange={setShowPaymentPosting}
            claimId={selectedClaimId}
          />
        </div>
      </div>
    </div>
  );
};

export default Claims;