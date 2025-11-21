import { useState, useEffect } from 'react';
import { useMapData } from '../../hooks/useMapData';
import GeographicMap from '../../maps/GeographicMap';
import { generateQuizQuestions, generateMultipleChoiceOptions } from '../../utils/quizUtils';
import QuizResults from './QuizResults';
import type { AdminLevel, QuizQuestion } from '../../types';

interface NameQuizProps {
  adminLevel: AdminLevel;
  onBack: () => void;
}

export default function OutlineQuiz({ adminLevel, onBack }: NameQuizProps) {
  const { data: geoData, loading } = useMapData(adminLevel);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<Array<{ question: QuizQuestion; correct: boolean }>>([]);

  useEffect(() => {
    if (geoData) {
      const quizQuestions = generateQuizQuestions(geoData, 10);
      const allRegionNames = geoData.features.map(f =>
        f.properties.CTP_KOR_NM || f.properties.SIG_KOR_NM || f.properties.name || ''
      );

      const questionsWithOptions = quizQuestions.map(q => ({
        ...q,
        options: generateMultipleChoiceOptions(q.regionName, allRegionNames),
      }));

      setQuestions(questionsWithOptions);
    }
  }, [geoData]);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === questions[currentIndex].regionName;
    if (isCorrect) {
      setScore(score + 10);
    }

    setAnswers([...answers, { question: questions[currentIndex], correct: isCorrect }]);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setIsComplete(true);
      }
    }, 2000);
  };

  if (loading || !geoData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">퀴즈 준비 중...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <QuizResults
        score={score}
        totalQuestions={questions.length}
        answers={answers}
        onBack={onBack}
        onRetry={() => {
          setCurrentIndex(0);
          setScore(0);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setIsComplete(false);
          setAnswers([]);
          const quizQuestions = generateQuizQuestions(geoData, 10);
          const allRegionNames = geoData.features.map(f =>
            f.properties.CTP_KOR_NM || f.properties.SIG_KOR_NM || f.properties.name || ''
          );
          const questionsWithOptions = quizQuestions.map(q => ({
            ...q,
            options: generateMultipleChoiceOptions(q.regionName, allRegionNames),
          }));
          setQuestions(questionsWithOptions);
        }}
      />
    );
  }

  const currentQuestion = questions[currentIndex];

  // Safety check: if no question available, show loading
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">문제 준비 중...</p>
        </div>
      </div>
    );
  }

  // Filter features for current question, with safety fallback
  const filteredFeatures = geoData.features.filter(f =>
    (f.properties.CTP_KOR_NM === currentQuestion.regionName ||
     f.properties.SIG_KOR_NM === currentQuestion.regionName)
  );

  // If no features found, use full dataset to prevent blank map
  const mapData = filteredFeatures.length > 0
    ? { ...geoData, features: filteredFeatures }
    : geoData;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          ← 뒤로 가기
        </button>
        <div className="text-sm text-gray-600">
          문제 {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Map */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">경계선만 보고 맞춰보세요! 🎨</h3>
          <GeographicMap
            data={mapData}
            width={450}
            height={400}
            outlineOnly={true}
          />
        </div>

        {/* Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">정답을 선택하세요</h2>
            <div className="text-xl font-semibold text-blue-600">
              점수: {score}점
            </div>
          </div>

          <div className="space-y-3">
            {currentQuestion?.options?.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.regionName;
              let buttonClass = 'w-full p-4 rounded-lg border-2 text-left transition-all ';

              if (showFeedback) {
                if (isCorrect) {
                  buttonClass += 'border-green-500 bg-green-50 text-green-900';
                } else if (isSelected) {
                  buttonClass += 'border-red-500 bg-red-50 text-red-900';
                } else {
                  buttonClass += 'border-gray-200 text-gray-400';
                }
              } else {
                buttonClass += 'border-gray-300 hover:border-blue-500 hover:bg-blue-50';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <div className="font-semibold">{option}</div>
                  {showFeedback && isCorrect && (
                    <div className="text-sm mt-1">✓ 정답</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
