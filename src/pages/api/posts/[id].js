import connectToDatabase from '@/lib/mongoose';
import Post from '@/models/Post';
import mongoose from 'mongoose';

// KRYTYCZNE: Zwiększ limit body
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  await connectToDatabase();
  
  const { id } = req.query;

  // Walidacja ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Nieprawidłowe ID' });
  }

  // DELETE - Usuń post
  if (req.method === 'DELETE') {
    try {
      const deletedPost = await Post.findByIdAndDelete(id);
      
      if (!deletedPost) {
        return res.status(404).json({ error: 'Post nie znaleziony' });
      }

      console.log('🗑️ Post usunięty:', id);
      return res.status(200).json({ message: 'Usunięto post' });
    } catch (error) {
      console.error('❌ Błąd DELETE:', error);
      return res.status(500).json({ error: 'Błąd przy usuwaniu posta' });
    }
  }

  // PUT - Zaktualizuj post
  if (req.method === 'PUT') {
    try {
      const { title, description, image } = req.body;

      if (!title || !description || !image) {
        return res.status(400).json({ error: 'Brakuje danych' });
      }

      const updated = await Post.findByIdAndUpdate(
        id, 
        { title, description, image }, 
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ error: 'Post nie znaleziony' });
      }

      console.log('✏️ Post zaktualizowany:', id);
      return res.status(200).json(updated);
    } catch (error) {
      console.error('❌ Błąd PUT:', error);
      return res.status(500).json({ error: 'Błąd przy aktualizacji posta' });
    }
  }

  // Nieobsługiwana metoda
  return res.status(405).json({ error: 'Metoda niedozwolona' });
}