
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getTableSessionByCode } from '@/services/restaurantService';

interface TableQRScannerProps {
  onSessionStart?: (sessionId: string, tableId: string, restaurantId: string) => void;
}

const TableQRScanner: React.FC<TableQRScannerProps> = ({ onSessionStart }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (result: string) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Stop scanning
      setIsScanning(false);
      
      // Check if this is a valid table session code
      // Expected format: tableSession_CODE123
      if (!result.startsWith('tableSession_')) {
        toast({
          variant: 'destructive',
          title: 'Invalid QR Code',
          description: 'This QR code is not for a restaurant table.'
        });
        return;
      }
      
      // Extract the session code
      const sessionCode = result.replace('tableSession_', '');
      
      // Try to fetch the table session
      const session = await getTableSessionByCode(sessionCode);
      
      if (!session) {
        toast({
          variant: 'destructive',
          title: 'Invalid Session',
          description: 'This table session is no longer active or does not exist.'
        });
        return;
      }
      
      // Success! Notify parent component or navigate to the table session
      if (onSessionStart) {
        onSessionStart(session.id, session.table_id, session.restaurant_id);
      } else {
        toast({
          title: 'Table Session Found',
          description: 'You are now connected to the table session.'
        });
        
        // Navigate to restaurant menu page with the session
        navigate(`/restaurant/${session.restaurant_id}/table/${session.table_id}/session/${session.id}`);
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Could not process the QR code. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: any) => {
    console.error('QR scan error:', error);
    toast({
      variant: 'destructive',
      title: 'Scanner Error',
      description: 'There was a problem with the QR scanner. Please try again.'
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan Table QR Code</CardTitle>
        <CardDescription>
          Scan the QR code on your restaurant table to start your order
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isScanning ? (
          <div className="relative overflow-hidden rounded-lg">
            <Scanner
              onResult={handleScan}
              onError={handleError}
              containerStyle={{ borderRadius: '0.5rem' }}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Camera is off. Click "Start Scanning" to begin.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          onClick={() => setIsScanning(!isScanning)}
        >
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TableQRScanner;
