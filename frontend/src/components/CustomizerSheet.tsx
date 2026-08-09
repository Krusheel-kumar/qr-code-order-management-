import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag, Share2, MapPin } from 'lucide-react';
import type { MenuItem } from '../data/menu';
import { useCartStore } from '../store/useCartStore';
import { shareContent } from '../utils/shareUtils';
import ShareModal from './ui/ShareModal';
import BadgeChip from './ui/BadgeChip';
import type { CustomizationGroup, CustomizationOption } from '../data/models';
import { getBlacklistedOptions } from '../api';
import { STORES } from '../data/stores';

interface CustomizerSheetProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizerSheet({ product, isOpen, onClose }: CustomizerSheetProps) {
  const cartStore = useCartStore();


  
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
            drag={window.innerWidth < 1024 ? "y" : false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.y > 150 || velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed top-0 left-0 w-full h-[100dvh] lg:h-auto lg:max-h-[85vh] lg:max-w-5xl lg:rounded-[2rem] lg:inset-0 lg:m-auto lg:border lg:border-white/50 lg:shadow-[0_35px_100px_rgba(0,0,0,0.35)] bg-[#FDFCF9] z-[100001] flex flex-col lg:flex-row overflow-hidden"
          >
            {/* Split Content Container */}
            <div className="flex-1 min-h-0 relative flex flex-col lg:flex-row bg-[#FDFCF9] w-full mt-2 lg:mt-0 rounded-t-[2rem] lg:rounded-none overflow-hidden">
              
              {/* Drag Handle (Mobile Only) */}
              <div className="lg:hidden absolute top-0 w-full h-8 flex items-center justify-center z-50 pointer-events-none">
                <div className="w-12 h-1.5 bg-white/50 backdrop-blur-md rounded-full mt-2" />
              </div>

              {/* LEFT COLUMN: Image & Header Buttons */}
              <div className="w-full lg:w-[45%] shrink-0 relative lg:h-auto bg-[#FFFBF2] flex flex-col">
                {/* Floating Header Buttons */}
                <div className="absolute top-0 w-full z-50 flex justify-end p-4 lg:p-5 pointer-events-none">
                  <div className="flex items-center gap-3 pointer-events-auto">
                    <button 
                      onClick={handleShare}
                      className="w-10 h-10 lg:w-11 lg:h-11 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center text-[#1A0B05] shadow-md hover:bg-white active:scale-95 transition-all shrink-0 border border-black/5"
                    >
                      <Share2 size={18} />
                    </button>
                    <button 
                      onClick={onClose}
                      className="w-10 h-10 lg:w-11 lg:h-11 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center text-[#1A0B05] shadow-md hover:bg-white active:scale-95 transition-all shrink-0 border border-black/5"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Hero Image */}
                {product.image ? (
                  <div className="w-full h-[40vh] lg:h-full lg:min-h-[400px] shrink-0 relative">
                    <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden"></div>
                  </div>
                ) : (
                  <div className="w-full h-[40vh] lg:h-full lg:min-h-[400px] bg-orange-50 text-orange-300 flex items-center justify-center shrink-0">
                    <ShoppingBag size={64}/>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Info & Customization (Scrollable) */}
              <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col relative z-20 -mt-8 lg:mt-0 bg-[#FDFCF9] rounded-t-[2rem] lg:rounded-none">
                
                {/* Product Header Info */}
                <div className="p-6 pb-2">
                  <div className="flex flex-col mb-1">
                    <h3 className="font-heading font-black text-xl lg:text-2xl text-[#1A0B05] leading-tight tracking-tight mb-1">{product.name}</h3>
                    <span className="font-black text-lg text-[#D4AF37]">₹{product.price}</span>
                  </div>
                  {product.story?.trim() && (
                    <p className="text-[13px] lg:text-sm text-gray-500 mt-3 leading-relaxed bg-gray-50 p-4 rounded-xl italic border border-gray-100">
                      "{product.story}"
                    </p>
                  )}
                </div>

                {/* Customization Options or Store Selection */}
                <div className="p-6 pt-2 space-y-8 flex-1">
                  {cartStore.orderType === 'PICKUP' && !cartStore.storeId ? (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-[#1A0B05] font-black text-xl mb-1">Select Pickup Store</h3>
                        <p className="text-gray-500 text-sm">Please choose a location to see availability and customize your drink.</p>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        {STORES.map((store) => (
                          <button
                            key={store.id}
                            onClick={() => cartStore.setStoreId(store.id)}
                            className="w-full bg-white border border-gray-100 p-4 rounded-2xl flex items-start gap-4 text-left active:scale-[0.98] transition-all hover:border-[#D4AF37]/50 shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#FFFBF2] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                              <MapPin size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-black text-[#1A0B05] text-[15px] mb-1">{store.name}</h4>
                              <p className="text-gray-500 text-xs leading-relaxed">{store.address}</p>
                              <div className="mt-2 text-[#D4AF37] text-[10px] font-black uppercase tracking-wider">
                                {store.isOpen ? 'Open Now' : 'Closed'} • {store.opensAt} - {store.closesAt}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    product.customizationGroups?.map(group => {
                      const selected = selections[group.id] || [];
                      const error = groupErrors[group.id];
                      return (
                        <div 
                          key={group.id} 
                          id={`group-section-${group.id}`} 
                          className={`p-4 -mx-4 rounded-2xl border transition-all duration-300 ${error ? 'bg-red-50/50 border-red-200 shadow-sm' : 'border-transparent'}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-[#D4AF37] uppercase tracking-[0.2em] text-[11px] block mb-3 flex items-center gap-1">
                              {group.name}
                              {group.isRequired && <span className="text-red-500">*</span>}
                            </h4>
                            {group.freeSelectionsLimit > 0 && (
                              <span className="text-[10px] text-[#1A0B05] font-black bg-[#FFC461] px-2 py-0.5 rounded-md mt-[-8px]">
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
                                  className={`relative w-full p-3 rounded-xl border transition-all flex items-start justify-between gap-3 text-left overflow-hidden ${
                                    !isAvailable
                                      ? 'border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-[#FFFBF2] border-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]'
                                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#D4AF37]/50 hover:bg-[#FFFBF2]'
                                  }`}
                                >
                                  <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                                    {option.badgeEnabled && (
                                      <BadgeChip type={option.badgeType} color={option.badgeColor} icon={option.badgeIcon} />
                                    )}
                                    <div className="flex items-center gap-2 mt-0.5 w-full">
                                      <span className={`font-black text-[15px] leading-tight truncate text-[#1A0B05]`}>
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
                                      <span className={`font-black text-[14px] ${isSelected ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                                        +₹{option.defaultPrice}
                                      </span>
                                    ) : (
                                      <span className={`font-black text-[12px] uppercase tracking-wider ${isSelected ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                                        Free
                                      </span>
                                    )}
                                    {isSelected && (
                                      <div className="bg-[#1A0B05] text-[#D4AF37] p-0.5 rounded-full shadow-sm mt-0.5">
                                        <Check size={14} strokeWidth={4} />
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Footer Add To Cart Button */}
                {(cartStore.orderType !== 'PICKUP' || cartStore.storeId) && (
                  <div className="shrink-0 p-4 lg:p-6 bg-[#FDFCF9]/95 backdrop-blur-xl border-t border-gray-100 sticky bottom-0 z-50 mt-auto">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-[#D4AF37] hover:bg-[#FFC461] text-[#1A0B05] py-4 lg:py-5 rounded-full font-black text-[15px] shadow-[0_8px_20px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all flex justify-between items-center px-8 border border-[#1A0B05]/10 uppercase tracking-widest"
                    >
                      <span>Add to Bag</span>
                      <span className="text-xl font-black">₹{totalPrice}</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
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
