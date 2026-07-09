import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag, Share2 } from 'lucide-react';
import type { MenuItem } from '../data/menu';
import { useCartStore } from '../store/useCartStore';
import { shareContent } from '../utils/shareUtils';
import ShareModal from './ui/ShareModal';
import BadgeChip from './ui/BadgeChip';
import type { CustomizationGroup, CustomizationOption } from '../data/models';
import { getBlacklistedOptions } from '../api';

interface CustomizerSheetProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizerSheet({ product, isOpen, onClose }: CustomizerSheetProps) {
  const cartStore = useCartStore();

  const [step, setStep] = useState<'details' | 'customize'>('details');
  
  // Customizations state: maps groupId -> list of selected options
  const [selections, setSelections] = useState<Record<string, CustomizationOption[]>>({});
  const [groupErrors, setGroupErrors] = useState<Record<string, string>>({});
  const [blacklistedOptionIds, setBlacklistedOptionIds] = useState<string[]>([]);
  const [shareModal, setShareModal] = useState<{isOpen: boolean, title: string, url: string}>({isOpen: false, title: '', url: ''});

  // Load branch blacklist overrides when sheet opens
  useEffect(() => {
    if (isOpen && cartStore.storeId) {
      getBlacklistedOptions(cartStore.storeId)
        .then(setBlacklistedOptionIds)
        .catch(console.error);
    } else {
      setBlacklistedOptionIds([]);
    }
  }, [isOpen, cartStore.storeId]);

  // Reset selections state when product changes
  useEffect(() => {
    if (product) {
      setStep('details');
      setGroupErrors({});
      
      const initialSelections: Record<string, CustomizationOption[]> = {};
      product.customizationGroups?.forEach(group => {
        // Pre-select the first available option if required and minSelections > 0
        if (group.minSelections > 0 && group.options && group.options.length > 0) {
          const defaultOpt = group.options.find(o => o.isAvailable && !blacklistedOptionIds.includes(o.id));
          if (defaultOpt) {
            initialSelections[group.id] = [defaultOpt];
          } else {
            initialSelections[group.id] = [];
          }
        } else {
          initialSelections[group.id] = [];
        }
      });
      setSelections(initialSelections);
    }
  }, [product, blacklistedOptionIds]);

  if (!product) return null;

  // Price Calculation: Base + Customization extra charges (with group free limits)
  let expectedItemPrice = product.price;

  let customizationsPrice = 0;
  product.customizationGroups?.forEach(group => {
    const selected = selections[group.id] || [];
    const freeLimit = group.freeSelectionsLimit || 0;
    
    // Sort options ascending by price so cheapest options are discounted first
    const sorted = [...selected].sort((a, b) => a.defaultPrice - b.defaultPrice);
    
    let remainingFree = freeLimit;
    sorted.forEach(opt => {
      // In customer customizer sheet, option qty is treated as 1
      const qty = 1;
      const freeApplied = Math.min(qty, remainingFree);
      remainingFree -= freeApplied;
      
      const billableQty = qty - freeApplied;
      customizationsPrice += opt.defaultPrice * billableQty;
    });
  });

  const totalPrice = expectedItemPrice + customizationsPrice;

  const handleSelectOption = (group: CustomizationGroup, option: CustomizationOption) => {
    const current = selections[group.id] || [];
    const isAlreadySelected = current.some(o => o.id === option.id);
    let newSelected: CustomizationOption[] = [];

    if (isAlreadySelected) {
      newSelected = current.filter(o => o.id !== option.id);
    } else {
      if (group.maxSelections === 1) {
        newSelected = [option];
      } else if (current.length < group.maxSelections) {
        newSelected = [...current, option];
      } else {
        alert(`You can select a maximum of ${group.maxSelections} option(s) for "${group.name}".`);
        return;
      }
    }

    setSelections({ ...selections, [group.id]: newSelected });
    setGroupErrors({ ...groupErrors, [group.id]: '' });
  };

