import { useState } from 'react';
import { Download, QrCode, Link2, CheckCircle2 } from 'lucide-react';
import { STORES } from '../../data/stores';

export default function QRGenerator() {
  const [tableNumber, setTableNumber] = useState('');
  const [selectedStore, setSelectedStore] = useState(STORES[0].id);
  const [copied, setCopied] = useState(false);
  const [frontendUrl, setFrontendUrl] = useState(() => localStorage.getItem('qr_frontend_url') || 'https://popobob.com');

  const getUrl = () => {
    if (!tableNumber) return '';
    let baseUrl = frontendUrl;
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    if (!baseUrl.startsWith('http')) baseUrl = 'https://' + baseUrl;
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      <div>
        <h1 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight">QR Generator</h1>
        <p className="text-[#8D6E63] font-medium mt-1">Generate specific Dine-In QR codes for tables across your locations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Configuration */}
        <div className="glass-panel rounded-2xl border border-[#FAEDCD] overflow-hidden h-fit bg-[#FFFDF8]">
          <div className="p-6 border-b border-[#FAEDCD]/60 bg-[#FFF8E8]/40 flex items-center gap-3">
            <QrCode className="w-5 h-5 text-[#8D6E63]" />
            <h2 className="text-lg font-heading font-bold text-[#2A1B16]">Table Settings</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1B16] mb-1.5">Live Customer App URL</label>
              <input 
                type="text" 
                placeholder="e.g. https://popobob.com" 
                value={frontendUrl}
                onChange={(e) => {
                  setFrontendUrl(e.target.value);
                  localStorage.setItem('qr_frontend_url', e.target.value);
                }}
                className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
              />
              <p className="text-2xs text-[#8D6E63]/70 font-semibold mt-1.5">The generated QR code will redirect users to this domain.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1B16] mb-1.5">Store Location</label>
              <select 
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium cursor-pointer"
              >
                {STORES.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1B16] mb-1.5">Table Number / Identifier</label>
              <input 
                type="text" 
                placeholder="e.g. 5, Balcony-1, VIP-2" 
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full border border-[#FAEDCD] rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium placeholder-[#8D6E63]/30"
              />
            </div>
          </div>
        </div>

        {/* Right Side: QR Preview */}
        <div className="glass-panel rounded-2xl border border-[#FAEDCD] p-8 flex flex-col items-center justify-center text-center bg-[#FFFDF8]">
          {tableNumber ? (
            <div className="space-y-6 w-full max-w-sm">
              <div className="bg-[#FFF8E8]/30 p-4.5 rounded-3xl border border-[#FAEDCD]/50 shadow-inner inline-block">
                <img 
                  src={getQrCodeUrl()} 
                  alt={`QR for Table ${tableNumber}`} 
                  className="w-64 h-64 rounded-xl object-contain bg-white p-2 border border-[#FAEDCD]/50 shadow-2xs"
                />
              </div>
              
              <div>
                <h3 className="font-heading font-black text-[#2A1B16] text-xl">Table {tableNumber}</h3>
                <p className="text-xs text-[#8D6E63] font-semibold mt-0.5">{STORES.find(s => s.id === selectedStore)?.name}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={downloadQR}
                  className="w-full flex items-center justify-center gap-2 bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-6 py-3.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer active:scale-95 text-xs uppercase tracking-wider"
                >
                  <Download className="w-4.5 h-4.5" />
                  Download High-Res QR
                </button>
                
                <button 
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#8D6E63] border border-gray-300 px-6 py-3.5 rounded-xl font-bold transition-all shadow-2xs cursor-pointer text-xs uppercase tracking-wider"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Copied!</>
                  ) : (
                    <><Link2 className="w-4.5 h-4.5" /> Copy Direct Link</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-[#8D6E63]">
              <div className="w-24 h-24 bg-[#FFF8E8]/30 border-2 border-dashed border-[#FAEDCD] rounded-2xl mb-4 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-[#8D6E63]/40" />
              </div>
              <p className="font-heading font-bold text-sm text-[#2A1B16]">Dine-In QR Code Preview</p>
              <p className="text-2xs text-[#8D6E63]/70 font-semibold mt-1">Enter a table number in settings to generate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
