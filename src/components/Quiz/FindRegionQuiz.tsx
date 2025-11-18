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
  const [answers, setAnswers] = useState<Array<{ question: QuizQuestion; correct: boolean; attempts: number }>>([]);
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (geoData) {
      const quizQuestions = generateQuizQuestions(geoData, 10);
      setQuestions(quizQuestions);
    }
  }, [geoData]);

  const handleRegionClick = (regionCode: string) => {
    if (!questions[currentIndex] || feedback || showAnswer) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = regionCode === currentQuestion.regionCode ||
                      geoData?.features.find(f =>
                        (f.properties.CTPRVN_CD === regionCode || f.properties.SIG_CD === regionCode) &&
                        (f.properties.CTP_KOR_NM === currentQuestion.regionName || f.properties.SIG_KOR_NM === currentQuestion.regionName)
                      );

    if (isCorrect) {
      // 점수 계산: 1회 만에 맞추면 10점, 2회면 7점, 3회면 5점
      const points = attempts === 0 ? 10 : attempts === 1 ? 7 : 5;
      setScore(score + points);

      // 피드백 메시지
      const attemptMsg = attempts === 0 ? '한 번에 정답!' :
                        attempts === 1 ? '2번 만에 정답!' :
                        '3번 만에 정답!';
      setFeedback(`${attemptMsg} 🎉 (+${points}점)`);

      setAnswers([...answers, { question: currentQuestion, correct: true, attempts: attempts + 1 }]);

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setFeedback(null);
          setAttempts(0);
          setShowAnswer(false);
        } else {
          setIsComplete(true);
        }
      }, 2000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        // 3회 실패 - 정답 표시
        setFeedback(`3회 모두 틀렸습니다. 정답은 "${currentQuestion.regionName}"입니다. (깜빡이는 지역 확인)`);
        setShowAnswer(true);
        setAnswers([...answers, { question: currentQuestion, correct: false, attempts: 3 }]);

        setTimeout(() => {
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFeedback(null);
            setAttempts(0);
            setShowAnswer(false);
          } else {
            setIsComplete(true);
          }
        }, 4000);
      } else {
        // 아직 기회 남음
        setFeedback(`틀렸습니다! 남은 기회: ${3 - newAttempts}회`);

        setTimeout(() => {
          setFeedback(null);
        }, 1500);
      }
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
        totalQuestions={questions.length}
        answers={answers}
        onBack={onBack}
        onRetry={() => {
          setCurrentIndex(0);
          setScore(0);
          setFeedback(null);
          setIsComplete(false);
          setAnswers([]);
          setAttempts(0);
          setShowAnswer(false);
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
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                시도: {attempts}/3
              </div>
              <div className="text-xl font-semibold text-blue-600">
                점수: {score}점
              </div>
            </div>
          </div>
          <p className="text-gray-600">지도에서 해당 지역을 클릭하세요 (3회까지 시도 가능)</p>
        </div>

        {feedback && (
          <div className={`mb-4 p-4 rounded-lg ${
            feedback.includes('정답') ?
              feedback.includes('한 번') ? 'bg-green-100 text-green-800' :
              feedback.includes('2번') ? 'bg-yellow-100 text-yellow-800' :
              'bg-orange-100 text-orange-800'
            : showAnswer ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
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
            highlightRegion={showAnswer ? currentQuestion?.regionCode : undefined}
          />
        </div>
      </div>
    </div>
  );
}
