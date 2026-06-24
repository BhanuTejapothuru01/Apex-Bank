import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, File, Search, Plus, Trash2, Calendar, HardDrive, Sparkles, AlertCircle } from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentsViewProps {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
}

export default function DocumentsView({ documents, setDocuments }: DocumentsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Contracts' | 'NDAs' | 'KYC Docs' | 'Financial Audits'>('All');
  const [search, setSearch] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Folder types helper list
  const folders: Array<{ name: typeof selectedCategory; count: number; color: string }> = [
    { name: 'All', count: documents.length, color: 'bg-pink-500' },
    { name: 'Contracts', count: documents.filter(d => d.category === 'Contracts').length, color: 'bg-violet-500' },
    { name: 'NDAs', count: documents.filter(d => d.category === 'NDAs').length, color: 'bg-indigo-500' },
    { name: 'KYC Docs', count: documents.filter(d => d.category === 'KYC Docs').length, color: 'bg-emerald-500' },
    { name: 'Financial Audits', count: documents.filter(d => d.category === 'Financial Audits').length, color: 'bg-rose-500' }
  ];

  const handleSelectFolder = (cat: typeof selectedCategory) => {
    setSelectedCategory(cat);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                          doc.uploadedBy.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDeleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    alert('Document reference discarded from local database ledger!');
  };

  // Drag and drop mock trigger
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Create new mockup item
    const mockFile: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: 'uploaded_attachment_audit.pdf',
      category: selectedCategory === 'All' ? 'Contracts' : selectedCategory,
      size: '1.2 MB',
      uploadedBy: 'Andrew Forbist',
      uploadDate: new Date().toISOString().split('T')[0],
      extension: 'pdf'
    };

    setDocuments(prev => [mockFile, ...prev]);
    alert('SECURE COMPLIANCE INGESTION: File uploaded and encrypted under Apex Standards!');
  };

  const handleFileSelect = () => {
    const mockFile: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: 'executive_balance_verification.xlsx',
      category: selectedCategory === 'All' ? 'KYC Docs' : selectedCategory,
      size: '720 KB',
      uploadedBy: 'Andrew Forbist',
      uploadDate: new Date().toISOString().split('T')[0],
      extension: 'xlsx'
    };

    setDocuments(prev => [mockFile, ...prev]);
    alert('Ingestion completed: Registered xlsx sheet securely.');
  };

  return (
    <div id="documents-view-root" className="space-y-6">
      
      {/* Search Input and Storage Space panel */}
      <div className="bg-white rounded-3xl p-5 border border-pink-500/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search documents by name or compliance auditor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-sans border border-pink-200 outline-none rounded-xl focus:ring-2 focus:ring-pink-500/20 bg-pink-50/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Apex Storage Space</p>
            <p className="text-xs font-sans font-bold text-[#24142F]">28.6 MB / 100 MB USED</p>
          </div>
          <div className="w-12 h-1.5 bg-pink-50 rounded-full overflow-hidden shrink-0 border border-pink-100">
            <div className="bg-pink-500 h-full w-[28%] rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left pane: Directory folders Selection column */}
        <div className="lg:col-span-3 space-y-3">
          {folders.map((folderItem) => (
            <button
              key={folderItem.name}
              onClick={() => handleSelectFolder(folderItem.name)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between active:scale-[0.98] ${
                selectedCategory === folderItem.name
                  ? 'border-pink-500 bg-pink-100/50 shadow-sm'
                  : 'border-pink-500/10 hover:bg-[#FAF4F8] bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl text-white ${folderItem.color}`}>
                  <Folder className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-900 font-sans">{folderItem.name}</span>
              </div>
              <span className="text-[10px] font-mono font-medium bg-gray-100 px-2 py-0.5 rounded-md text-gray-500">
                {folderItem.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right pane: Document Explorer view and Dropzone uploader */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Mock Ingestion dropping area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileSelect}
            className={`cursor-pointer border-2 border-dashed rounded-3xl p-7 text-center transition-all ${
              isDragging
                ? 'border-pink-500 bg-pink-500/5 scale-[1.01]'
                : 'border-pink-200 hover:border-pink-500/50 bg-white hover:bg-pink-50/10'
            }`}
          >
            <div className="mx-auto w-12 h-12 bg-pink-500/10 text-pink-500 flex items-center justify-center rounded-2xl mb-2.5">
              <Plus className="w-6 h-6 shrink-0" />
            </div>
            <h4 className="text-sm font-bold font-sans text-gray-900">Upload Corporate attachment</h4>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              Drag & drop document here, or click to simulation inject audits. Maximum upload capacity 50MB.
            </p>
          </div>

          {/* List of files with dynamic badges */}
          <div className="bg-white rounded-3xl border border-pink-500/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-pink-50/50 border-b border-pink-100 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Document Name</th>
                    <th className="py-3 px-5">Category Folder</th>
                    <th className="py-3 px-5">Size</th>
                    <th className="py-3 px-5">Registered By</th>
                    <th className="py-3 px-5">Upload Date</th>
                    <th className="py-3 px-5 text-right">Delete Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-500/5 text-xs">
                  <AnimatePresence initial={false}>
                    {filteredDocs.map((doc) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-pink-50/30 transition-colors text-gray-700"
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4 text-pink-500 shrink-0" />
                            <span className="font-sans font-medium text-[#24142F]">{doc.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 select-none">
                          <span className="font-mono text-[9px] font-semibold border bg-pink-50 px-2 py-0.5 border-pink-100 uppercase rounded-md text-pink-700">
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-mono text-gray-500">
                          {doc.size}
                        </td>
                        <td className="py-3.5 px-5 font-sans font-medium">
                          {doc.uploadedBy}
                        </td>
                        <td className="py-3.5 px-5 font-mono text-gray-500">
                          {doc.uploadDate}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg shrink-0 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  
                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 font-sans">
                        No active documents categorized inside this folder.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
