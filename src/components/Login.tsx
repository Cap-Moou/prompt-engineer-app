import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Sparkles, AlertCircle, X, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login({ 
  language, 
  onLanguageToggle 
}: { 
  language: 'ar' | 'en', 
  onLanguageToggle: () => void 
}) {
  const { login, error, clearError } = useAuth();

  const getErrorMessage = (err: string) => {
    if (err.includes('cancelled')) {
      return language === 'ar' ? 'تم إلغاء تسجيل الدخول. حاول مرة أخرى.' : 'Login cancelled. Please try again.';
    }
    return language === 'ar' ? 'حدث خطأ ما، يرجى المحاولة لاحقاً.' : 'An error occurred. Please try again later.';
  };

  return (
    <div className={`min-h-screen bg-black flex items-center justify-center p-6 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Switcher */}
      <div className={`absolute top-6 ${language === 'ar' ? 'left-6' : 'right-6'}`}>
        <button
          onClick={onLanguageToggle}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium text-white"
        >
          <Globe className="w-4 h-4" />
          <span>{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass neon-border p-12 rounded-3xl max-w-md w-full text-center space-y-8"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">
            {language === 'ar' ? 'مُهندس الأوامر' : 'PROMPT ENGINEER'}
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {language === 'ar' 
              ? 'سجل دخولك لحفظ برومبتاتك ومشاريعك في السحابة والوصول إليها من أي مكان.' 
              : 'Sign in to save your prompts and projects to the cloud and access them from anywhere.'}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between gap-3 text-red-400 text-sm"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-start">{getErrorMessage(error)}</p>
              </div>
              <button onClick={clearError} className="p-1 hover:bg-white/5 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02]"
        >
          <LogIn className="w-5 h-5" />
          {language === 'ar' ? 'تسجيل الدخول بجوجل' : 'Sign in with Google'}
        </button>

        <p className="text-gray-600 text-[10px] uppercase tracking-widest">
          Powered by Gemini AI & Firebase
        </p>
      </motion.div>
    </div>
  );
}
