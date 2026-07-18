import React, { useState, useEffect } from 'react';
import { PackingChecklist, ChecklistItem } from '../types.js';
import { CheckSquare, Square, Printer, Download, Copy, RotateCcw, Search, CheckCircle, ListTodo } from 'lucide-react';
import { motion } from 'motion/react';

interface PackingChecklistCompProps {
  packingList: PackingChecklist;
  darkMode: boolean;
  destinationName: string;
}

export default function PackingChecklistComp({ packingList, darkMode, destinationName }: PackingChecklistCompProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize checklist items when packingList changes
  useEffect(() => {
    const list: ChecklistItem[] = [];
    const categories: Array<keyof PackingChecklist> = [
      'clothing', 'electronics', 'medicines', 'accessories', 'documents', 'toiletries', 'emergency', 'essentials'
    ];

    categories.forEach((cat) => {
      const itemsInCat = packingList[cat] || [];
      itemsInCat.forEach((name, i) => {
        list.push({
          id: `${cat}-${i}`,
          name,
          category: cat,
          packed: false
        });
      });
    });

    setItems(list);
  }, [packingList]);

  const togglePacked = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const handleResetChecklist = () => {
    setItems(prev => prev.map(item => ({ ...item, packed: false })));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate packed counts and percentages
  const totalItems = items.length;
  const packedItems = items.filter(i => i.packed).length;
  const totalPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  // Print utility targeting just the checklist
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const checklistHtml = items.map(item => `
      <div style="display: flex; align-items: center; padding: 6px 0; border-bottom: 1px solid #eee;">
        <span style="font-size: 16px; margin-right: 12px;">[ ${item.packed ? 'X' : '  '} ]</span>
        <span style="font-family: Arial, sans-serif; font-size: 14px; text-transform: capitalize; color: #555; margin-right: 10px;">(${item.category})</span>
        <span style="font-family: Arial, sans-serif; font-size: 14px;">${item.name}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>TraviQue - Packing Checklist for ${destinationName}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 24px; color: #333; }
            h1 { margin-bottom: 6px; }
            h3 { color: #555; margin-top: 0; font-weight: normal; margin-bottom: 24px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <h1>TraviQue smart Packing Checklist</h1>
          <h3>Target Destination: ${destinationName} • Packed: ${packedItems}/${totalItems} (${totalPercentage}%)</h3>
          <div style="margin-top: 10px;">
            ${checklistHtml}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Download checklist as simple formatted txt file
  const handleDownload = () => {
    const categories: Array<keyof PackingChecklist> = [
      'clothing', 'electronics', 'medicines', 'accessories', 'documents', 'toiletries', 'emergency', 'essentials'
    ];

    let content = `TRAVIQUE SMART PACKING CHECKLIST\nTarget Destination: ${destinationName}\nGenerated: ${new Date().toLocaleDateString()}\nStatus: ${packedItems}/${totalItems} Packed (${totalPercentage}%)\n====================================\n\n`;

    categories.forEach(cat => {
      const catItems = items.filter(i => i.category === cat);
      if (catItems.length > 0) {
        content += `${cat.toUpperCase()}\n--------------------\n`;
        catItems.forEach(item => {
          content += `[${item.packed ? 'X' : ' '}] ${item.name}\n`;
        });
        content += `\n`;
      }
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `travique_${destinationName.toLowerCase().replace(/\s+/g, '_')}_checklist.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy details to clipboard
  const handleCopyClipboard = () => {
    let textToCopy = `TraviQue Packing Checklist for ${destinationName}:\n`;
    items.forEach(item => {
      textToCopy += `[${item.packed ? 'X' : ' '}] (${item.category}) ${item.name}\n`;
    });

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top metrics dashboard bar */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-xl">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm md:text-base">Checklist Packing Density</h4>
            <p className="text-xs text-slate-400">
              Packed <span className="font-bold text-blue-600 dark:text-blue-400">{packedItems}</span> of <span className="font-bold">{totalItems}</span> items
            </p>
          </div>
        </div>

        {/* Packing meter gauge */}
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Completion</span>
            <span className="text-blue-600 dark:text-blue-400">{totalPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${totalPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control filters & search line */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packing items..."
            className={`w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border outline-none transition-all ${
              darkMode 
                ? 'border-slate-800 bg-slate-950 text-white focus:border-blue-500' 
                : 'border-slate-200 bg-white text-slate-800 focus:border-blue-500'
            }`}
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'clothing', 'electronics', 'essentials', 'documents', 'toiletries'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3 rounded-lg text-[11px] font-bold capitalize shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                  : darkMode
                    ? 'bg-slate-900 text-slate-400 border border-slate-850 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Packing list items checklist grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => togglePacked(item.id)}
            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer group transition-all ${
              item.packed 
                ? 'bg-emerald-50/20 border-emerald-500/30' 
                : darkMode 
                  ? 'bg-slate-900/20 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-150 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <button className="text-slate-400 group-hover:scale-105 transition-transform">
                {item.packed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300" />
                )}
              </button>
              <div className="overflow-hidden">
                <span className={`text-xs md:text-sm block truncate font-medium ${
                  item.packed ? 'line-through text-slate-400 dark:text-slate-500 font-normal' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mt-0.5">
                  {item.category}
                </span>
              </div>
            </div>

            {item.packed && (
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-2 text-center py-10 text-slate-400 text-xs font-semibold">
            No packing items found matching filters.
          </div>
        )}
      </div>

      {/* Premium Actions Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-850">
        <button
          onClick={handleResetChecklist}
          className={`py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all hover:scale-95 cursor-pointer ${
            darkMode ? 'bg-slate-900 text-slate-400 hover:bg-slate-850' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset packed state</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyClipboard}
            className={`py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all hover:scale-95 cursor-pointer ${
              darkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-850' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Copied!' : 'Copy Raw'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2 px-3.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center space-x-1.5 transition-all hover:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print List</span>
          </button>

          <button
            onClick={handleDownload}
            className="py-2 px-3.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center space-x-1.5 transition-all hover:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download (.txt)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
