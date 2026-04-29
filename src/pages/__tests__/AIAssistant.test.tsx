import { render, screen, fireEvent } from '@testing-library/react';
import AIAssistant from '../AIAssistant';

// Mock the Gemini GenAI
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: vi.fn().mockResolvedValue({ text: "Mocked AI Response" })
        }
      };
    })
  };
});

describe('AIAssistant Component', () => {
  it('renders the initial message', () => {
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: vi.fn(), setItem: vi.fn() },
      writable: true
    });

    render(<AIAssistant />);
    expect(screen.getByText(/VoteGuide AI, your personal civic assistant/i)).toBeInTheDocument();
  });

  it('allows user to send a message', () => {
    render(<AIAssistant />);
    const input = screen.getByPlaceholderText(/Ask VoteGuide AI anything/i);
    const sendButton = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'How do I vote?' } });
    expect(input).toHaveValue('How do I vote?');

    fireEvent.click(sendButton);
    expect(input).toHaveValue(''); // Input should clear
    // Since state update happens, the text "How do I vote?" should be displayed
    // It's transformed via DOMPurify so it should just appear in the dom
  });
});
