import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Story, Chapter } from '../../types';
import { storyService } from '../../services/story';

const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStoryData = async () => {
      if (!id) {
        setError('Story ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [storyData, chaptersData] = await Promise.all([
          storyService.getStoryDetails(id),
          storyService.getChapters(id)
        ]);
        
        setStory(storyData);
        setChapters(chaptersData.chapters);
      } catch (err) {
        console.error('Error loading story:', err);
        setError('Failed to load story details');
      } finally {
        setLoading(false);
      }
    };

    loadStoryData();
  }, [id]);

  const handleStartReading = (chapterId?: string) => {
    if (!id) return;
    
    // If no specific chapter is provided, use the first available chapter
    const targetChapter = chapterId || (chapters.length > 0 ? chapters[0].id : null);
    
    if (targetChapter) {
      navigate(`/play/${id}/${targetChapter}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Story Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/stories')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{story.title}</h1>
            <p className="text-xl md:text-2xl mb-6 text-purple-100">{story.description}</p>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-lg">
                {story.genre}
              </span>
              <div className="flex items-center gap-4 text-lg">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {chapters.length} Chapters
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                  0 Likes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Quick Start */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Your Adventure</h2>
            <p className="text-gray-600 mb-6">
              Begin your journey through this interactive story where your choices shape the narrative.
            </p>
            <button
              onClick={() => handleStartReading()}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-semibold"
            >
              Start Reading
            </button>
          </div>

          {/* Chapters List */}
          {chapters.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Chapters</h2>
              <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{chapter.title}</h3>
                        <p className="text-sm text-gray-500">Chapter {chapter.chapterNumber}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartReading(chapter.id)}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Read
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chapters.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Chapters Available</h2>
              <p className="text-gray-600">This story doesn't have any published chapters yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
