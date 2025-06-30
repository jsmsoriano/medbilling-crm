
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientPerformanceData } from '@/utils/pdf/types';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, addDays } from 'date-fns';

interface Transaction {
  id: string;
  date: Date;
  clientName: string;
  type: string;
  amount: number;
  status: string;
  description: string;
}

interface TransactionsListProps {
  filteredData: ClientPerformanceData[];
  dateRange: DateRange;
  reportType: string;
}

const TransactionsList = ({ filteredData, dateRange, reportType }: TransactionsListProps) => {
  // Generate mock transactions based on filtered data and date range
  const generateMockTransactions = (): Transaction[] => {
    const transactions: Transaction[] = [];
    
    if (!dateRange.from || !dateRange.to) return transactions;

    filteredData.forEach((client, clientIndex) => {
      // Generate transactions for each day in the date range
      const startDate = dateRange.from!;
      const endDate = dateRange.to!;
      
      for (let date = new Date(startDate); date <= endDate; date = addDays(date, 1)) {
        // Generate 1-3 transactions per client per day (randomly)
        const transactionCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < transactionCount; i++) {
          const transactionTypes = ['Payment', 'Claim Submission', 'Denial', 'Appeal', 'Collection'];
          const statuses = ['Completed', 'Pending', 'Failed', 'Processing'];
          
          transactions.push({
            id: `${clientIndex}-${date.getTime()}-${i}`,
            date: new Date(date),
            clientName: client.name,
            type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
            amount: Math.floor(Math.random() * 5000) + 100,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            description: `${reportType} transaction for ${client.name}`
          });
        }
      }
    });

    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const transactions = generateMockTransactions();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Transactions ({format(dateRange.from!, 'MMM dd, yyyy')} - {format(dateRange.to!, 'MMM dd, yyyy')})
        </CardTitle>
        <p className="text-sm text-gray-600">
          Showing {transactions.length} transactions for the selected date range
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(transaction.date, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{transaction.clientName}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className="font-medium">
                    ${transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {transaction.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
