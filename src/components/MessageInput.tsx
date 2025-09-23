import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Digite sua mensagem..." 
}: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      <div className="flex gap-3 max-w-4xl mx-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[60px] max-h-[120px] resize-none"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          size="icon"
          className="self-end mb-0 h-[60px] w-[60px]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};