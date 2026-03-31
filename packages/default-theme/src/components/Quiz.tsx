import React, { useState, useCallback } from 'react';
import { getTranslatedString } from '@learnmd/core';
import { useI18n } from '../hooks';

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'input';
  question: string;
  options?: Array<{ id: string; label: string }>;
  correctAnswer: string | string[];
  explanation?: string;
  points?: number;
}

export interface QuizProps {
  id: string;
  questions: QuizQuestion[];
  passingScore?: number;
  allowRetry?: boolean;
  showCorrectAnswers?: boolean;
  onComplete?: (results: QuizResults) => void;
  initialCompleted?: boolean;
  initialScore?: number;
}

export interface QuizResults {
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
}

export function Quiz({
  questions,
  passingScore = 70,
  allowRetry = true,
  showCorrectAnswers = true,
  onComplete,
  initialCompleted = false,
  initialScore = 100,
}: QuizProps) {
  const { currentLanguage, translate } = useI18n();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(initialCompleted);
  const [results, setResults] = useState<QuizResults | null>(
    initialCompleted
      ? { score: initialScore, totalQuestions: questions.length, passed: initialScore >= passingScore, answers: [] }
      : null
  );

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const calculateScore = useCallback(
    (quizAnswers: QuizAnswer[]): QuizResults => {
      const correctAnswers = quizAnswers.filter((a) => a.correct).length;
      const score = Math.round((correctAnswers / questions.length) * 100);

      return {
        score,
        totalQuestions: questions.length,
        passed: score >= passingScore,
        answers: quizAnswers,
      };
    },
    [questions.length, passingScore]
  );

  const handleAnswerSelect = (answer: string) => {
    if (submitted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || submitted) return;

    const isCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer.includes(selectedAnswer)
      : selectedAnswer === currentQuestion.correctAnswer;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correct: isCorrect,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setSubmitted(true);
    setShowExplanation(true);

    if (isLastQuestion) {
      const finalResults = calculateScore(newAnswers);
      setResults(finalResults);
      setQuizCompleted(true);
      onComplete?.(finalResults);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowExplanation(false);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowExplanation(false);
    setQuizCompleted(false);
    setResults(null);
  };

  if (quizCompleted && results) {
    return (
      <div className="bg-white dark:bg-[#202124] shadow-md border border-gray-200 dark:border-gray-800 rounded-xl p-8 my-8 transition-colors">
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${results.passed
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
              }`}
          >
            {results.passed ? (
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <h3 className="text-3xl font-extrabold mb-3 text-slate-900 dark:text-white">
            {results.passed ? translate('quiz.congratulations') || 'Congratulations!' : translate('quiz.keep_trying') || 'Keep Trying!'}
          </h3>
          <p className="text-5xl font-black mb-3 text-emerald-600 dark:text-emerald-500">{results.score}%</p>
          <p className="text-lg font-medium text-slate-500 dark:text-gray-400">
            {results.answers.filter((a) => a.correct).length} {translate('quiz.of')} {results.totalQuestions} {translate('quiz.correct') || 'correct'}
          </p>
        </div>

        {showCorrectAnswers && (
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold border-b border-gray-200 dark:border-gray-800 pb-2 mb-4 text-slate-800 dark:text-white">{translate('quiz.review_answers') || 'Review Answers'}</h4>
            {results.answers.map((answer, index) => {
              const question = questions.find((q) => q.id === answer.questionId);
              return (
                <div
                  key={answer.questionId}
                  className={`p-5 rounded-lg border ${answer.correct
                      ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50'
                    }`}
                >
                  <p className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-gray-400 mb-2">{translate('quiz.question')} {index + 1}</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-gray-200 mb-3">{question ? getTranslatedString(question.question as unknown as Record<string, string>, currentLanguage) : ''}</p>
                  <p
                    className={`font-semibold ${answer.correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}
                  >
                    {translate('quiz.your_answer')}: {(() => {
                      const opt = question?.options?.find((o) => o.id === answer.selectedAnswer);
                      return opt ? getTranslatedString(opt.label as unknown as Record<string, string>, currentLanguage) : answer.selectedAnswer;
                    })()}
                  </p>
                  {!answer.correct && (
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 mt-2">
                      {translate('quiz.correct_answer')}:{' '}
                      {(() => {
                        if (!question) return '';
                        const correctIds = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
                        const opts = question.options?.filter((o) => correctIds.includes(o.id));
                        if (opts?.length) {
                          return opts.map((o) => getTranslatedString(o.label as unknown as Record<string, string>, currentLanguage)).join(', ');
                        }
                        return correctIds.join(', ');
                      })()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {allowRetry && !results.passed && (
          <button onClick={handleRetry} className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-gray-100 transition-colors shadow-sm">
            {translate('quiz.retry') || 'Try Again'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#202124] shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6 lg:p-8 my-8 transition-colors">
      <div className="mb-6">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
            {translate('quiz.question')} {currentQuestionIndex + 1} {translate('quiz.of')} {questions.length}
          </span>
          {currentQuestion.points && (
            <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">{currentQuestion.points} pts</span>
          )}
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white leading-snug">
        {getTranslatedString(currentQuestion.question, currentLanguage)}
      </h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.options?.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = Array.isArray(currentQuestion.correctAnswer)
            ? currentQuestion.correctAnswer.includes(option.id)
            : currentQuestion.correctAnswer === option.id;
          const label = getTranslatedString(option.label, currentLanguage);

          let className = 'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200';
          if (submitted) {
            if (isCorrect) {
              className += ' bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100';
            } else if (isSelected && !isCorrect) {
              className += ' bg-rose-50 dark:bg-rose-900/20 border-rose-500 dark:border-rose-500 text-rose-900 dark:text-rose-100';
            } else {
              className += ' border-gray-200 dark:border-gray-800 opacity-50 text-slate-500 dark:text-gray-400';
            }
          } else {
            className += isSelected
              ? ' border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-900 dark:text-emerald-100 shadow-sm'
              : ' border-gray-200 dark:border-gray-700 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-200';
          }

          return (
            <div
              key={option.id}
              className={className}
              onClick={() => handleAnswerSelect(option.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
                <span className="font-medium text-lg">{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showExplanation && currentQuestion.explanation && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg p-5 mb-8">
          <p className="text-blue-800 dark:text-blue-200">
            <strong className="font-bold">{translate('quiz.explanation')}:</strong> {getTranslatedString(currentQuestion.explanation, currentLanguage)}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        {!submitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {translate('quiz.submit') || 'Submit Answer'}
          </button>
        ) : (
          <button onClick={handleNextQuestion} className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:bg-slate-800 dark:hover:bg-gray-100 transition-colors shadow-sm">
            {isLastQuestion ? translate('quiz.finish') || 'Finish Quiz' : translate('quiz.next_question') || 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
