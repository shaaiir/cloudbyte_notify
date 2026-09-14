import React, { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';

export function EditPageModal({ pageData, onSave, onClose }) {
  const [title, setTitle] = useState(pageData.title || '');
  const [subtitle, setSubtitle] = useState(pageData.subtitle || pageData.chapter || '');
  const [description, setDescription] = useState(pageData.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...pageData,
      title,
      subtitle: pageData.subtitle !== undefined ? subtitle : pageData.subtitle,
      chapter: pageData.chapter !== undefined ? subtitle : pageData.chapter,
      description
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md glass-panel p-6 flex flex-col gap-5 relative">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold font-display text-metallic">
              Edit Page 0{pageData.id} Content
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 font-mono">Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-sans"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 font-mono">Chapter / Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 font-mono">Description Summary</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="glass-btn px-4 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-btn px-4 text-xs bg-indigo-600/30 border-indigo-500/40 text-indigo-200"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
