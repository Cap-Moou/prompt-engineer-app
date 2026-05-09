import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Sparkles, ChevronDown, Undo2, Redo2, Save, FolderOpen, X, Trash2, Download, Upload, Globe, Zap, Bookmark, LogOut } from 'lucide-react';
import { CATEGORIES, IMAGE_MODELS, VIDEO_MODELS } from '../constants';
import { CategoryKey, PromptConfig } from '../types';
import { generateCinematicPrompt, enhanceCoreIdea, generatePromptFromIdea } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';

type Language = 'ar' | 'en';

const translations = {
  ar: {
    appName: "مُهندس الأوامر",
    appDesc: "حول رؤيتك الإبداعية إلى أوامر سينمائية احترافية بدقة مذهلة",
    undo: "تراجع",
    redo: "إعادة",
    saveConfig: "حفظ التكوين",
    myProjects: "مشاريعي",
    coreIdea: "الفكرة الأساسية",
    coreIdeaPlaceholder: "اكتب فكرة المشهد أو السيناريو بالتفصيل...",
    background: "خلفية المشهد",
    backgroundPlaceholder: "صف تفاصيل الخلفية والمكان المحيط...",
    characters: "وصف الشخصيات",
    charactersPlaceholder: "الملامح، الثياب، الحالة النفسية...",
    dialogue: "الحوار",
    dialoguePlaceholder: "اكتب الجملة أو الحوار لمنطق الشفاه...",
    tashkeelLabel: "تشكيل نص الحوار:",
    withoutTashkeel: "بدون تشكيل",
    withTashkeel: "تشكيل",
    chooseModel: "إختر الموديل",
    imageModels: "موديلات توليد الصور",
    videoModels: "موديلات توليد الفيديو",
    selectModelOption: "اختر الموديل...",
    generateLoading: "جاري المعالجة...",
    generatePrompt: "توليد البرومبت",
    finalPrompt: "البرومبت السينمائي النهائي:",
    copied: "تم النسخ!",
    copyPrompt: "نسخ البرومبت",
    share: "مشاركة",
    export: "تصدير",
    import: "استيراد",
    saveProjectTitle: "حفظ المشروع الحالي",
    saveProjectDesc: "أدخل اسماً فريداً لحفظ التكوين الحالي حتى تتمكن من العودة إليه لاحقاً.",
    saveProjectExample: "مثال: مشهد طاقم الفضاء...",
    saveProjectBtn: "حفظ المشروع",
    savePrompt: "حفظ البرومبت",
    promptLibrary: "مكتبة الأوامر",
    noSavedPrompts: "لا توجد أوامر محفوظة",
    promptSavedSuccess: "تم حفظ البرومبت في المكتبة",
    savedProjectsTitle: "المشاريع المحفوظة",
    noSavedProjects: "لا توجد مشاريع محفوظة حالياً",
    load: "تحميل",
    deleteMsg: "حذف",
    selectOption: "اختر...",
    alertExportError: "لا توجد مشاريع لتصديرها.",
    alertImportSuccess: "تم استيراد المشاريع بنجاح!",
    alertImportError1: "ملف غير صالح أو لا يحتوي على بنية المشاريع الصحيحة.",
    alertImportError2: "حدث خطأ أثناء قراءة الملف. يرجى التأكد من أنه بصيغة JSON صحيحة.",
    alertGenError: "حدث خطأ أثناء توليد البرومبت. تأكد من إعدادات API.",
    alertShareError: "حدث خطأ في المشاركة. تم النسخ للحافظة بدلاً من ذلك.",
    alertShareFallback: "تم النسخ للحافظة (المشاركة غير مدعومة في متصفحك)",
    langToggle: "English",
    enhanceIdea: "تحسين",
    enhancing: "جاري التحسين...",
    genDirectWithDiag: "توليد مباشر (بـ حوار)",
    genDirectNoDiag: "توليد مباشر (بدون حوار)"
  },
  en: {
    appName: "Prompt Engineer",
    appDesc: "Transform your creative vision into professional cinematic prompts.",
    undo: "Undo",
    redo: "Redo",
    saveConfig: "Save Config",
    myProjects: "My Projects",
    coreIdea: "Core Idea",
    coreIdeaPlaceholder: "Write your scene idea or scenario in detail...",
    background: "Scene Background",
    backgroundPlaceholder: "Describe the background and surrounding details...",
    characters: "Characters Description",
    charactersPlaceholder: "Features, clothing, psychological state...",
    dialogue: "Dialogue",
    dialoguePlaceholder: "Write the sentence or dialogue for lip-sync...",
    tashkeelLabel: "Dialogue Tashkeel:",
    withoutTashkeel: "Without Tashkeel",
    withTashkeel: "With Tashkeel",
    chooseModel: "Choose AI Model",
    imageModels: "Image Generation Models",
    videoModels: "Video Generation Models",
    selectModelOption: "Choose Model...",
    generateLoading: "Processing...",
    generatePrompt: "Generate Prompt",
    finalPrompt: "Final Cinematic Prompt:",
    copied: "Copied!",
    copyPrompt: "Copy Prompt",
    share: "Share",
    export: "Export",
    import: "Import",
    saveProjectTitle: "Save Current Project",
    saveProjectDesc: "Enter a unique name to save the current configuration so you can return to it later.",
    saveProjectExample: "Example: Space crew scene...",
    saveProjectBtn: "Save Project",
    savePrompt: "Save Prompt",
    promptLibrary: "Prompt Library",
    noSavedPrompts: "No saved prompts",
    promptSavedSuccess: "Prompt saved to library",
    savedProjectsTitle: "Saved Projects",
    noSavedProjects: "No saved projects currently",
    load: "Load",
    deleteMsg: "Delete",
    selectOption: "Select...",
    alertExportError: "No projects to export.",
    alertImportSuccess: "Projects imported successfully!",
    alertImportError1: "Invalid file or structure.",
    alertImportError2: "Error reading file. Ensure it's valid JSON.",
    alertGenError: "Error generating prompt. Check API settings.",
    alertShareError: "Sharing failed. Copied to clipboard instead.",
    alertShareFallback: "Copied to clipboard (sharing not supported in browser)",
    langToggle: "عربي",
    enhanceIdea: "Enhance",
    enhancing: "Enhancing...",
    genDirectWithDiag: "Direct Generate (With Dialogue)",
    genDirectNoDiag: "Direct Generate (No Dialogue)"
  }
};

