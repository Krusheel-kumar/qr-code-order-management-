import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Link as LinkIcon, MessageCircle, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 z-[101] shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-xl">Share</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 rounded-full ${link.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <link.icon size={24} fill={link.name === 'Twitter' ? 'currentColor' : 'none'} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{link.name}</span>
                </a>
              ))}
              <button
                onClick={handleCopy}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                  {copied ? <Check size={24} /> : <Copy size={24} />}
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                <LinkIcon size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-500 truncate">{url}</p>
              </div>
              <button 
                onClick={handleCopy}
                className="text-xs font-bold text-[var(--color-primary)] whitespace-nowrap uppercase tracking-wider px-2"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
