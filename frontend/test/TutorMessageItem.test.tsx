import { fireEvent, render, screen } from '@testing-library/react';
import { TutorMessageItem } from '../src/components/tutor/TutorMessageItem';
import type { TutorMessage } from '../src/types/tutor';

jest.mock('react-markdown', () => {
  return function MockMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content" dangerouslySetInnerHTML={{ __html: children }} />;
  };
});

jest.mock('rehype-raw', () => () => {});

jest.mock('rehype-sanitize', () => ({
  __esModule: true,
  default: () => () => {},
  defaultSchema: { attributes: {} },
}));

jest.mock('remark-gfm', () => () => {});

describe('TutorMessageItem Component', () => {
  it('renders a user message with user badge and content', () => {
    const userMsg: TutorMessage = {
      id: 'msg-1',
      role: 'user',
      content: '¿Cómo pido un asiento de pasillo?',
      createdAt: '2026-10-26T12:00:00Z',
    };

    render(<TutorMessageItem message={userMsg} />);

    expect(screen.getByText('Tú')).toBeInTheDocument();
    expect(screen.getByText('¿Cómo pido un asiento de pasillo?')).toBeInTheDocument();
  });

  it('renders an assistant message with tutor badge and bilingual TTS tags', () => {
    const tutorMsg: TutorMessage = {
      id: 'msg-2',
      role: 'assistant',
      content: 'Puedes decir: <span lang="en">"Could I have an aisle seat?"</span>',
      createdAt: '2026-10-26T12:01:00Z',
    };

    render(<TutorMessageItem message={tutorMsg} isTtsSupported={true} />);

    expect(screen.getByText('Tutor IA')).toBeInTheDocument();
    const markdownEl = screen.getByTestId('markdown-content');
    expect(markdownEl).toBeInTheDocument();
    expect(markdownEl.innerHTML).toContain('<span lang="en">"Could I have an aisle seat?"</span>');
  });

  it('renders audio speaker button and triggers onToggleSpeak when clicked', () => {
    const handleToggleSpeak = jest.fn();
    const tutorMsg: TutorMessage = {
      id: 'msg-3',
      role: 'assistant',
      content: 'Explicación de equipaje con voz.',
      createdAt: '2026-10-26T12:02:00Z',
    };

    render(
      <TutorMessageItem
        message={tutorMsg}
        isTtsSupported={true}
        onToggleSpeak={handleToggleSpeak}
      />,
    );

    const speakBtn = screen.getByRole('button', {
      name: /escuchar respuesta en voz alta/i,
    });
    expect(speakBtn).toBeInTheDocument();

    fireEvent.click(speakBtn);
    expect(handleToggleSpeak).toHaveBeenCalledWith('msg-3', 'Explicación de equipaje con voz.');
  });

  it('does not render speaker button when TTS is unsupported', () => {
    const tutorMsg: TutorMessage = {
      id: 'msg-4',
      role: 'assistant',
      content: 'Mensaje sin audio soportado.',
      createdAt: '2026-10-26T12:03:00Z',
    };

    render(<TutorMessageItem message={tutorMsg} isTtsSupported={false} />);

    expect(
      screen.queryByRole('button', { name: /escuchar respuesta en voz alta/i }),
    ).not.toBeInTheDocument();
  });
});
