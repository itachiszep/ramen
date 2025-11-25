import connectToDatabase from '@/lib/mongoose';
import Post from '@/models/Post';

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

  // GET - Pobierz wszystkie posty
  if (req.method === 'GET') {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      return res.status(200).json(posts);
    } catch (error) {
      console.error('❌ Błąd GET:', error);
      return res.status(500).json({ error: 'Błąd przy pobieraniu postów' });
    }
  }

  // POST - Dodaj nowy post
  if (req.method === 'POST') {
    try {
      const { title, description, image } = req.body;

      if (!title || !description || !image) {
        return res.status(400).json({ error: 'Brakuje danych' });
      }

      // Log rozmiaru obrazu (opcjonalnie)
      const imageSizeMB = (image.length * 0.75) / (1024 * 1024);
      console.log(`📸 Dodawanie zdjęcia o rozmiarze: ${imageSizeMB.toFixed(2)}MB`);

      const post = await Post.create({ title, description, image });
      
      console.log('✅ Post dodany:', post._id);
      return res.status(201).json(post);
    } catch (error) {
      console.error('❌ Błąd POST:', error);
      return res.status(500).json({ error: 'Błąd przy dodawaniu posta' });
    }
  }

  // Nieobsługiwana metoda
  return res.status(405).json({ error: 'Metoda niedozwolona' });
}