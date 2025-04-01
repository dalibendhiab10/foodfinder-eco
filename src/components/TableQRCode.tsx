
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from 'qrcode.react';

interface TableQRCodeProps {
  sessionCode: string;
  tableNumber: string;
  restaurantName: string;
}

const TableQRCode: React.FC<TableQRCodeProps> = ({ 
  sessionCode, 
  tableNumber, 
  restaurantName 
}) => {
  const [qrValue, setQrValue] = useState('');
  
  useEffect(() => {
    // Format: tableSession_CODE123
    setQrValue(`tableSession_${sessionCode}`);
  }, [sessionCode]);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>{restaurantName}</CardTitle>
        <CardDescription>Table {tableNumber}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        {qrValue && (
          <div className="border-8 border-white rounded-lg shadow-lg">
            <QRCode 
              value={qrValue} 
              size={200} 
              level="H" 
              renderAs="svg"
            />
          </div>
        )}
      </CardContent>
      <div className="text-center pb-4 text-sm text-muted-foreground">
        Scan to place your order
      </div>
    </Card>
  );
};

export default TableQRCode;
