import { useState } from 'react';
import { Download, QrCode, Link2, Copy, CheckCircle2 } from 'lucide-react';
import { STORES } from '../../data/stores';

export default function QRGenerator() {
  const [tableNumber, setTableNumber] = useState('');
  const [selectedStore, setSelectedStore] = useState(STORES[0].id);
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (!tableNumber) return '';
    // Use the origin url. E.g. https://customer-app-domain.com/?table=1&storeId=1
    // For admin preview purposes, we'll construct the hypothetical frontend URL
    let baseUrl = window.location.origin;
    if (baseUrl.includes('localhost:') || baseUrl.includes('127.0.0.1:')) {
      // In local dev, admin is usually on 5174 or 5175, frontend on 5173
      baseUrl = baseUrl.replace(/5174|5175|3001/, '5173');
    }
    return `${baseUrl}/?table=${encodeURIComponent(tableNumber)}&storeId=${encodeURIComponent(selectedStore)}`;
  };

  const getQrCodeUrl = () => {
    const url = getUrl();
    if (!url) return '';
    // Using free QR generation API
    return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}`;
  };

  const handleCopyLink = () => {
    const url = getUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQR = async () => {
    const qrUrl = getQrCodeUrl();
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Table_${tableNumber}_QR.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading QR Code:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QR Generator</h1>
        <p className="text-gray-500 mt-1">Generate specific Dine-In QR codes for tables across your locations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
            <QrCode className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">Table Settings</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Location</label>
              <select 
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {STORES.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Table Number / Identifier</label>
              <input 
                type="text" 
                placeholder="e.g. 5, Balcony-1, VIP-2" 
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Side: QR Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
          {tableNumber ? (
            <div className="space-y-6 w-full max-w-sm">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-inner inline-block">
                <img 
                  src={getQrCodeUrl()} 
                  alt={`QR for Table ${tableNumber}`} 
                  className="w-64 h-64 rounded-lg object-contain bg-white p-2 border border-gray-100 shadow-sm"
                />
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Table {tableNumber}</h3>
                <p className="text-sm text-gray-500">{STORES.find(s => s.id === selectedStore)?.name}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={downloadQR}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-sm"
                >
                  <Download className="w-5 h-5" />
                  Download High-Res QR
                </button>
                
                <button 
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-bold transition-colors shadow-sm"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Copied!</>
                  ) : (
                    <><Link2 className="w-5 h-5" /> Copy Direct Link</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl mb-4 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-gray-300" />
              </div>
              <p className="font-medium text-gray-500">Enter a table number to generate QR</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
