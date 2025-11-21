import { useState, useEffect } from 'react';
import { useMapData } from '../../hooks/useMapData';
import GeographicMap from '../../maps/GeographicMap';
import { generateQuizQuestions } from '../../utils/quizUtils';
import QuizResults from './QuizResults';
import type { AdminLevel, QuizQuestion } from '../../types';

interface TimeAttackQuizProps {
  adminLevel: AdminLevel;
  onBack: () => void;
}

export default function TimeAttackQuiz({ adminLevel, onBack }: TimeAttackQuizProps) {
  const { data: geoData, loading } = useMapData(adminLevel);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<Array<{ question: QuizQuestion; correct: boolean }>>([]);

  useEffect(() => {
    if (geoData) {
      // Generate many questions for time attack
      const quizQuestions = generateQuizQuestions(geoData, 50);
      setQuestions(quizQuestions);
    }
  }, [geoData]);

  useEffect(() => {
    if (timeRemaining > 0 && !isComplete && questions.length > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isComplete) {
      setIsComplete(true);
    }
  }, [timeRemaining, isComplete, questions.length]);

  const handleRegionClick = (regionCode: string) => {
    if (!questions[currentIndex] || timeRemaining === 0) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = regionCode === currentQuestion.regionCode ||
                      geoData?.features.find(f =>
                        (f.properties.CTPRVN_CD === regionCode || f.properties.SIG_CD === regionCode) &&
                        (f.properties.CTP_KOR_NM === currentQuestion.regionName || f.properties.SIG_KOR_NM === currentQuestion.regionName)
                      );

    if (isCorrect) {
      setScore(score + 10);
    }

    setAnswers([...answers, { question: currentQuestion, correct: !!isCorrect }]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
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
        totalQuestions={answers.length}
        answers={answers}
        onBack={onBack}
        onRetry={() => {
          setCurrentIndex(0);
          setScore(0);
          setTimeRemaining(60);
          setIsComplete(false);
          setAnswers([]);
          const quizQuestions = generateQuizQuestions(geoData, 50);
          setQuestions(quizQuestions);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          ← 뒤로 가기
        </button>
        <div className={`text-2xl font-bold ${timeRemaining <= 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
          ⏱️ {timeRemaining}초
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              "{currentQuestion?.regionName}" 을(를) 찾으세요!
            </h2>
            <div className="text-xl font-semibold text-green-600">
              {score}점 ({answers.length}문제)
            </div>
          </div>
          <p className="text-gray-600">빠르게 클릭하세요! 시간이 없습니다!</p>
        </div>

        <div className="mb-4 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(timeRemaining / 60) * 100}%` }}
          />
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <GeographicMap
            data={geoData}
            onRegionClick={handleRegionClick}
            width={900}
            height={600}
          />
        </div>
      </div>
    </div>
  );
}
