import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Heart, Star, Trash2, Calendar, MapPin, Sparkles, Plus, 
  Upload, Image as ImageIcon, BookOpen, Quote, Share2, Eye, ShieldAlert, Badge
} from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  location: string;
  date: string;
  rating: number;
  description: string;
  category: 'Sightseeing' | 'Food' | 'Adventure' | 'Accommodation' | 'Culture';
  image: string; // Base64 or Preset URL
}

interface TravelMemoriesProps {
  darkMode: boolean;
  destination?: string;
}

const PRESET_MEMORIES_IMAGES = [
  { name: 'Hot Air Balloons', url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600&auto=format&fit=crop' },
  { name: 'Salty Sea Breeze', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop' },
  { name: 'Alpine Ridge', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop' },
  { name: 'Ancient Temple', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop' },
  { name: 'Neon City Lights', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop' }
];

export default function TravelMemories({ darkMode, destination = '' }: TravelMemoriesProps) {
  // Memories local state
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form input states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(destination);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<Memory['category']>('Sightseeing');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_MEMORIES_IMAGES[0].url);
  const [uploadError, setUploadError] = useState('');
  
  // Drag and drop state indicators
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync destination prop to form location automatically
  useEffect(() => {
    if (destination) {
      setLocation(destination);
    }
  }, [destination]);

  // Load memories from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem('travique_memories');
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse memories from storage', err);
      }
    } else {
      // Seed default memory as placeholder
      const initialSeed: Memory[] = [
        {
          id: 'seed-1',
          title: 'Morning flight over the valley',
          location: destination || 'Cappadocia Valley',
          date: new Date().toISOString().split('T')[0],
          rating: 5,
          category: 'Adventure',
          description: 'Woke up at 4:30 AM to catch the sunrise. The landscape was absolutely stellar, dotted with dozens of colorful hot air balloons floating silently in the golden glow. A memory of a lifetime.',
          image: PRESET_MEMORIES_IMAGES[0].url
        }
      ];
      setMemories(initialSeed);
      localStorage.setItem('travique_memories', JSON.stringify(initialSeed));
    }
  }, []);

  const saveMemoriesToStorage = (updatedMemories: Memory[]) => {
    setMemories(updatedMemories);
    localStorage.setItem('travique_memories', JSON.stringify(updatedMemories));
  };

  // Convert uploaded image file to lightweight Base64 to enable complete PWA offline persistence
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a valid image file.');
      return;
    }

    // Limit size to ~1.2MB for localStorage quotas
    if (file.size > 1.2 * 1024 * 1024) {
      setUploadError('Image exceeds size threshold. Please use photos under 1.2MB.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  // Drag and drop handlers
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle Memory Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      alert('Please fill out all memory details before preserving your journey.');
      return;
    }

    const newMemory: Memory = {
      id: `memory-${Date.now()}`,
      title,
      location,
      date,
      rating,
      category,
      description,
      image: selectedImage
    };

    const updated = [newMemory, ...memories];
    saveMemoriesToStorage(updated);

    // Reset Form
    setTitle('');
    setDescription('');
    setRating(5);
    setSelectedImage(PRESET_MEMORIES_IMAGES[0].url);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this travel memory from your PWA vault?')) {
      const filtered = memories.filter(m => m.id !== id);
      saveMemoriesToStorage(filtered);
    }
  };

  return (
    <div id="memories-section" className="space-y-6">
      
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <Camera className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>6. Smart Travel Memories & Reviews Vault</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Capture, rate, and preserve beautiful landmarks, reviews, and snapshots. Stored offline instantly.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
            isAdding 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300' 
              : 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-md hover:opacity-90'
          }`}
        >
          {isAdding ? (
            <>
              <span>Collapse Form</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Log New Memory</span>
            </>
          )}
        </button>
      </div>

      {/* Memory Form Panel */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-card p-5 md:p-6 border border-indigo-500/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10" />
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Form Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Memory / Landmark Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Scenic Sunset view, Amazing local cafe..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full text-xs font-bold p-3 rounded-xl border outline-none ${
                        darkMode 
                          ? 'border-white/10 bg-slate-950 text-white focus:border-indigo-500' 
                          : 'border-slate-200 bg-white text-slate-800 focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Location / City
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cappadocia"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`w-full text-xs font-bold p-3 rounded-xl border outline-none ${
                          darkMode 
                            ? 'border-white/10 bg-slate-950 text-white focus:border-indigo-500' 
                            : 'border-slate-200 bg-white text-slate-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Date Visited
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full text-xs font-bold p-3 rounded-xl border outline-none ${
                          darkMode 
                            ? 'border-white/10 bg-slate-950 text-white focus:border-indigo-500' 
                            : 'border-slate-200 bg-white text-slate-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Category Tag
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Memory['category'])}
                        className={`w-full text-xs font-bold p-3 rounded-xl border outline-none ${
                          darkMode 
                            ? 'border-white/10 bg-slate-950 text-white focus:border-indigo-500' 
                            : 'border-slate-200 bg-white text-slate-800 focus:border-indigo-500'
                        }`}
                      >
                        <option value="Sightseeing">📸 Sightseeing</option>
                        <option value="Food">🍽️ Food & Dining</option>
                        <option value="Adventure">🧗 Adventure / Sport</option>
                        <option value="Accommodation">🏨 Accommodation</option>
                        <option value="Culture">🏛️ Culture & Arts</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Your Rating
                      </label>
                      <div className="flex items-center space-x-1.5 py-2.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`w-5 h-5 ${
                                star <= rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Preserve Your Memory / Review
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Review local services, describe the experience, write about what made it unforgettable..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full text-xs font-bold p-3 rounded-xl border outline-none resize-none ${
                        darkMode 
                          ? 'border-white/10 bg-slate-950 text-white focus:border-indigo-500' 
                          : 'border-slate-200 bg-white text-slate-800 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Drag-and-Drop Image Attachments & Presets */}
                <div className="flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Snapshots / Image captured
                    </label>
                    <p className="text-[10px] text-slate-400 italic">
                      Drag & drop your travel photo or select an elite preset image placeholder below.
                    </p>
                  </div>

                  {/* Interactive Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-950/40'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {selectedImage ? (
                      <div className="relative group w-full h-32 rounded-xl overflow-hidden">
                        <img 
                          src={selectedImage} 
                          alt="Selected memory" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          <Upload className="w-4 h-4 mr-1.5" />
                          <span>Change Photo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2 animate-bounce" />
                        <span className="text-xs font-bold block text-slate-700 dark:text-slate-300">Drop files to attach, or browse</span>
                        <span className="text-[10px] text-slate-400 block mt-1">Supports PNG, JPG, JPEG up to 1.2MB</span>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <span className="text-[10px] text-red-500 font-bold block">{uploadError}</span>
                  )}

                  {/* High Fidelity Presets Carousel */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Preset Alternatives</span>
                    <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                      {PRESET_MEMORIES_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(img.url)}
                          className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === img.url ? 'border-indigo-500 scale-105' : 'border-transparent opacity-75'
                          }`}
                          title={img.name}
                        >
                          <img 
                            src={img.url} 
                            alt={img.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Submission Actions */}
                  <div className="flex items-center justify-end space-x-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-5 rounded-xl text-xs font-bold bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-md hover:opacity-90 cursor-pointer flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Seal In Travel Vault</span>
                    </button>
                  </div>

                </div>

              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Logged Memories & Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <motion.div
            key={memory.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card overflow-hidden group flex flex-col justify-between hover:shadow-xl transition-all duration-300"
          >
            {/* Memory Header Image */}
            <div className="h-44 relative overflow-hidden">
              <img 
                src={memory.image} 
                alt={memory.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                {memory.category}
              </div>

              {/* Star Rating Overlay */}
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center space-x-1 border border-white/10 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{memory.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>{memory.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{memory.date}</span>
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug tracking-tight">
                  {memory.title}
                </h4>

                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-3 relative">
                  <Quote className="w-4 h-4 text-slate-300 dark:text-slate-800 absolute -top-1 -left-1 shrink-0 opacity-40" />
                  <span className="pl-4">{memory.description}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-3 mt-3 border-t border-slate-100/50 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-slate-400">
                <button
                  onClick={() => {
                    const text = `Preserved Travel Memory: ${memory.title} in ${memory.location} (${memory.rating}/5 Stars).\n"${memory.description}"\nShared via TraviQue Elite Organizer.`;
                    navigator.clipboard.writeText(text);
                    alert('Memory and review copied to clipboard! Ready to publish.');
                  }}
                  className="hover:text-indigo-500 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => handleDelete(memory.id)}
                  className="text-red-500/80 hover:text-red-500 transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Remove memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

            </div>

          </motion.div>
        ))}

        {memories.length === 0 && (
          <div className="col-span-full py-12 text-center glass-card border border-slate-200/50 dark:border-white/5 p-6 text-slate-400 flex flex-col items-center justify-center">
            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-850 mb-3 animate-pulse" />
            <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300">Your Memory Vault is currently empty</h5>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
              Press the "Log New Memory" button above to preserve photos, reviews, and star logs completely offline in your PWA application.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
