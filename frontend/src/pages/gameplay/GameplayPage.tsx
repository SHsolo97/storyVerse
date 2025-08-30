import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameplayService } from '../../services/gameplay';
import type { GameplayResponse } from '../../types';

const GameplayPage: React.FC = () => {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [gameplayData, setGameplayData] = useState<GameplayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingChoice, setIsProcessingChoice] = useState(false);

  useEffect(() => {
    const startChapter = async () => {
      if (!chapterId) {
        setError('Chapter ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await gameplayService.startChapter(chapterId);
        setGameplayData(response);
      } catch (err) {
        console.error('Error starting chapter:', err);
        setError('Failed to start chapter');
      } finally {
        setLoading(false);
      }
    };

    startChapter();
  }, [chapterId]);

  const handleChoiceSelection = async (choiceId: string) => {
    if (!gameplayData?.playerProgress?.currentSceneId || !storyId || isProcessingChoice) return;

    try {
      setIsProcessingChoice(true);
      const response = await gameplayService.makeChoice({
        storyId,
        sceneId: gameplayData.playerProgress.currentSceneId,
        choiceId
      });
      setGameplayData(response);
    } catch (err) {
      console.error('Error making choice:', err);
      setError('Failed to process choice');
    } finally {
      setIsProcessingChoice(false);
    }
  };

  const handleAdvanceScene = async () => {
    if (!gameplayData?.playerProgress?.currentSceneId || !storyId || isProcessingChoice) return;

    try {
      setIsProcessingChoice(true);
      const response = await gameplayService.advanceScene({
        storyId,
        currentSceneId: gameplayData.playerProgress.currentSceneId,
      });
      setGameplayData(response);
    } catch (err) {
      console.error('Error advancing scene:', err);
      setError('Failed to advance scene');
    } finally {
      setIsProcessingChoice(false);
    }
  };

  const handleBackToStory = () => {
    if (storyId) {
      navigate(`/stories/${storyId}`);
    } else {
      navigate('/stories');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  if (error || !gameplayData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Chapter</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={handleBackToStory}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Story
          </button>
        </div>
      </div>
    );
  }

  const { sceneData, playerProgress, nextSceneId } = gameplayData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToStory}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Back to story"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-white">
              <p className="text-sm text-gray-300">Progress</p>
              <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${playerProgress.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="text-white text-sm">
            <p className="text-gray-300">Chapter Progress: {Math.round(playerProgress.progress)}%</p>
          </div>
        </div>

        {/* Scene Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-8 mb-8">
            {/* Scene Background */}
            {sceneData.background && (
              <div className="mb-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <p className="text-white text-center font-medium">{sceneData.background}</p>
              </div>
            )}

            {/* Scene Timeline */}
            <div className="space-y-6 mb-8">
              {sceneData.timeline.map((item, index) => (
                <div key={index} className="animate-fade-in">
                  {item.type === 'narration' && (
                    <p className="text-white text-lg leading-relaxed italic">
                      {item.text}
                    </p>
                  )}
                  {item.type === 'dialogue' && (
                    <div className="bg-white bg-opacity-10 rounded-lg p-4 border-l-4 border-purple-400">
                      <p className="text-white text-lg">
                        {item.text}
                      </p>
                    </div>
                  )}
                  {item.type === 'action' && (
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-opacity-30 rounded-lg p-4">
                      <p className="text-white text-lg font-medium">
                        {item.text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Choices */}
            {sceneData.choice && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  {sceneData.choice.prompt}
                </h3>
                <div className="grid gap-4">
                  {sceneData.choice.options.map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => handleChoiceSelection(option.id)}
                      disabled={isProcessingChoice}
                      className={`p-6 text-left bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl border-2 border-transparent hover:border-purple-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isProcessingChoice ? 'cursor-wait' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <p className="text-white text-lg flex-1">
                          {option.text}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-advance scene (has nextSceneId but no choice) */}
            {!sceneData.choice && nextSceneId && (
              <div className="text-center py-8">
                <button
                  onClick={handleAdvanceScene}
                  disabled={isProcessingChoice}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-semibold disabled:opacity-50"
                >
                  {isProcessingChoice ? 'Loading...' : 'Continue'}
                </button>
              </div>
            )}

            {/* No choices and no nextSceneId - Chapter completed */}
            {!sceneData.choice && !nextSceneId && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Chapter Complete!</h3>
                  <p className="text-gray-300 mb-6">You've reached the end of this chapter.</p>
                </div>
                <button
                  onClick={handleBackToStory}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-semibold"
                >
                  Continue Story
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameplayPage;
