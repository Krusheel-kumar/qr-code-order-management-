import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMenuStore } from '../../store/useMenuStore';
import { shareContent } from '../../utils/shareUtils';
import ShareModal from '../ui/ShareModal';

interface StoryModalProps {
  storyId: string;
  onClose: () => void;
}

export default function StoryModal({ storyId, onClose }: StoryModalProps) {
  const navigate = useNavigate();
  const { stories } = useMenuStore();
  const initialStoryIndex = stories.findIndex(s => s.id === storyId);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex !== -1 ? initialStoryIndex : 0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [shareModal, setShareModal] = useState<{isOpen: boolean, title: string, url: string}>({isOpen: false, title: '', url: ''});

  const story = stories[currentStoryIndex];
  const slides = story?.slides && story.slides.length > 0 ? story.slides : [story?.image];

  const onCloseRef = useRef(onClose);
  const isPausedRef = useRef(isPaused);
  const pressStartTime = useRef<number>(0);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    setProgress(0); // Reset progress when slide changes
    const duration = 5000; // 5 seconds per slide
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + step;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [activeSlideIndex, currentStoryIndex]);

  // Handle auto-advance when progress completes
  useEffect(() => {
    if (progress >= 100) {
      setProgress(0); // Reset progress immediately to prevent double-firing
      if (activeSlideIndex < slides.length - 1) {
        setActiveSlideIndex(curr => curr + 1);
      } else {
        if (currentStoryIndex < stories.length - 1) {
          setCurrentStoryIndex(curr => curr + 1);
          setActiveSlideIndex(0);
        } else {
          onCloseRef.current();
        }
      }
    }
  }, [progress, activeSlideIndex, currentStoryIndex, slides.length]);

  const handleNext = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(curr => curr + 1);
    } else {
      if (currentStoryIndex < stories.length - 1) {
        setCurrentStoryIndex(curr => curr + 1);
        setActiveSlideIndex(0);
      } else {
        onCloseRef.current();
      }
    }
  };

  const handlePrev = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(curr => curr - 1);
    } else {
      if (currentStoryIndex > 0) {
        const prevStory = stories[currentStoryIndex - 1];
        const prevSlides = prevStory.slides && prevStory.slides.length > 0 ? prevStory.slides : [prevStory.image];
        setCurrentStoryIndex(curr => curr - 1);
        setActiveSlideIndex(prevSlides.length - 1);
      }
    }
  };

  const handlePointerDown = () => {
    setIsPaused(true);
    pressStartTime.current = Date.now();
  };

  const handlePointerUp = (action: 'next' | 'prev') => {
    setIsPaused(false);
    const duration = Date.now() - pressStartTime.current;
    
    // If it was a quick tap (less than 250ms), treat as navigation
    if (duration < 250) {
      if (action === 'next') handleNext();
      if (action === 'prev') handlePrev();
    }
  };

  const handlePointerLeave = () => {
    setIsPaused(false);
  };

  const currentImage = slides[activeSlideIndex];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger slide taps
    setIsPaused(true); // Pause the story while sharing
    
    const shareUrl = `${window.location.origin}/?story=${story.id}`;
    shareContent(
      {
        title: `Check out this amazing story from POP O'BOB®! ✨`,
        text: `"${story.title}"\nI thought you might want to see this.`,
        url: shareUrl,
        imageUrl: story.image,
      },
      () => {
        setShareModal({
          isOpen: true,
          title: `Check out ${story.title} at POP O'BOB®!`,
          url: shareUrl
        });
      }
    );
  };

  return (
    <>
    {/* Desktop Background Backdrop */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl hidden md:block"
      onClick={() => onCloseRef.current()}
    />

    {/* Desktop Global Close Button */}
    <button 
      onClick={() => onCloseRef.current()} 
      className="fixed top-6 right-6 lg:top-10 lg:right-10 z-[100001] w-12 h-12 items-center justify-center text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md hidden md:flex transition-colors cursor-pointer"
    >
      <X size={24} />
    </button>

    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[100000] bg-black md:bg-zinc-900 md:w-[420px] md:h-[90vh] md:max-h-[850px] md:rounded-[2.5rem] flex flex-col select-none overflow-hidden md:shadow-[0_0_60px_rgba(0,0,0,0.5)] border-0 md:border md:border-white/10"
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu on long press
    >
      {/* Progress Bars */}
      <div className={`absolute top-4 left-4 right-4 flex gap-1.5 z-50 transition-opacity duration-200 ${isPaused ? 'opacity-0' : 'opacity-100'}`}>
        {slides.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75 ease-linear rounded-full" 
              style={{ 
                width: idx < activeSlideIndex ? '100%' : idx === activeSlideIndex ? `${progress}%` : '0%' 
              }} 
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className={`absolute top-8 left-4 right-4 flex justify-between items-center z-50 pointer-events-none transition-opacity duration-200 ${isPaused ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-center gap-2 pointer-events-auto">
          <img src={story.image} className="w-8 h-8 rounded-full border border-white object-cover" />
          <span className="text-white font-bold text-sm shadow-sm">{story.title}</span>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button 
            onClick={handleShare} 
            className="w-8 h-8 flex items-center justify-center text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md pointer-events-auto active:scale-95 transition-colors"
          >
            <Share2 size={16} />
          </button>
          <button 
            onClick={() => onCloseRef.current()} 
            className="w-8 h-8 flex md:hidden items-center justify-center text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md pointer-events-auto active:scale-95 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-zinc-900 relative overflow-hidden flex items-center justify-center">
        {/* Tap areas for prev/next */}
        <div 
          className="absolute inset-y-0 left-0 w-1/3 z-30 cursor-pointer" 
          onPointerDown={handlePointerDown}
          onPointerUp={() => handlePointerUp('prev')}
          onPointerLeave={handlePointerLeave}
        />
        <div 
          className="absolute inset-y-0 right-0 w-2/3 z-30 cursor-pointer" 
          onPointerDown={handlePointerDown}
          onPointerUp={() => handlePointerUp('next')}
          onPointerLeave={handlePointerLeave}
        />

        {/* Foreground zoomed image */}
        <img 
          key={`fg-${currentImage}`}
          src={currentImage} 
          className={`relative z-10 w-full h-full object-cover transition-transform duration-[5000ms] ease-linear ${isPaused ? 'scale-[1.05]' : 'scale-100'}`} 
          onError={() => {
            console.error('Failed to load story image:', currentImage);
          }}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 z-20 pointer-events-none transition-opacity duration-200 ${isPaused ? 'opacity-0' : 'opacity-100'}`} />
        
        {/* Order Now Floating Button */}
        <div className={`absolute bottom-10 left-0 right-0 flex justify-center z-40 pointer-events-none transition-opacity duration-200 ${isPaused ? 'opacity-0' : 'opacity-100'}`}>
          <button 
            className="bg-[#D4AF37] hover:bg-[#FFC461] text-[#1A0B05] px-10 py-3.5 rounded-full font-extrabold text-[15px] shadow-xl pointer-events-auto flex items-center gap-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onCloseRef.current();
              let targetCategory = 'All';
              let openProductId = '';

              if (story.title === 'Newly Introduced') targetCategory = 'Bake House';
              if (story.title === 'Trending') targetCategory = 'Barista';
              if (story.title === 'Offers') targetCategory = 'All';
              
              // Handle Best Sellers specific slides
              if (story.title === 'Best Sellers') {
                targetCategory = 'Milk Teas'; // Default for best sellers
                if (currentImage.includes('bestseller1')) openProductId = 'p-authentic-milk-tea';
                if (currentImage.includes('bestseller2')) openProductId = 'p-taro-milk-tea';
                if (currentImage.includes('bestseller3')) openProductId = 'p-blueberry-milk-tea';
                if (currentImage.includes('bestseller4')) {
                  openProductId = 'p-ferrero-rocher-boba-tea';
                }
              }

              navigate('/menu', { state: { mainCategory: targetCategory, openProductId } });
            }}
          >
            Order Now <span className="text-xl leading-none">&rarr;</span>
          </button>
        </div>
      </div>
    </motion.div>
    <ShareModal
      isOpen={shareModal.isOpen}
      onClose={() => {
        setShareModal(prev => ({ ...prev, isOpen: false }));
        setIsPaused(false); // Resume story when modal closes
      }}
      title={shareModal.title}
      url={shareModal.url}
    />
    </>
  );
}
