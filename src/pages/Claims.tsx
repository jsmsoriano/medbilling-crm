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
  const [selectedTab, setSelectedTab] = useState('all');
  const [showAddClaim, setShowAddClaim] = useState(false);
  const [showPaymentPosting, setShowPaymentPosting] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handlePostPayment = (claimId: string) => {
    setSelectedClaimId(claimId);
    setShowPaymentPosting(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Claims Management</h1>
            <p className="text-muted-foreground">Track and manage insurance claims</p>
          </div>
          <Button onClick={() => setShowAddClaim(true)} className="hover-scale">
            <Plus className="w-4 h-4 mr-2" />
            New Claim
          </Button>
        </div>

        {/* Stats Overview */}
        <ClaimsStats />

        {/* Claims List */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Claims</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="submitted">Submitted</TabsTrigger>
                  <TabsTrigger value="partially_paid">Partial</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="denied">Denied</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <ClaimsList 
                  status="" 
                  onPostPayment={handlePostPayment}
                />
              </TabsContent>
              <TabsContent value="submitted" className="m-0">
                <ClaimsList 
                  status="submitted" 
                  onPostPayment={handlePostPayment}
                />
              </TabsContent>
              <TabsContent value="partially_paid" className="m-0">
                <ClaimsList 
                  status="partially_paid" 
                  onPostPayment={handlePostPayment}
                />
              </TabsContent>
              <TabsContent value="paid" className="m-0">
                <ClaimsList 
                  status="paid" 
                  onPostPayment={handlePostPayment}
                />
              </TabsContent>
              <TabsContent value="denied" className="m-0">
                <ClaimsList 
                  status="denied" 
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
  );
};

export default Claims;