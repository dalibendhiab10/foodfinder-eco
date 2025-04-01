
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { toast } from 'react-toastify';
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

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (isLoading || detectedCodes.length === 0) return;

    const result = detectedCodes[0].rawValue; // Extract the raw value from the first detected code
    if (!result) return; // Ensure we have a result
    
    try {
      setIsLoading(true);
      
      // Stop scanning
      setIsScanning(false);
      
      // Check if this is a valid table session code
      // Expected format: tableSession_CODE123
      if (!result.startsWith('tableSession_')) {
        toast.error('Invalid QR Code: This QR code is not for a restaurant table.');
        return;
      }
      
      // Extract the session code
      const sessionCode = result.replace('tableSession_', '');
      
      // Try to fetch the table session
      const session = await getTableSessionByCode(sessionCode);
      
      if (!session) {
        toast.error('Invalid Session: This table session is no longer active or does not exist.');
        return;
      }
      
      // Success! Notify parent component or navigate to the table session
      if (onSessionStart) {
        onSessionStart(session.id, session.table_id, session.restaurant_id);
      } else {
        toast.success('Table Session Found: You are now connected to the table session.');
        
        // Navigate to restaurant menu page with the session
        navigate(`/restaurant/${session.restaurant_id}/table/${session.table_id}/session/${session.id}`);
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      toast.error('Something went wrong: Could not process the QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: any) => {
    console.error('QR scan error:', error);
    toast.error('Scanner Error: There was a problem with the QR scanner. Please try again.');
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
              onScan={handleScan}
              onError={handleError}
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
