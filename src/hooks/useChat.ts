import { useState, useEffect } from 'react';
import { Chat, Message, ChatResponse, NewChatResponse } from '@/types/chat';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all chats
  const fetchChats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) throw new Error('Failed to fetch chats');
      const apiResponse = await response.json();
      
      // API returns { data: [...] } structure
      const chatsData = apiResponse.data || apiResponse;
      
      if (Array.isArray(chatsData)) {
        // Map API response to our Chat type
        const mappedChats = chatsData.map(chat => ({
          id: chat._id,
          title: chat.title || '',
          chat: chat.chat.map(message => ({
            id: message.id || Date.now().toString(),
            content: message.text,
            timestamp: message.timestamp || new Date().toISOString(),
            sender: message.from === 'user' ? 'user' : 'assistant'
          })),
          triage: chat.triage || {},
          timestamp: chat.timestamp,
          updated_at: chat.updated_at
        }));
        setChats(mappedChats);
      } else {
        console.warn('API response data is not an array:', chatsData);
        setChats([]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]); // Ensure chats is always an array
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas",
        variant: "destructive"
      });
    }
  };

  // Create new chat
  const createNewChat = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/chat/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to create new chat');
      
      const data: NewChatResponse = await response.json();
      setCurrentChatId(data.id);
      
      // Refresh chats list
      await fetchChats();
      
      toast({
        title: "Sucesso",
        description: "Nova conversa criada"
      });
      
      return data.id;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar nova conversa",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async (message: string, chatId: string) => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);

      // Add user message optimistically
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        timestamp: new Date().toISOString(),
        sender: 'user'
      };

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { ...chat, chat: [...chat.chat, userMessage] }
            : chat
        )
      );

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          message: message,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data: ChatResponse = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        timestamp: new Date().toISOString(),
        sender: 'assistant'
      };

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { ...chat, chat: [...chat.chat, assistantMessage] }
            : chat
        )
      );

      // Refresh to get updated data from server
      await fetchChats();

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
      
      // Remove the optimistic user message on error
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { ...chat, chat: chat.chat.slice(0, -1) }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get current chat
  const getCurrentChat = () => {
    // Defensive check to ensure chats is an array
    if (!Array.isArray(chats)) {
      console.warn('chats is not an array:', chats);
      return null;
    }
    return chats.find(chat => chat.id === currentChatId) || null;
  };

  // Initialize - fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  return {
    chats,
    currentChatId,
    currentChat: getCurrentChat(),
    isLoading,
    createNewChat,
    sendMessage,
    setCurrentChatId,
    fetchChats
  };
};