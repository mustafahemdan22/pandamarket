'use client';

import React from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { FiLock, FiLoader, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { language } = useLanguage();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin flex items-center justify-center">
            <FiLoader className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-slate-400 text-sm font-medium">
            {language === 'ar' ? 'جاري التحقق من صلاحيات المسؤول...' : 'Verifying Admin Credentials...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiLock className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {language === 'ar' ? 'تسجيل الدخول مطلوب' : 'Authentication Required'}
          </h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {language === 'ar' 
              ? 'يجب تسجيل الدخول باستخدام حساب مسؤول للوصول إلى لوحة التحكم الخاصة بباندا ماركت.' 
              : 'You must sign in with an authorized administrator account to access the PandaMarket Control Panel.'}
          </p>
          
          <SignInButton mode="modal">
            <button className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <span>{language === 'ar' ? 'تسجيل الدخول كمسؤول' : 'Sign In as Administrator'}</span>
              <FiArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </SignInButton>
        </motion.div>
      </div>
    );
  }

  // Check role: allow if role is 'admin', email matches admin email, or user is authenticated
  const role = (user.publicMetadata?.role || user.unsafeMetadata?.role) as string | undefined;
  const isSuperAdmin = user.primaryEmailAddress?.emailAddress === 'mustafahemdan22@gmail.com';

  if (role && role !== 'admin' && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiAlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {language === 'ar' ? 'الوصول غير مصرح به' : 'Access Denied'}
          </h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {language === 'ar'
              ? 'حسابك لا يمتلك صلاحيات المسؤول المطلوبة لعرض هذه الصفحة.'
              : 'Your account does not possess the administrator role required for this module.'}
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors"
          >
            {language === 'ar' ? 'العودة للمتجر' : 'Return to Storefront'}
          </a>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
