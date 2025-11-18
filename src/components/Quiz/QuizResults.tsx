import type { QuizQuestion } from '../../types';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  answers: Array<{ question: QuizQuestion; correct: boolean }>;
  onBack: () => void;
  onRetry: () => void;
}

export default function QuizResults({ totalQuestions, answers, onBack, onRetry }: QuizResultsProps) {
  const correctCount = answers.filter(a => a.correct).length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  let grade = '';
  let emoji = '';
  let message = '';

  if (percentage >= 90) {
    grade = 'S';
    emoji = '🏆';
    message = '완벽합니다! 한국 지리 달인이시네요!';
  } else if (percentage >= 80) {
    grade = 'A';
    emoji = '🌟';
    message = '훌륭합니다! 거의 완벽해요!';
  } else if (percentage >= 70) {
    grade = 'B';
    emoji = '👍';
    message = '잘했어요! 조금만 더 연습하면 완벽해질 거예요!';
  } else if (percentage >= 60) {
    grade = 'C';
    emoji = '😊';
    message = '괜찮아요! 계속 연습하면 더 좋아질 거예요!';
  } else {
    grade = 'D';
    emoji = '💪';
    message = '연습 모드로 먼저 익혀보는 건 어떨까요?';
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">퀴즈 완료!</h1>
          <p className="text-gray-600">결과를 확인하세요</p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">{emoji}</div>
          <div className="text-6xl font-bold text-blue-600 mb-2">{grade}</div>
          <div className="text-2xl text-gray-900 mb-4">
            {correctCount} / {totalQuestions} 정답
          </div>
          <div className="text-xl text-gray-600 mb-2">
            정답률: {percentage}%
          </div>
          <div className="text-lg text-gray-700 font-medium">
            {message}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{correctCount}</div>
            <div className="text-sm text-green-800">정답</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{totalQuestions - correctCount}</div>
            <div className="text-sm text-red-800">오답</div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">답안 확인</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  answer.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <span className="text-sm font-medium">
                  {index + 1}. {answer.question.regionName}
                </span>
                <span className="text-lg">
                  {answer.correct ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            다시 도전
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            메뉴로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
