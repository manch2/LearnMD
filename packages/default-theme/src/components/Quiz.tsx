import React, { useState, useCallback } from 'react';

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
}: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

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
      <div className="card my-6">
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              results.passed
                ? 'bg-[rgb(var(--success))]/20 text-[rgb(var(--success))]'
                : 'bg-[rgb(var(--error))]/20 text-[rgb(var(--error))]'
            }`}
          >
            {results.passed ? (
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {results.passed ? 'Congratulations!' : 'Keep Trying!'}
          </h3>
          <p className="text-4xl font-bold mb-2">{results.score}%</p>
          <p className="text-[rgb(var(--text-secondary))]">
            {results.answers.filter((a) => a.correct).length} of {results.totalQuestions} correct
          </p>
        </div>

        {showCorrectAnswers && (
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold">Review Answers</h4>
            {results.answers.map((answer, index) => {
              const question = questions.find((q) => q.id === answer.questionId);
              return (
                <div
                  key={answer.questionId}
                  className={`p-4 rounded-lg ${
                    answer.correct
                      ? 'bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/30'
                      : 'bg-[rgb(var(--error))]/10 border border-[rgb(var(--error))]/30'
                  }`}
                >
                  <p className="font-medium mb-2">Question {index + 1}</p>
                  <p className="text-[rgb(var(--text-secondary))] mb-2">{question?.question}</p>
                  <p
                    className={`text-sm ${answer.correct ? 'text-[rgb(var(--success))]' : 'text-[rgb(var(--error))]'}`}
                  >
                    Your answer: {answer.selectedAnswer}
                  </p>
                  {!answer.correct && (
                    <p className="text-sm text-[rgb(var(--success))]">
                      Correct answer:{' '}
                      {Array.isArray(question?.correctAnswer)
                        ? question?.correctAnswer[0]
                        : question?.correctAnswer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {allowRetry && !results.passed && (
          <button onClick={handleRetry} className="btn-primary w-full">
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card my-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[rgb(var(--text-secondary))]">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          {currentQuestion.points && (
            <span className="badge-primary">{currentQuestion.points} points</span>
          )}
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>

      <div className="space-y-3 mb-6">
        {currentQuestion.options?.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = Array.isArray(currentQuestion.correctAnswer)
            ? currentQuestion.correctAnswer.includes(option.id)
            : currentQuestion.correctAnswer === option.id;

          let className = 'p-4 rounded-lg border cursor-pointer transition-all';
          if (submitted) {
            if (isCorrect) {
              className += ' bg-[rgb(var(--success))]/10 border-[rgb(var(--success))]';
            } else if (isSelected && !isCorrect) {
              className += ' bg-[rgb(var(--error))]/10 border-[rgb(var(--error))]';
            } else {
              className += ' border-[rgb(var(--border-color))] opacity-50';
            }
          } else {
            className += isSelected
              ? ' border-[rgb(var(--color-primary-500))] bg-[rgb(var(--color-primary-50))]'
              : ' border-[rgb(var(--border-color))] hover:border-[rgb(var(--color-primary-300))]';
          }

          return (
            <div
              key={option.id}
              className={className}
              onClick={() => handleAnswerSelect(option.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-[rgb(var(--color-primary-500))] bg-[rgb(var(--color-primary-500))]'
                      : 'border-[rgb(var(--border-color))]'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span>{option.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showExplanation && currentQuestion.explanation && (
        <div className="bg-[rgb(var(--info))]/10 border border-[rgb(var(--info))]/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-[rgb(var(--info))]">
            <strong>Explanation:</strong> {currentQuestion.explanation}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button onClick={handleNextQuestion} className="btn-primary flex-1">
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
