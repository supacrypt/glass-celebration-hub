import { useState, useEffect } from 'react';

interface SocialPost {
  id: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
  comments: number;
}

export const useSocialPosts = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for now
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        content: 'Excited to share our wedding planning journey!',
        author: 'Sarah & Mike',
        created_at: new Date().toISOString(),
        likes: 12,
        comments: 3
      }
    ];
    
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  return { posts, loading, error };
};