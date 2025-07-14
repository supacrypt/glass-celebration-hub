import { useState, useEffect } from 'react';

interface WeddingStory {
  id: string;
  title: string;
  image: string;
  author: string;
  duration: number;
  viewed: boolean;
}

export const useWeddingStories = () => {
  const [stories, setStories] = useState<WeddingStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock wedding stories data
    const mockStories: WeddingStory[] = [
      {
        id: '1',
        title: 'Venue Visit',
        image: '/api/placeholder/100/100',
        author: 'Sarah',
        duration: 15,
        viewed: false
      },
      {
        id: '2', 
        title: 'Dress Shopping',
        image: '/api/placeholder/100/100',
        author: 'Sarah',
        duration: 20,
        viewed: true
      }
    ];
    
    setTimeout(() => {
      setStories(mockStories);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsViewed = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId ? { ...story, viewed: true } : story
    ));
  };

  return { stories, loading, error, markAsViewed };
};