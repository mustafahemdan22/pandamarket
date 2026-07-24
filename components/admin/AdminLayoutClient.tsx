'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { 
  FiGrid, 
  FiPackage, 
  FiFolder, 
  FiShoppingBag, 
  FiTrendingUp, 
  FiUsers, 
  FiImage, 
  FiPieChart, 
  FiShield, 
  FiSettings, 
  FiCpu, 
  FiMenu, 
  FiX, 
  FiGlobe, 
  FiSun, 
  FiMoon, 
  FiChevronRight, 
  FiBell,
  FiSearch,
  FiCheckCircle
} from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageProvider';
import { useTheme } from '@/contexts/ThemeProvider';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      name: language === 'ar' ? 'نظرة عامة' : 'Overview',
      href: '/admin',
      icon: FiGrid,
      exact: true,
    },
    {
      name: language === 'ar' ? 'المنتجات' : 'Products',
      href: '/admin/products',
      icon: FiPackage,
    },
    {
      name: language === 'ar' ? 'الفئات' : 'Categories',
      href: '/admin/categories',
      icon: FiFolder,
    },
    {
      name: language === 'ar' ? 'الطلبات' : 'Orders',
      href: '/admin/orders',
      icon: FiShoppingBag,
    },
    {
      name: language === 'ar' ? 'المخزون' : 'Inventory',
      href: '/admin/inventory',
      icon: FiTrendingUp,
    },
    {
      name: language === 'ar' ? 'العملاء' : 'Customers',
      href: '/admin/customers',
      icon: FiUsers,
    },
    {
      name: language === 'ar' ? 'الوسائط وCloudinary' : 'Media',
      href: '/admin/images',
      icon: FiImage,
    },
    {
      name: language === 'ar' ? 'التحليلات والتقارير' : 'Analytics',
      href: '/admin/analytics',
      icon: FiPieChart,
    },
    {
      name: language === 'ar' ? 'مولد الذكاء الاصطناعي' : 'AI Generation',
      href: '/admin/bulk-ai-generate',
      icon: FiCpu,
    },
    {
      name: language === 'ar' ? 'الأدوار والصلاحيات' : 'Roles & RBAC',
      href: '/admin/roles',
      icon: FiShield,
    },
    {
      name: language === 'ar' ? 'إعدادات النظام' : 'Settings',
      href: '/admin/settings',
      icon: FiSettings,
    },
  ];

  const isCurrentActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 1 && parts[0] === 'admin') {
      return [{ label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', href: '/admin' }];
    }
    const crumbs = [{ label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', href: '/admin' }];
    let currentPath = '/admin';
    for (let i = 1; i < parts.length; i++) {
      currentPath += `/${parts[i]}`;
      const foundItem = navItems.find((item) => item.href === currentPath);
      crumbs.push({
        label: foundItem ? foundItem.name : parts[i].toUpperCase(),
        href: currentPath,
      });
    }
    return crumbs;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
          
          <Link href="/admin" className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-extrabold text-slate-950 text-lg shadow-lg shadow-emerald-500/20">
              🐼
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-white text-lg tracking-tight">PandaMarket</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded ml-2 rtl:mr-2 border border-emerald-500/30">
                ADMIN
              </span>
            </div>
          </Link>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors border border-slate-700"
            title="Switch Language"
          >
            <FiGlobe className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? (
              <FiSun className="w-4 h-4 text-amber-400" />
            ) : (
              <FiMoon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Customer Storefront Link */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'زيارة المتجر' : 'Live Storefront'}</span>
          </Link>

          {/* User Button */}
          <div className="pl-2 border-l border-slate-800 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 ${
            isRTL ? 'right-0' : 'left-0'
          } z-50 w-64 bg-slate-900 border-r border-slate-800 rtl:border-r-0 rtl:border-l flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
          }`}
        >
          {/* Navigation Links */}
          <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            <div className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'ar' ? 'الوظائف الأساسية' : 'Core Modules'}
            </div>
            {navItems.map((item) => {
              const active = isCurrentActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 rtl:space-x-reverse px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Role Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/50">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-xs">
                {user?.firstName ? user.firstName[0].toUpperCase() : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Admin Manager'}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono truncate">
                  Role: Super Admin
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-400">
            {getBreadcrumbs().map((crumb, idx, arr) => (
              <React.Fragment key={crumb.href}>
                <Link
                  href={crumb.href}
                  className={`hover:text-emerald-400 transition-colors ${
                    idx === arr.length - 1 ? 'font-semibold text-emerald-400' : ''
                  }`}
                >
                  {crumb.label}
                </Link>
                {idx < arr.length - 1 && (
                  <FiChevronRight className="w-3.5 h-3.5 text-slate-600 rtl:rotate-180" />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Page Content */}
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
