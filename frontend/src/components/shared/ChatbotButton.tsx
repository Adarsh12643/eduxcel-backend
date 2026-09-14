import React from 'react';
import { BrainCircuit } from 'lucide-react';
import XceloChatbot from './XceloChatbot';

interface ChatbotButtonProps {
  isAIOpen: boolean;
  setIsAIOpen: (isOpen: boolean) => void;
  roleContext: 'student' | 'faculty' | 'admin';
}

export default function ChatbotButton({ isAIOpen, setIsAIOpen, roleContext }: ChatbotButtonProps) {
  return (
    <>
      {!isAIOpen && (
        <button
          onClick={() => setIsAIOpen(true)}
          aria-label="Open Xcelo AI assistant"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-slate-900 dark:bg-brand-600 text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        >
          <BrainCircuit className="w-7 h-7" />
        </button>
      )}
      <XceloChatbot isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} roleContext={roleContext} />
    </>
  );
}
