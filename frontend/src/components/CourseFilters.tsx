'use client';

import { useState } from 'react';
import { CourseFilters as Filters } from '@/types/course';
import { Search, Filter, RotateCcw, ChevronDown } from 'lucide-react';

interface CourseFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

export default function CourseFilters({ onFilterChange }: CourseFiltersProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      search: search || undefined,
      category: category || undefined,
      difficulty: difficulty || undefined,
      education_level: educationLevel || undefined
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setEducationLevel('');
    onFilterChange({});
  };

  const activeFiltersCount = [category, difficulty, educationLevel].filter(Boolean).length;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-glow-primary border border-white/40 mb-8 relative overflow-hidden group">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/30 to-secondary-100/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary-50/50 to-orange-100/30 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          {/* Search - Always visible & prominent */}
          <div className="lg:col-span-12">
            <div className="relative group/search">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within/search:text-primary transition-colors duration-300" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="block w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-primary/50 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Cari kursus yang ingin kamu pelajari..."
              />
              <button
                onClick={handleApplyFilters}
                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-primary to-primary-600 text-white px-6 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Filter Toggle for Mobile/Compact View */}
          <div className="lg:col-span-12 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isExpanded ? 'bg-primary-50 text-primary' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                <Filter className="w-4 h-4" />
                Filter Lanjutan
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Expandable Filters */}
          <div className={`lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Kategori
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <option value="">Semua Kategori</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Fisika">Fisika</option>
                  <option value="Kimia">Kimia</option>
                  <option value="Biologi">Biologi</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Sejarah">Sejarah</option>
                  <option value="Geografi">Geografi</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Programming">Programming</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Tingkat Kesulitan
              </label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <option value="">Semua Level</option>
                  <option value="beginner">Pemula</option>
                  <option value="intermediate">Menengah</option>
                  <option value="advanced">Mahir</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Jenjang
              </label>
              <div className="relative">
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <option value="">Semua Jenjang</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="Kuliah">Kuliah</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end mt-2">
              <button
                onClick={handleApplyFilters}
                className="text-sm font-semibold text-primary hover:text-primary-700 transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
