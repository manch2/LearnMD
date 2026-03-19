import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Quiz from './Quiz';

describe('Quiz', () => {
  const mockQuestions = [
    {
      id: 'q1',
      type: 'multiple-choice' as const,
      question: 'What is 1+1?',
      options: [
        { id: '1', label: '1' },
        { id: '2', label: '2' },
      ],
      correctAnswer: '2',
      explanation: 'Math basic',
    },
  ];

  it('should render the first question', () => {
    render(<Quiz id="quiz-1" questions={mockQuestions} />);
    expect(screen.getByText('What is 1+1?')).toBeDefined();
    expect(screen.getByText('Question 1 of 1')).toBeDefined();
  });

  it('should allow selecting and submitting an answer', () => {
    const onComplete = vi.fn();
    render(<Quiz id="quiz-1" questions={mockQuestions} onComplete={onComplete} />);
    
    // Select answer
    const option = screen.getByText('2');
    fireEvent.click(option);
    
    // Submit
    const submitBtn = screen.getByText('Submit Answer');
    fireEvent.click(submitBtn);
    
    // The results view is shown immediately for the last question
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({
      score: 100,
      passed: true
    }));
    expect(screen.getByText('Congratulations!')).toBeDefined();
  });

  it('should show results on completion', () => {
    render(<Quiz id="quiz-1" questions={mockQuestions} />);
    
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('Submit Answer'));
    
    expect(screen.getByText('Congratulations!')).toBeDefined();
    expect(screen.getByText('100%')).toBeDefined();
  });
});