  const handleAddToCart = () => {
    // Validate minSelection requirements for each group
    const errors: Record<string, string> = {};
    let hasErrors = false;

    product.customizationGroups?.forEach(group => {
      const selectedCount = (selections[group.id] || []).length;
      if (selectedCount < group.minSelections) {
        errors[group.id] = `Please select at least ${group.minSelections} option(s).`;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setGroupErrors(errors);
      // Scroll to the first group that has an error
      const firstErrorGroupId = Object.keys(errors)[0];
      const element = document.getElementById(`group-section-${firstErrorGroupId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Build customizations text string for backward compatibility
    const customizationsText: string[] = [];
    
    const customizationsList: { optionId: string; quantity: number }[] = [];

    product.customizationGroups?.forEach(group => {
      const selected = selections[group.id] || [];
      if (selected.length > 0) {
        const optionNames = selected.map(o => o.name).join(', ');
        customizationsText.push(`${group.name}: ${optionNames}`);
        
        selected.forEach(o => {
          customizationsList.push({
            optionId: o.id,
            quantity: 1
          });
        });
      }
    });

    cartStore.addItem({
      product: product,
      customization: customizationsText.join(' | '),
      price: totalPrice,
      quantity: 1,
      customizationsList
    });

    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    onClose();
  };

  const handleShare = () => {
    if (!product) return;
    const shareUrl = `${window.location.origin}/menu?p=${product.id}`;
    shareContent(
      {
        title: `Hey! You have to try ${product.name} at POP O'BOB®! 🧋`,
        text: product.story ? `"${product.story}"` : `It's absolutely delicious and I thought you'd love it.`,
        url: shareUrl,
        imageUrl: product.image,
      },
      () => {
        setShareModal({
          isOpen: true,
          title: `Check out ${product.name} at POP O'BOB®!`,
          url: shareUrl
        });
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A0B05]/60 backdrop-blur-sm z-[100000]"
          />
          
          <motion.div
            key="modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 w-full h-[100dvh] bg-white z-[100001] flex flex-col overflow-hidden"
          >
            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar relative flex flex-col bg-white">
              
              {step === 'details' ? (
                <>
                  {/* Floating Header Buttons */}
                  <div className="absolute top-0 w-full z-50 flex justify-end p-5 pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto">
                      <button 
                        onClick={handleShare}
                        className="w-11 h-11 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-800 shadow-lg hover:bg-white active:scale-95 transition-all shrink-0 border border-white/20"
                      >
                        <Share2 size={18} />
                      </button>
                      <button 
                        onClick={onClose}
                        className="w-11 h-11 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-800 shadow-lg hover:bg-white active:scale-95 transition-all shrink-0 border border-white/20"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Full Width Hero Image */}
                  {product.image ? (
                    <div className="w-full h-[50vh] bg-gray-100 shrink-0 relative">
                      <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                  ) : (
                    <div className="w-full h-[50vh] bg-orange-50 text-orange-300 flex items-center justify-center shrink-0">
                      <ShoppingBag size={64}/>
                    </div>
                  )}

                  <div className="p-6 space-y-6 flex-1 bg-white relative -mt-8 rounded-t-[2rem] z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-heading font-extrabold text-3xl text-[#1A0B05] leading-tight mb-1 tracking-tight">{product.name}</h3>
                        <span className="font-black text-2xl text-[#FF9800]">₹{product.price}</span>
                      </div>
                      <button 
                        onClick={() => setStep('customize')}
                        className="shrink-0 bg-[#1A0B05] text-white px-5 py-3 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all mt-1"
                      >
                        Customize
                      </button>
                    </div>
                    <p className="text-base text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-2xl italic border border-gray-100">
                      "{product.story}"
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col flex-1">
                  {/* Header with Small Image */}
                  <div className="sticky top-0 bg-white/95 backdrop-blur-xl px-6 py-4 flex items-center gap-4 border-b border-gray-100 z-50 shrink-0">
                    {product.image ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-gray-100 shadow-sm">
                        <img src={product.image} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-gray-100 shadow-sm bg-orange-50 text-orange-300 flex items-center justify-center">
                        <ShoppingBag size={20}/>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-heading font-extrabold text-xl text-foreground line-clamp-1">{product.name}</h3>
                      <span className="font-bold text-primary">₹{product.price}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => setStep('details')}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-foreground/70 hover:bg-gray-200 active:scale-95 transition-all shrink-0 font-bold"
                      >
                        <span className="transform -scale-x-100 block">➔</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-8 flex-1">
                    {/* Dynamic Customization Groups */}
                    {product.customizationGroups?.map(group => {
                      const selected = selections[group.id] || [];
                      const error = groupErrors[group.id];
                      return (
                        <div 
                          key={group.id} 
                          id={`group-section-${group.id}`} 
                          className={`p-4 -mx-4 rounded-2xl border transition-all duration-300 ${error ? 'bg-red-50/50 border-red-200 shadow-sm' : 'border-transparent'}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-[#1A0B05] uppercase tracking-widest text-sm flex items-center gap-1">
                              {group.name}
                              {group.isRequired && <span className="text-red-500">*</span>}
                            </h4>
                            {group.freeSelectionsLimit > 0 && (
                              <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">
                                First {group.freeSelectionsLimit} Free
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[12px] text-gray-400 mb-4">
                            Choose between {group.minSelections} and {group.maxSelections} option(s)
                          </p>

                          {error && (
                            <p className="text-xs text-red-500 font-bold mb-3 bg-red-100/50 p-2 rounded-xl border border-red-200/40">
                              {error}
                            </p>
                          )}

                          <div className="flex flex-col gap-2">
                            {group.options?.map(option => {
                              const isSelected = selected.some(o => o.id === option.id);
                              const isBlacklisted = blacklistedOptionIds.includes(option.id);
                              const isAvailable = option.isAvailable && !isBlacklisted;
                              
                              return (
                                <button
                                  key={option.id}
                                  disabled={!isAvailable}
                                  onClick={() => handleSelectOption(group, option)}
                                  className={`relative w-full p-3 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 text-left overflow-hidden ${
                                    !isAvailable
                                      ? 'border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed'
                                      : isSelected
                                      ? 'border-[#FFD54F] bg-[#FFF8E8] shadow-sm ring-2 ring-[#FFD54F]/20'
                                      : 'border-[#FAEDCD] bg-white hover:border-[#FFD54F]/50 hover:bg-[#FFF8E8]/50 hover:shadow-sm'
                                  }`}
                                >
                                  <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                                    {option.badgeEnabled && (
                                      <BadgeChip type={option.badgeType} color={option.badgeColor} icon={option.badgeIcon} />
                                    )}
                                    <div className="flex items-center gap-2 mt-0.5 w-full">
                                      <span className={`font-black text-[15px] leading-tight truncate ${isSelected ? 'text-[#2A1B16]' : 'text-gray-800'}`}>
                                        {option.name}
                                      </span>
                                      {!isAvailable && (
                                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider shrink-0">
                                          Sold Out
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1.5 shrink-0 mt-0.5">
                                    {option.defaultPrice > 0 ? (
                                      <span className={`font-black text-[14px] ${isSelected ? 'text-[#B87A42]' : 'text-gray-500'}`}>
                                        +₹{option.defaultPrice}
                                      </span>
                                    ) : (
                                      <span className={`font-black text-[12px] uppercase tracking-wider ${isSelected ? 'text-[#2A1B16]' : 'text-gray-400'}`}>
                                        Free
                                      </span>
                                    )}
                                    {isSelected && (
                                      <div className="bg-[#2A1B16] text-[#FFD54F] p-1 rounded-full shadow-sm mt-0.5">
                                        <Check size={12} strokeWidth={4} />
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Add To Cart Button */}
            {step === 'customize' && (
              <div className="shrink-0 p-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50">
                <button
                  onClick={handleAddToCart}
                  className="w-full text-white py-4 rounded-2xl font-bold text-lg bg-[#1A0B05] hover:bg-[#2A150C] shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all flex justify-between items-center px-6 border border-black/10"
                >
                  <span className="uppercase tracking-widest text-sm">Add to Cart</span>
                  <span className="opacity-90 text-[17px] tracking-tight font-extrabold text-primary">₹{totalPrice}</span>
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
      
      {/* Share Modal Fallback */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal(prev => ({ ...prev, isOpen: false }))}
        title={shareModal.title}
        url={shareModal.url}
      />
    </AnimatePresence>
  );
}
