import { fireEvent, render, screen } from '@testing-library/react';
import { LessonAccessDenied } from '../src/components/lessons/LessonAccessDenied';

describe('LessonAccessDenied Component (403 Forbidden State)', () => {
  it('renders restricted access heading and explanatory text', () => {
    const handleBack = jest.fn();

    render(<LessonAccessDenied onBack={handleBack} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Acceso Restringido a la Lección')).toBeInTheDocument();
    expect(
      screen.getByText(/No tienes una matrícula activa en el curso al que pertenece esta lección/i),
    ).toBeInTheDocument();
  });

  it('triggers onBack callback when clicking the back button', () => {
    const handleBack = jest.fn();

    render(<LessonAccessDenied onBack={handleBack} />);

    const backButton = screen.getByRole('button', { name: /volver/i });
    fireEvent.click(backButton);

    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders enrollment button when onEnroll prop is provided and triggers callback', () => {
    const handleBack = jest.fn();
    const handleEnroll = jest.fn();

    render(<LessonAccessDenied onBack={handleBack} onEnroll={handleEnroll} />);

    const enrollButton = screen.getByRole('button', { name: /matricularme ahora/i });
    expect(enrollButton).toBeInTheDocument();

    fireEvent.click(enrollButton);
    expect(handleEnroll).toHaveBeenCalledTimes(1);
  });

  it('disables or marks enrollment button with loading state when isEnrolling is true', () => {
    const handleBack = jest.fn();
    const handleEnroll = jest.fn();

    render(<LessonAccessDenied onBack={handleBack} onEnroll={handleEnroll} isEnrolling={true} />);

    const enrollButton = screen.getByRole('button', { name: /matricularme ahora/i });
    expect(enrollButton).toBeDisabled();
  });
});
