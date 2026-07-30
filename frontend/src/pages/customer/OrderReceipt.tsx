import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Share } from 'lucide-react';
import ReceiptTemplate from '../../components/ui/ReceiptTemplate';

export default function OrderReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchOrder = async () => {
      try {
        const { getOrderById } = await import('../../api');
        const data = await getOrderById(id);
        if (data) {
          setOrder(data);
        } else {
          setError('Receipt not found.');
        }
      } catch (err) {
        console.error('Failed to load receipt:', err);
        setError('Unable to load receipt. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `POP O'BOB Order Receipt #${order?.orderNumber || order?.id?.substring(0, 5)}`,
          text: `Here is the receipt for my recent POP O'BOB order.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Receipt link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    // In a full implementation, html2canvas and jsPDF would be used here.
    // For now, trigger a print dialog which achieves saving as PDF natively.
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="font-heading font-black text-2xl text-[#1A0B05] mb-2">Receipt Unavailable</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-[#1A0B05] text-white px-8 py-3 rounded-full font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#F4F5F7] font-sans flex flex-col pb-6 text-[#1A0B05] relative">
      {/* Header (Hidden when printing) */}
      <header className="flex justify-between items-center px-6 py-5 sticky top-0 bg-[#F4F5F7]/90 backdrop-blur-xl z-20 print:hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2.5} className="text-[#1A0B05]" />
        </button>
        <h1 className="font-heading font-extrabold text-xl tracking-tight">E-Receipt</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-gray-700"
          >
            <Share size={20} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-4 pb-12 sm:max-w-md sm:mx-auto sm:w-full">
        {/* We add a print-specific class so the print view looks cleaner */}
        <div className="print:shadow-none print:bg-transparent">
          <ReceiptTemplate order={order} />
        </div>
        
        {/* Floating Download Button (Hidden when printing) */}
        <div className="mt-8 flex justify-center print:hidden">
          <button 
            onClick={handleDownload}
            className="w-full max-w-sm py-4 bg-[#1A0B05] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0B05] rounded-2xl flex items-center justify-center gap-2 font-black transition-all active:scale-[0.98] shadow-lg"
          >
            <Download size={20} />
            Download PDF
          </button>
        </div>
      </main>

      {/* CSS for print mode */}
      <style>{`
        @media print {
          body { background-color: white !important; }
          #receipt-container { box-shadow: none !important; max-width: 100% !important; border-radius: 0 !important; }
          #receipt-container > div:first-child { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
}
