/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import PromptEngineer from './components/PromptEngineer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';

function AppContent() {
  const { user, loading } = useAuth();
  
  // Default language for login screen
  const [language, setLanguage] = React.useState<'ar' | 'en'>('ar');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login language={language} onLanguageToggle={() => setLanguage(l => l === 'ar' ? 'en' : 'ar')} />;
  }

  return <PromptEngineer />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
