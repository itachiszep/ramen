'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';

// Funkcja kompresji obrazu
const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Skalowanie proporcjonalne
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Kompresja do JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Log rozmiaru
        const sizeKB = (compressedBase64.length * 0.75) / 1024;
        console.log(`✅ Skompresowane do: ${sizeKB.toFixed(2)}KB`);
        
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image: null, imagePreview: null });

  // Załaduj posty z MongoDB
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  // NOWA funkcja handleImageChange z kompresją
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Log oryginalnego rozmiaru
        const originalSizeKB = file.size / 1024;
        console.log(`📷 Oryginalny plik: ${originalSizeKB.toFixed(2)}KB`);
        
        // Kompresja obrazu
        const compressed = await compressImage(file, 1200, 0.8);
        
        setFormData({ 
          ...formData, 
          image: compressed, 
          imagePreview: compressed 
        });
      } catch (error) {
        console.error('❌ Błąd kompresji:', error);
        alert('Błąd przetwarzania zdjęcia');
      }
    }
  };

  // Dodawanie nowego posta
  const handleAddPost = async () => {
    if (formData.title.trim() && formData.description.trim() && formData.image) {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setFormData({ title: '', description: '', image: null, imagePreview: null });
      setView('home');
    }
  };

  // Aktualizacja posta
  const handleUpdatePost = async () => {
    if (formData.title.trim() && formData.description.trim() && formData.image) {
      const res = await fetch(`/api/posts/${selectedPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedPost = await res.json();
      setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
      setFormData({ title: '', description: '', image: null, imagePreview: null });
      setSelectedPost(updatedPost);
      setView('details');
    }
  };

  // Usuwanie posta
  const handleDeletePost = async (id) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p._id !== id));
    setSelectedPost(null);
    setView('home');
  };

  // Edycja posta
  const handleEditPost = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      image: post.image,
      imagePreview: post.image
    });
    setView('edit');
  };

  // Strona główna
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 md:pt-24">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">Blog</h1>
            <button
              onClick={() => {
                setFormData({ title: '', description: '', image: null, imagePreview: null });
                setSelectedPost(null);
                setView('create');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition active:scale-95"
            >
              <Plus size={20} /> Nowy post
            </button>
          </div>

          {/* Lista postów */}
          {posts.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-gray-400 text-lg sm:text-xl">Brak postów. Stwórz swój pierwszy post!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {posts.map(post => (
                <div
                  key={post._id}
                  onClick={() => {
                    setSelectedPost(post);
                    setView('details');
                  }}
                  className="bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition cursor-pointer shadow-lg active:scale-95"
                >
                  <div className="h-40 sm:h-48 overflow-hidden bg-slate-700">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-gray-300 text-xs sm:text-sm line-clamp-3">{post.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Strona tworzenia postu
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 md:pt-24">
        <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 sm:mb-8 transition text-sm sm:text-base"
          >
            <ArrowLeft size={20} /> Wróć
          </button>

          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 md:p-8 shadow-xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Nowy post</h1>

            {formData.imagePreview && (
              <div className="mb-4 sm:mb-6">
                <img src={formData.imagePreview} alt="Preview" className="w-full h-40 sm:h-56 md:h-64 object-cover rounded-lg" />
              </div>
            )}

            <div className="mb-4 sm:mb-6">
              <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Zdjęcie</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Tytuł</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Wpisz tytuł postu..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-6 sm:mb-8">
              <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Opis</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Wpisz opis postu..."
                rows="6"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleAddPost}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition active:scale-95 text-sm sm:text-base"
              >
                Opublikuj
              </button>
              <button
                onClick={() => setView('home')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition active:scale-95 text-sm sm:text-base"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Strona szczegółów postu
  if (view === 'details' && selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 md:pt-24">
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 sm:mb-8 transition text-sm sm:text-base"
          >
            <ArrowLeft size={20} /> Wróć
          </button>

          <div className="bg-slate-800 rounded-lg overflow-hidden shadow-xl">
            <div className="h-48 sm:h-72 md:h-96 overflow-hidden">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">{selectedPost.title}</h1>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 whitespace-pre-wrap">{selectedPost.description}</p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => handleEditPost(selectedPost)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition active:scale-95 text-sm sm:text-base"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDeletePost(selectedPost._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition active:scale-95 text-sm sm:text-base"
                >
                  <Trash2 size={20} /> Usuń
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Strona edycji postu
  if (view === 'edit' && selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 md:pt-24">
        <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <button
            onClick={() => setView('details')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 sm:mb-8 transition text-sm sm:text-base"
          >
            <ArrowLeft size={20} /> Wróć
          </button>

          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 md:p-8 shadow-xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Edytuj post</h1>

            {formData.imagePreview && (
              <div className="mb-4 sm:mb-6">
                <img src={formData.imagePreview} alt="Preview" className="w-full h-40 sm:h-56 md:h-64 object-cover rounded-lg" />
              </div>
            )}

            <div className="mb-4 sm:mb-6">
              <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Zmień zdjęcie</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Tytuł</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-6 sm:mb-8">
              <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Opis</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="6"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleUpdatePost}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition active:scale-95 text-sm sm:text-base"
              >
                Zapisz zmiany
              </button>
              <button
                onClick={() => setView('details')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition active:scale-95 text-sm sm:text-base"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}