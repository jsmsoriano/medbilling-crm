
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Calendar, User, Hash } from 'lucide-react';

interface ImportRecord {
  id: string;
  filename: string;
  import_date: string;
  status: string;
  records_imported: number;
  imported_by_username: string;
  file_size?: number;
  notes?: string;
}

interface ImportHistoryTableProps {
  importHistory?: ImportRecord[];
}

const ImportHistoryTable = ({ importHistory }: ImportHistoryTableProps) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Import History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {importHistory && importHistory.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Import Date
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Imported By
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Report Name
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Records
                  </div>
                </TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.import_date)}</TableCell>
                  <TableCell>{record.imported_by_username}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(record.filename)}
                      <span className="font-medium">{record.filename}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : record.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell>{record.records_imported}</TableCell>
                  <TableCell>{formatFileSize(record.file_size)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      {getFileIcon(record.filename)}
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No import history found</p>
            <p className="text-sm">Start by importing your first data file</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportHistoryTable;
