import { useState, useEffect } from 'react';
import { useMapData } from '../../hooks/useMapData';
import GeographicMap from '../../maps/GeographicMap';
import { generateQuizQuestions } from '../../utils/quizUtils';
import QuizResults from './QuizResults';
import type { AdminLevel, QuizQuestion } from '../../types';

interface FindRegionQuizProps {
  adminLevel: AdminLevel;
  onBack: () => void;
}

export default function FindRegionQuiz({ adminLevel, onBack }: FindRegionQuizProps) {
  const { data: geoData, loading } = useMapData(adminLevel);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<Array<{ question: QuizQuestion; correct: boolean }>>([]);

  useEffect(() => {
    if (geoData) {
      const quizQuestions = generateQuizQuestions(geoData, 10);
      setQuestions(quizQuestions);
    }
  }, [geoData]);

  const handleRegionClick = (regionCode: string) => {
    if (!questions[currentIndex] || feedback) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = regionCode === currentQuestion.regionCode ||
                      geoData?.features.find(f =>
                        (f.properties.CTPRVN_CD === regionCode || f.properties.SIG_CD === regionCode) &&
                        (f.properties.CTP_KOR_NM === currentQuestion.regionName || f.properties.SIG_KOR_NM === currentQuestion.regionName)
                      );

    if (isCorrect) {
      setScore(score + 10);
      setFeedback('정답입니다! 🎉');
    } else {
      setFeedback(`틀렸습니다. 정답은 ${currentQuestion.regionName}입니다.`);
    }

    setAnswers([...answers, { question: currentQuestion, correct: !!isCorrect }]);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setFeedback(null);
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
          setFeedback(null);
          setIsComplete(false);
          setAnswers([]);
          const quizQuestions = generateQuizQuestions(geoData, 10);
          setQuestions(quizQuestions);
        }}
      />
    );
  }

  const currentQuestion = questions[currentIndex];

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

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              "{currentQuestion?.regionName}" 을(를) 찾으세요!
            </h2>
            <div className="text-xl font-semibold text-blue-600">
              점수: {score}점
            </div>
          </div>
          <p className="text-gray-600">지도에서 해당 지역을 클릭하세요</p>
        </div>

        {feedback && (
          <div className={`mb-4 p-4 rounded-lg ${
            feedback.includes('정답') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {feedback}
          </div>
        )}

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