interface SavedProject {
  id: string;
  name: string;
  config: PromptConfig;
  timestamp: number;
}

interface SavedResult {
  id: string;
  prompt: string;
  title: string;
  timestamp: number;
}

export default function PromptEngineer() {
  const { user, logout } = useAuth();
  const [config, setConfig] = useState<PromptConfig>({
    scenario: '',
    background: '',
    characters: '',
    dialogue: '',
    videoStyle: '',
    environment: '',
    cameraMotion: '',
    lighting: '',
    visualVfx: '',
    soundSfx: '',
    dialect: '',
    aiModel: '',
    applyTashkeel: false
  });

  // History state for Undo/Redo (Stores up to 15 actions)
  const [pastConfigs, setPastConfigs] = useState<PromptConfig[]>([]);
  const [futureConfigs, setFutureConfigs] = useState<PromptConfig[]>([]);
  const textConfigRef = useRef<PromptConfig | null>(null);

  // Projects state
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<Language>('ar');

  const isImageModel = IMAGE_MODELS.includes(config.aiModel);

  const t = translations[language];

  // Load saved data from Firestore
  useEffect(() => {
    if (!user) return;

    const projectsPath = `users/${user.uid}/projects`;
    const libraryPath = `users/${user.uid}/library`;

    const qProjects = query(collection(db, projectsPath), orderBy('timestamp', 'desc'));
    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      const projects = snapshot.docs.map(doc => doc.data() as SavedProject);
      setSavedProjects(projects);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, projectsPath);
    });

    const qResults = query(collection(db, libraryPath), orderBy('timestamp', 'desc'));
    const unsubscribeResults = onSnapshot(qResults, (snapshot) => {
      const results = snapshot.docs.map(doc => doc.data() as SavedResult);
      setSavedResults(results);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, libraryPath);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeResults();
    };
  }, [user]);

  const saveProjectData = async (project: SavedProject) => {
    if (!user) return;
    const path = `users/${user.uid}/projects/${project.id}`;
    try {
      await setDoc(doc(db, path), project);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const saveResultsData = async (result: SavedResult) => {
    if (!user) return;
    const path = `users/${user.uid}/library/${result.id}`;
    try {
      await setDoc(doc(db, path), result);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // --- Undo / Redo Logic ---
  const handleUndo = () => {
    if (pastConfigs.length === 0) return;
    const previous = pastConfigs[pastConfigs.length - 1];
    const newPast = pastConfigs.slice(0, pastConfigs.length - 1);
    setFutureConfigs([config, ...futureConfigs]);
    setPastConfigs(newPast);
    setConfig(previous);
  };

  const handleRedo = () => {
    if (futureConfigs.length === 0) return;
    const next = futureConfigs[0];
    const newFuture = futureConfigs.slice(1);
    setPastConfigs([...pastConfigs, config]);
    setFutureConfigs(newFuture);
    setConfig(next);
  };

  // --- Action Handlers ---
  const handleGenDirectWithDiag = async () => {
    if (!config.scenario.trim()) {
      alert(language === 'ar' ? 'يرجى كتابة الفكرة الأساسية' : 'Please write the Core Idea');
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = await generatePromptFromIdea(config.scenario, true, language, config.aiModel, config.dialect);
      setGeneratedPrompt(prompt);
      setTimeout(() => {
        document.getElementById('prompt-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      alert(t.alertGenError);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenDirectNoDiag = async () => {
    if (!config.scenario.trim()) {
      alert(language === 'ar' ? 'يرجى كتابة الفكرة الأساسية' : 'Please write the Core Idea');
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = await generatePromptFromIdea(config.scenario, false, language, config.aiModel, config.dialect);
      setGeneratedPrompt(prompt);
      setTimeout(() => {
        document.getElementById('prompt-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      alert(t.alertGenError);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceIdea = async () => {
    if (!config.scenario.trim()) return;
    setIsEnhancing(true);
    try {
      const enhancedText = await enhanceCoreIdea(config.scenario, language);
      setPastConfigs(prev => [...prev.slice(-14), config]);
      setFutureConfigs([]);
      setConfig(prev => ({ ...prev, scenario: enhancedText }));
    } catch (error) {
      alert(t.alertGenError);
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  };
  const handleSelectChange = (key: CategoryKey, value: string) => {
    setPastConfigs(prev => [...prev.slice(-14), config]);
    setFutureConfigs([]);
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleTextFocus = () => {
    textConfigRef.current = config;
  };

  const handleTextBlur = () => {
    if (textConfigRef.current && JSON.stringify(textConfigRef.current) !== JSON.stringify(config)) {
      setPastConfigs(prev => [...prev.slice(-14), textConfigRef.current!]);
      setFutureConfigs([]);
    }
    textConfigRef.current = null;
  };

  // --- Project Management ---
  const handleAddProject = async () => {
    if (!newProjectName.trim() || !user) return;
    const newProj: SavedProject = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      config,
      timestamp: Date.now(),
      userId: user.uid // Ensure userId is added
    } as any; 
    
    await saveProjectData(newProj);
    setNewProjectName('');
    setShowSaveModal(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/projects/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleLoadProject = (project: SavedProject) => {
    setPastConfigs(prev => [...prev.slice(-14), config]);
    setFutureConfigs([]);
    setConfig(project.config);
    setShowLoadModal(false);
  };

  // --- Import / Export ---
  const handleExportProjects = () => {
    if (savedProjects.length === 0) {
      alert(t.alertExportError);
      return;
    }
    const dataStr = JSON.stringify(savedProjects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-engineer-projects-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedContent = event.target?.result as string;
        const parsed = JSON.parse(importedContent);
        
        if (Array.isArray(parsed) && parsed.every(p => p.id && p.name && p.config)) {
          const batch = writeBatch(db);
          parsed.forEach(proj => {
            const projectToSave = { ...proj, userId: user.uid };
            batch.set(doc(db, `users/${user.uid}/projects/${proj.id}`), projectToSave);
          });
          await batch.commit();
          alert(t.alertImportSuccess);
        } else {
          alert(t.alertImportError1);
        }
      } catch (err) {
        console.error(err);
        alert(t.alertImportError2);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- External Interactions ---
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedPrompt('');
    try {
      const prompt = await generateCinematicPrompt(config);
      setGeneratedPrompt(prompt);
    } catch (error) {
      alert(t.alertGenError);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!generatedPrompt) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cinematic Prompt',
          text: generatedPrompt
        });
      } catch (err) {
        console.error('Error sharing:', err);
        handleCopy();
        alert(t.alertShareError);
      }
    } else {
      handleCopy();
      alert(t.alertShareFallback);
    }
  };

  const handleSaveResult = async () => {
    if (!generatedPrompt || !user) return;
    const newResult: SavedResult = {
      id: Date.now().toString(),
      prompt: generatedPrompt,
      title: config.scenario.substring(0, 30) || 'Untitled Prompt',
      timestamp: Date.now(),
      userId: user.uid // Ensure userId is added
    } as any;
    await saveResultsData(newResult);
    alert(t.promptSavedSuccess);
  };

  const handleDeleteResult = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/library/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const categoryKeys: CategoryKey[] = isImageModel 
    ? ['videoStyle', 'environment', 'cameraMotion', 'lighting', 'visualVfx']
    : ['videoStyle', 'environment', 'cameraMotion', 'lighting', 'visualVfx', 'soundSfx'];

  return (
    <div className={`min-h-screen bg-black text-white p-6 pb-24 md:p-12 font-sans selection:bg-cyan-500/30 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto space-y-12 relative">
        {/* Language Switcher & User Profile */}
        <div className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 flex items-center gap-2`}>
          {user && (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
              {user.photoURL && (
                <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full border border-white/20" referrerPolicy="no-referrer" />
              )}
              <span className="text-xs font-medium text-gray-300 hidden sm:inline">{user.displayName}</span>
              <button
                onClick={logout}
                className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                title={language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={() => setLanguage(lang => lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            {t.langToggle}
          </button>
        </div>

        {/* Header */}
        <header className="text-center space-y-4 pt-10 md:pt-0">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500 leading-normal py-3 px-2">
            {t.appName}
          </h1>
          <p className="text-gray-400 text-lg">{t.appDesc}</p>
        </header>

        {/* Input Form */}
        <div className="glass neon-border rounded-3xl p-6 md:p-8 space-y-8">
          
          {/* Action Bar (Undo/Redo & Save/Load) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={pastConfigs.length === 0}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                title={t.undo}
              >
                <Undo2 className={`w-5 h-5 ${language === 'ar' ? 'rtl:-scale-x-100' : ''}`} />
              </button>
              <button
                onClick={handleRedo}
                disabled={futureConfigs.length === 0}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                title={t.redo}
              >
                <Redo2 className={`w-5 h-5 ${language === 'ar' ? 'rtl:-scale-x-100' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLibraryModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 rounded-lg transition-colors text-sm font-medium"
              >
                <Bookmark className="w-4 h-4" />
                {t.promptLibrary}
              </button>
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                {t.saveConfig}
              </button>
              <button
                onClick={() => setShowLoadModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg transition-colors text-sm font-medium"
              >
                <FolderOpen className="w-4 h-4" />
                {t.myProjects}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xl font-semibold text-cyan-50">{t.coreIdea}</label>
              <textarea
                value={config.scenario}
                onChange={(e) => setConfig({ ...config, scenario: e.target.value })}
                onFocus={handleTextFocus}
                onBlur={handleTextBlur}
                placeholder={t.coreIdeaPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors h-32 resize-y"
              />
              <div className="flex flex-wrap justify-end mt-2 gap-2">
                {!isImageModel && (
                  <>
                    <button
                      onClick={handleGenDirectWithDiag}
                      disabled={isGenerating || !config.scenario.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-4 h-4" />
                      {t.genDirectWithDiag}
                    </button>
                    <button
                      onClick={handleGenDirectNoDiag}
                      disabled={isGenerating || !config.scenario.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-4 h-4" />
                      {t.genDirectNoDiag}
                    </button>
                  </>
                )}
                {isImageModel && (
                   <button
                   onClick={handleGenDirectNoDiag}
                   disabled={isGenerating || !config.scenario.trim()}
                   className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <Zap className="w-4 h-4" />
                   {language === 'ar' ? 'توليد سريع' : 'Quick Generate'}
                 </button>
                )}
                <button
                  onClick={handleEnhanceIdea}
                  disabled={isEnhancing || !config.scenario.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  {isEnhancing ? t.enhancing : t.enhanceIdea}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xl font-semibold text-cyan-50">{t.background}</label>
              <textarea
                value={config.background}
                onChange={(e) => setConfig({ ...config, background: e.target.value })}
                onFocus={handleTextFocus}
                onBlur={handleTextBlur}
                placeholder={t.backgroundPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors h-24 resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xl font-semibold text-cyan-50">{t.characters}</label>
              <textarea
                value={config.characters}
                onChange={(e) => setConfig({ ...config, characters: e.target.value })}
                onFocus={handleTextFocus}
                onBlur={handleTextBlur}
                placeholder={t.charactersPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors h-24 resize-y"
              />
            </div>

            {!isImageModel && (
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mt-4 flex flex-col gap-4">
                <div className={`grid grid-cols-1 ${language === 'ar' ? 'md:grid-cols-2' : ''} gap-6`}>
                  {language === 'ar' && (
                    <div className="space-y-2 relative group">
                      <label className="block text-xl font-semibold text-cyan-50">
                        {CATEGORIES['dialect'].titleAr}
                      </label>
                      <div className="relative mt-2">
                        <select
                          value={config.dialect}
                          onChange={(e) => handleSelectChange('dialect', e.target.value)}
                          className="w-full appearance-none bg-black/40 border border-white/10 rounded-xl py-3 px-4 pr-10 pl-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
                        >
                          <option value="" className="bg-gray-900 text-gray-400">{t.selectOption}</option>
                          {CATEGORIES['dialect'].options.map(option => (
                            <option key={option.ar} value={option.ar} className="bg-gray-900 text-white">
                              {language === 'en' ? option.en : option.ar}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-xl font-semibold text-cyan-50">{t.dialogue}</label>
                    <textarea
                      value={config.dialogue}
                      onChange={(e) => setConfig({ ...config, dialogue: e.target.value })}
                      onFocus={handleTextFocus}
                      onBlur={handleTextBlur}
                      placeholder={t.dialoguePlaceholder}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors h-20 resize-y mt-2"
                    />
                  </div>
                </div>
                
                {language === 'ar' && (
                  <div className="flex items-center gap-4 justify-start border-t border-white/10 pt-4 mt-2 mb-2">
                    <label className="text-sm font-medium text-gray-300">{t.tashkeelLabel}</label>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => {
                          setPastConfigs(prev => [...prev.slice(-14), config]);
                          setFutureConfigs([]);
                          setConfig({ ...config, applyTashkeel: false });
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          !config.applyTashkeel 
                            ? 'bg-cyan-500/20 text-cyan-50 border border-cyan-500/30' 
                            : 'text-gray-400 hover:text-white border border-transparent'
                        }`}
                      >
                        {t.withoutTashkeel}
                      </button>
                      <button
                        onClick={() => {
                          setPastConfigs(prev => [...prev.slice(-14), config]);
                          setFutureConfigs([]);
                          setConfig({ ...config, applyTashkeel: true });
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          config.applyTashkeel 
                            ? 'bg-cyan-500/20 text-cyan-50 border border-cyan-500/30' 
                            : 'text-gray-400 hover:text-white border border-transparent'
                        }`}
                      >
                        {t.withTashkeel}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryKeys.map((key) => (
              <div key={key} className="space-y-2 relative group">
                <label className="block text-sm font-medium text-gray-300">
                  {language === 'en' ? CATEGORIES[key].titleEn : CATEGORIES[key].titleAr}
                </label>
                <div className="relative">
                  <select
                    value={config[key]}
                    onChange={(e) => handleSelectChange(key, e.target.value)}
                    className={`w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3 px-4 ${language === 'ar' ? 'pr-10 pl-4' : 'pl-4 pr-10'} text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer`}
                  >
                    <option value="" className="bg-gray-900 text-gray-400">{t.selectOption}</option>
                    {CATEGORIES[key].options.map(option => (
                      <option key={option.ar} value={option.ar} className="bg-gray-900 text-white">
                        {language === 'en' ? option.en : option.ar}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5`} />
                </div>
              </div>
            ))}
          </div>

          {/* Model Selection and Generate Area */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-6 mt-6 border-t border-white/10">
            <div className="w-full md:w-1/3 relative space-y-2">
              <label className="block text-xl font-semibold text-cyan-50">{t.chooseModel}</label>
              <div className="relative">
                <select
                  value={config.aiModel}
                  onChange={(e) => {
                    setPastConfigs(prev => [...prev.slice(-14), config]);
                    setFutureConfigs([]);
                    setConfig(prev => ({ ...prev, aiModel: e.target.value }));
                  }}
                  className={`w-full appearance-none bg-black/60 border border-fuchsia-500/30 rounded-xl py-4 px-4 ${language === 'ar' ? 'pr-10 pl-4' : 'pl-4 pr-10'} text-white focus:outline-none focus:border-fuchsia-500 transition-colors cursor-pointer`}
                >
                  <option value="" className="bg-gray-900 text-gray-400">{t.selectModelOption}</option>
                  
                  <optgroup label={t.imageModels} className="bg-gray-900 border-none text-fuchsia-400 font-bold italic">
                    {IMAGE_MODELS.map(model => (
                      <option key={model} value={model} className="bg-gray-900 text-white not-italic font-normal">
                        {model}
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label={t.videoModels} className="bg-gray-900 border-none text-cyan-400 font-bold italic">
                    {VIDEO_MODELS.map(model => (
                      <option key={model} value={model} className="bg-gray-900 text-white not-italic font-normal">
                        {model}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-fuchsia-400 pointer-events-none w-6 h-6`} />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!config.scenario && !config.characters) || !config.aiModel}
              className="neon-button neon-border relative group overflow-hidden rounded-2xl px-12 py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto text-xl font-bold transition-transform hover:scale-105 active:scale-95 flex-1"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <Sparkles className="w-6 h-6 text-fuchsia-400" />
                  </motion.div>
                  {t.generateLoading}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-cyan-50">
                  <Sparkles className="w-6 h-6 text-cyan-400 group-hover:text-fuchsia-400 transition-colors" />
                  {t.generatePrompt}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <AnimatePresence>
          {generatedPrompt && (
            <motion.div
              id="prompt-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass neon-border rounded-3xl p-6 md:p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {t.finalPrompt}
              </h2>
              
              <div className="relative">
                <div 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-emerald-50 text-lg leading-relaxed font-serif backdrop-blur-md"
                  dir="ltr"
                >
                  {generatedPrompt}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? t.copied : t.copyPrompt}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  {t.share}
                </button>
                <button
                  onClick={handleSaveResult}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full transition-all text-sm font-medium"
                >
                  <Bookmark className="w-4 h-4" />
                  {t.savePrompt}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Modals --- */}
      
      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass neon-border rounded-3xl p-8 w-full max-w-md space-y-6 bg-gray-950/90"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{t.saveProjectTitle}</h3>
                <button onClick={() => setShowSaveModal(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-400 text-sm">{t.saveProjectDesc}</p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder={t.saveProjectExample}
                  className={`w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  autoFocus
                />
                
                <button
                  onClick={handleAddProject}
                  disabled={!newProjectName.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {t.saveProjectBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Load Modal */}
      <AnimatePresence>
        {showLoadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass neon-border rounded-3xl p-8 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col space-y-6 bg-gray-950/90"
            >
              <div className="flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold text-white">{t.savedProjectsTitle}</h3>
                <button onClick={() => setShowLoadModal(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Import/Export ActionBar */}
              <div className="flex gap-3 pb-2 border-b border-white/10 shrink-0">
                <button
                  onClick={handleExportProjects}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  {t.export}
                </button>
                <button
                  onClick={handleImportClick}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  {t.import}
                </button>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {savedProjects.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-black/30 rounded-xl border border-white/5">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>{t.noSavedProjects}</p>
                  </div>
                ) : (
                  savedProjects.map(proj => (
                    <div key={proj.id} className="flex justify-between items-center p-4 bg-black/40 border border-white/10 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="max-w-[70%]">
                        <h4 className="font-bold text-white truncate text-left" dir={language === 'ar' ? 'rtl' : 'ltr'}>{proj.name}</h4>
                        <span className="text-xs text-gray-500 flex mt-1">
                          {new Date(proj.timestamp).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLoadProject(proj)}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm font-bold transition-colors"
                        >
                          {t.load}
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title={t.deleteMsg}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Library Modal */}
      <AnimatePresence>
        {showLibraryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass neon-border rounded-3xl p-8 w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col space-y-6 bg-gray-950/90"
            >
              <div className="flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <Bookmark className="w-6 h-6 text-fuchsia-400" />
                  {t.promptLibrary}
                </h3>
                <button onClick={() => setShowLibraryModal(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {savedResults.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <Bookmark className="w-16 h-16 text-gray-800 mx-auto opacity-20" />
                    <p className="text-gray-500 text-lg font-medium">{t.noSavedPrompts}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {savedResults.map((result) => (
                      <div key={result.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-fuchsia-500/30 transition-all group relative">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-fuchsia-100 font-bold text-lg mb-1 line-clamp-1">{result.title}</h4>
                            <span className="text-gray-500 text-xs">
                              {new Date(result.timestamp).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                            </span>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(result.prompt);
                                alert(t.copied);
                              }}
                              className="p-2 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 rounded-lg transition-colors"
                              title={t.copyPrompt}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteResult(result.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                              title={t.deleteMsg}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-gray-300 text-sm font-serif line-clamp-4 leading-relaxed italic">
                          {result.prompt}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
