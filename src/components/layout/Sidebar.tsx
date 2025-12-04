import React, { useState } from 'react';
import {
  Infinity,
  Star,
  Clock,
  Trash2,
  FileText,
  Image,
  AudioLines,
  Video,
  Folder,
  Plus,
  Search,
  Settings,
} from 'lucide-react';
import { usePromptStore, useCollectionStore, useUIStore } from '@/stores';
import { CATEGORIES, QUICK_FILTERS } from '@/constants';
import { mockUser } from '@/data/mockData';
import { cn } from '@/utils';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Infinity,
  Star,
  Clock,
  Trash2,
  FileText,
  Image,
  AudioLines,
  Video,
  Folder,
};

export const Sidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { filter, categoryFilter, collectionFilter, setFilter, setCategory, setCollection, setSearch } = usePromptStore();
  const { collections } = useCollectionStore();
  const { openModal } = useUIStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearch(e.target.value);
  };

  return (
    <aside className="w-[260px] flex-shrink-0 border-r border-slate-800 flex flex-col bg-dark-900">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Infinity className="w-8 h-8 text-indigo-500 mr-2" />
        <span className="font-display text-xl tracking-tight text-white font-bold">
          Prompt Studio
        </span>
      </div>

      {/* Global Search */}
      <div className="p-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-dark-800 border border-slate-700 text-slate-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors text-xs font-medium placeholder-slate-500"
            placeholder="Search prompts (Cmd+K)"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        {/* Quick Access */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Quick Access
          </h3>
          <nav className="space-y-0.5">
            {QUICK_FILTERS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = filter === item.id && !categoryFilter && !collectionFilter;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id as typeof filter)}
                  className={cn(
                    'group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 w-5 h-5 transition-colors',
                      isActive
                        ? 'text-indigo-400'
                        : 'text-slate-500 group-hover:text-white'
                    )}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Categories
          </h3>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.icon];
              const isActive = categoryFilter === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id as typeof categoryFilter)}
                  className={cn(
                    'group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon className={cn('mr-3 w-5 h-5', cat.color)} />
                  {cat.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Collections */}
        <div>
          <div className="flex justify-between items-center px-3 mb-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Collections
            </h3>
            <button
              onClick={() => openModal('createCollection')}
              className="text-slate-600 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <nav className="space-y-0.5">
            {collections.map((col) => {
              const isActive = collectionFilter === col.id;
              
              return (
                <button
                  key={col.id}
                  onClick={() => setCollection(col.id)}
                  className={cn(
                    'group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <div className="flex items-center">
                    <Folder className={cn('mr-3 w-5 h-5', col.color)} />
                    {col.name}
                  </div>
                  <span className="text-xs text-slate-600 group-hover:text-slate-400">
                    {col.promptCount}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User/Settings */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => openModal('settings')}
          className="flex items-center gap-3 w-full hover:bg-slate-800/50 p-2 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            {mockUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-white truncate">{mockUser.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{mockUser.plan} Plan</p>
          </div>
          <Settings className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </aside>
  );
};
