import { useChat } from '@/hooks/useChat';
import { ChatSidebar } from './ChatSidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export const ChatInterface = () => {
  const {
    chats,
    currentChatId,
    currentChat,
    isLoading,
    createNewChat,
    sendMessage,
    setCurrentChatId
  } = useChat();

  const handleSendMessage = (message: string) => {
    if (currentChatId) {
      sendMessage(message, currentChatId);
    }
  };

  const handleNewChat = async () => {
    await createNewChat();
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        isLoading={isLoading}
      />
      
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="p-4 border-b bg-card">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Assistente IA</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Conversa ativa • {currentChat.chat.length} mensagem{currentChat.chat.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <MessageList 
              messages={currentChat.chat} 
              isLoading={isLoading}
            />
            
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder="Digite sua mensagem aqui..."
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <Card className="p-8 text-center max-w-md">
              <Bot className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Bem-vindo ao Chat IA</h2>
              <p className="text-muted-foreground mb-6">
                Selecione uma conversa existente ou crie uma nova para começar a conversar com o assistente.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};