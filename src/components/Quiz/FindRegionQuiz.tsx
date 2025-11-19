import { useState, useEffect } from 'react';
import { useMapData } from '../../hooks/useMapData';
import GeographicMap from '../../maps/GeographicMap';
import { generateQuizQuestions, getSidoList } from '../../utils/quizUtils';
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
  const [sidoFilter, setSidoFilter] = useState<string>('all');
  const [sidoList, setSidoList] = useState<Array<{code: string, name: string}>>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [correctRegions, setCorrectRegions] = useState<Set<string>>(new Set());
  const [regionAttempts, setRegionAttempts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (geoData) {
      // For sigungu level, extract sido list
      if (adminLevel === 'sigungu') {
        const list = getSidoList(geoData);
        setSidoList(list);
      }

      // 두 모드 모두 아직 맞추지 않은 지역만 출제
      const quizQuestions = generateQuizQuestions(geoData, 1, sidoFilter, correctRegions);
      setQuestions(quizQuestions);

      // If currentIndex is out of bounds, reset to 0
      if (currentIndex >= quizQuestions.length) {
        setCurrentIndex(0);
      }
    }
  }, [geoData, sidoFilter, adminLevel, correctRegions]);

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

      // 맞춘 지역 추적 (두 모드 모두)
      setCorrectRegions(prev => new Set(prev).add(currentQuestion.regionCode));

      // 시도 횟수 기록 (쉬움 모드용)
      setRegionAttempts(prev => new Map(prev).set(currentQuestion.regionCode, attempts + 1));

      // 피드백 메시지
      const attemptMsg = attempts === 0 ? '한 번에 정답!' :
                        attempts === 1 ? '2번 만에 정답!' :
                        '3번 만에 정답!';
      setFeedback(`${attemptMsg} 🎉 (+${points}점)`);

      setAnswers([...answers, { question: currentQuestion, correct: true, attempts: attempts + 1 }]);

      setTimeout(() => {
        // 모든 지역을 맞출 때까지 계속 (두 모드 모두)
        const totalRegions = geoData?.features.length || 0;
        const newCorrectCount = correctRegions.size + 1;

        if (newCorrectCount >= totalRegions) {
          setIsComplete(true);
        } else {
          // 다음 문제 (아직 맞추지 않은 지역 중 랜덤)
          setCurrentIndex(currentIndex + 1);
          setFeedback(null);
          setAttempts(0);
          setShowAnswer(false);
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

        // 틀린 지역도 추적 (빨간색으로 표시)
        setCorrectRegions(prev => new Set(prev).add(currentQuestion.regionCode));
        setRegionAttempts(prev => new Map(prev).set(currentQuestion.regionCode, 4)); // 4 = 틀림

        setTimeout(() => {
          // 모든 지역을 맞출 때까지 계속 (두 모드 모두)
          const totalRegions = geoData?.features.length || 0;
          const newCorrectCount = correctRegions.size + 1;

          if (newCorrectCount >= totalRegions) {
            setIsComplete(true);
          } else {
            // 다음 문제
            setCurrentIndex(currentIndex + 1);
            setFeedback(null);
            setAttempts(0);
            setShowAnswer(false);
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
          setCorrectRegions(new Set());
          setRegionAttempts(new Map());
          const quizQuestions = generateQuizQuestions(geoData, 1, sidoFilter, new Set());
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
        <div className="text-sm text-gray-600">
          문제 {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          난이도 선택
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDifficulty('easy');
              setCurrentIndex(0);
              setScore(0);
              setFeedback(null);
              setAnswers([]);
              setAttempts(0);
              setShowAnswer(false);
              setCorrectRegions(new Set());
              setRegionAttempts(new Map());
            }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              difficulty === 'easy'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            쉬움
          </button>
          <button
            onClick={() => {
              setDifficulty('hard');
              setCurrentIndex(0);
              setScore(0);
              setFeedback(null);
              setAnswers([]);
              setAttempts(0);
              setShowAnswer(false);
              setCorrectRegions(new Set());
              setRegionAttempts(new Map());
            }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              difficulty === 'hard'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            어려움
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {difficulty === 'easy'
            ? '💡 쉬움: 1회=초록 / 2회=노랑 / 3회=주황 / 틀림=빨강'
            : '💪 어려움: 맞춘 지역이 표시되지 않습니다'}
        </p>
      </div>

      {/* Sido filter for sigungu level */}
      {adminLevel === 'sigungu' && sidoList.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시도 선택 (특정 지역만 퀴즈 풀기)
          </label>
          <select
            value={sidoFilter}
            onChange={(e) => {
              setSidoFilter(e.target.value);
              setCurrentIndex(0);
              setScore(0);
              setFeedback(null);
              setAnswers([]);
              setAttempts(0);
              setShowAnswer(false);
              setCorrectRegions(new Set());
              setRegionAttempts(new Map());
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체 (모든 시도)</option>
            {sidoList.map(sido => (
              <option key={sido.code} value={sido.code}>
                {sido.name}
              </option>
            ))}
          </select>
        </div>
      )}

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
              {difficulty === 'easy' ? (
                <div className="text-xl font-semibold text-blue-600">
                  {correctRegions.size} / {geoData?.features.length || 0}
                </div>
              ) : (
                <div className="text-xl font-semibold text-blue-600">
                  점수: {score}점
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600">지도에서 해당 지역을 클릭하세요 (3회까지 시도 가능)</p>
        </div>

        <div className="relative border border-gray-200 rounded-lg overflow-hidden">
          <GeographicMap
            data={geoData}
            onRegionClick={handleRegionClick}
            width={900}
            height={600}
            highlightRegion={showAnswer ? currentQuestion?.regionCode : undefined}
            showZoomControls={true}
            correctRegions={difficulty === 'easy' ? correctRegions : undefined}
            regionAttempts={difficulty === 'easy' ? regionAttempts : undefined}
          />

          {/* Feedback overlay */}
          {feedback && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 max-w-lg w-full px-4">
              <div className={`p-4 rounded-lg shadow-lg ${
                feedback.includes('정답') ?
                  feedback.includes('한 번') ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                  feedback.includes('2번') ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                  'bg-orange-100 text-orange-800 border-2 border-orange-300'
                : showAnswer ? 'bg-red-100 text-red-800 border-2 border-red-300'
                : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
              }`}>
                {feedback}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
