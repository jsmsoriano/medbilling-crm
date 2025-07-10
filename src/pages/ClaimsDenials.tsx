import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, FileText, RefreshCw } from "lucide-react";

const ClaimsDenials = () => {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Denials Management</h1>
          <p className="text-muted-foreground">
            Track and manage denied claims for resolution
          </p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Resubmit Selected
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by claim number or denial reason..."
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Denied Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim Number</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Service Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Denial Reason</TableHead>
                <TableHead>Days Outstanding</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">CLM-2024-001</TableCell>
                <TableCell>John Smith</TableCell>
                <TableCell>12/15/2023</TableCell>
                <TableCell>$250.00</TableCell>
                <TableCell>Missing authorization</TableCell>
                <TableCell>45</TableCell>
                <TableCell>
                  <Badge variant="destructive">High</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CLM-2024-002</TableCell>
                <TableCell>Jane Doe</TableCell>
                <TableCell>01/10/2024</TableCell>
                <TableCell>$180.00</TableCell>
                <TableCell>Incorrect diagnosis code</TableCell>
                <TableCell>30</TableCell>
                <TableCell>
                  <Badge variant="secondary">Medium</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimsDenials;