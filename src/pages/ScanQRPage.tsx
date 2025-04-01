
import React from 'react';
import BottomNav from '@/components/BottomNav';
import TableQRScanner from '@/components/TableQRScanner';

const ScanQRPage = () => {
  return (
    <div className="min-h-screen pb-16">
      <div className="p-4 bg-background sticky top-0 z-10 border-b">
        <h1 className="text-2xl font-bold">Scan Table QR Code</h1>
      </div>
      
      <div className="p-4">
        <TableQRScanner />
      </div>
      
      <BottomNav />
    </div>
  );
};

export default ScanQRPage;
