
import { useState, useEffect } from 'react';
import { SpreadsheetService, SpreadsheetData, ClaimData } from '@/services/spreadsheetService';
import { useToast } from '@/components/ui/use-toast';

export const useSpreadsheetData = () => {
  const [clients, setClients] = useState<SpreadsheetData[]>([]);
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [clientsData, claimsData] = await Promise.all([
        SpreadsheetService.getClients(),
        SpreadsheetService.getClaims(),
      ]);
      
      setClients(clientsData);
      setClaims(claimsData);
      
      toast({
        title: "Data loaded successfully",
        description: "Spreadsheet data has been imported",
      });
    } catch (err) {
      setError('Failed to load spreadsheet data');
      toast({
        title: "Error loading data",
        description: "Could not import spreadsheet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const importFromFile = async (file: File) => {
    setLoading(true);
    
    try {
      const importedData = await SpreadsheetService.importFromFile(file);
      setClients(importedData);
      
      toast({
        title: "File imported successfully",
        description: `Imported ${importedData.length} client records`,
      });
    } catch (err) {
      setError('Failed to import file');
      toast({
        title: "Import failed",
        description: "Could not import the selected file",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      const csvContent = await SpreadsheetService.exportToCSV(clients);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clients-export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Client data exported to CSV",
      });
    } catch (err) {
      toast({
        title: "Export failed",
        description: "Could not export data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    clients,
    claims,
    loading,
    error,
    loadData,
    importFromFile,
    exportToCSV,
  };
};
