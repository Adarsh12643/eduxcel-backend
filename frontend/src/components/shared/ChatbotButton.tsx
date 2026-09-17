import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import XcelloChatbot from './XcelloChatbot';

interface ChatbotButtonProps {
  isAIOpen: boolean;
  setIsAIOpen: (isOpen: boolean) => void;
  roleContext: 'student' | 'faculty' | 'admin';
}

const XCELO_GIF = '/xcelo.gif';

export default function ChatbotButton({ isAIOpen, setIsAIOpen, roleContext }: ChatbotButtonProps) {
  const [ribbonDismissed, setRibbonDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    const handleOpen = () => setIsAIOpen(true);
    window.addEventListener('open-xcello', handleOpen);
    return () => window.removeEventListener('open-xcello', handleOpen);
  }, [setIsAIOpen]);

  return (
    <>
      <AnimatePresence>
        {!isAIOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-4 right-4 z-50 flex flex-col items-end"
          >
            {/* Ribbon above the robot */}
            {(!ribbonDismissed || isHovered) && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 18 }}
                className="relative flex flex-col items-end mb-0.5"
              >
                {/* Ribbon box */}
                <div className="flex items-center gap-1.5 bg-white border-2 border-brand-500 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-2xl shadow-lg whitespace-nowrap relative z-10">
                  <span className="text-sm">👋</span>
                  <span>Hi! I am <span className="text-brand-600 font-extrabold">Xcello</span>.</span>
                </div>
                {/* Thought bubbles pointing DOWN-right toward the robot */}
                <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-brand-500 mr-[60px] mt-0.5 z-0 shadow-sm" />
                <div className="w-1.5 h-1.5 rounded-full bg-white border-[1.5px] border-brand-500 mr-[54px] mt-0.5 z-0" />
              </motion.div>
            )}

            {/* Robot GIF — no circle, no clip, natural shape */}
            <motion.button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => { setIsAIOpen(true); setRibbonDismissed(true); }}
              aria-label="Open Xcello AI assistant"
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none drop-shadow-xl"
              style={{ background: 'none' }}
            >
              <img
                src={XCELO_GIF}
                alt="Xcello AI"
                style={{
                  width: 115,
                  height: 115,
                  objectFit: 'contain',
                  display: 'block'
                }}
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = 'none';
                  const parent = el.parentElement;
                  if (parent) {
                    parent.insertAdjacentHTML('beforeend',
                      `<div style="width:115px;height:115px;display:flex;align-items:center;justify-content:center;font-size:56px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.2))">🤖</div>`
                    );
                  }
                }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <XcelloChatbot isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} roleContext={roleContext} />
    </>
  );
}
