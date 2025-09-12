import conversationsData from './conversations.json';

/**
 * Service class to handle conversation data operations
 */
export class ConversationService {
  
  /**
   * Get all conversations
   * @returns {Object} All conversations data
   */
  static getAllConversations() {
    return conversationsData.conversations;
  }

  /**
   * Get a specific conversation by ID
   * @param {number} chatId - The ID of the conversation
   * @returns {Object|null} The conversation object or null if not found
   */
  static getConversationById(chatId) {
    return conversationsData.conversations[chatId] || null;
  }

  /**
   * Get conversation history for sidebar display
   * @param {number} currentChatId - Currently active chat ID
   * @returns {Array} Array of conversation history objects
   */
  static getConversationHistory(currentChatId) {
    return Object.values(conversationsData.conversations).map((chat) => ({
      id: chat.id,
      title: chat.title,
      messages: chat.messages.length,
      active: chat.id === currentChatId,
    }));
  }

  /**
   * Get user information
   * @returns {Object} User information object
   */
  static getUserInfo() {
    return conversationsData.userInfo;
  }

  /**
   * Get app configuration
   * @returns {Object} App configuration object
   */
  static getAppConfig() {
    return conversationsData.appConfig;
  }

  /**
   * Add a new message to a conversation
   * @param {number} chatId - The conversation ID
   * @param {Object} message - The message object to add
   * @param {Object} currentChats - Current chats state
   * @returns {Object} Updated chats object
   */
  static addMessageToConversation(chatId, message, currentChats) {
    return {
      ...currentChats,
      [chatId]: {
        ...currentChats[chatId],
        messages: [...currentChats[chatId].messages, message]
      }
    };
  }

  /**
   * Create a new conversation
   * @param {Object} currentChats - Current chats state
   * @returns {Object} Object containing new chat ID and updated chats
   */
  static createNewConversation(currentChats) {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: `New Chat ${Object.keys(currentChats).length + 1}`,
      messages: [],
    };

    const updatedChats = { ...currentChats, [newChatId]: newChat };
    
    return {
      newChatId,
      updatedChats
    };
  }

  /**
   * Search conversations by title
   * @param {string} searchQuery - The search query
   * @param {number} currentChatId - Currently active chat ID
   * @returns {Array} Filtered conversation history
   */
  static searchConversations(searchQuery, currentChatId) {
    const allConversations = this.getConversationHistory(currentChatId);
    
    if (!searchQuery) return allConversations;
    
    return allConversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  /**
   * Check if a conversation exists
   * @param {number} chatId - The conversation ID to check
   * @returns {boolean} True if conversation exists
   */
  static conversationExists(chatId) {
    return !!conversationsData.conversations[chatId];
  }

  /**
   * Get conversation messages by ID
   * @param {number} chatId - The conversation ID
   * @param {Object} currentChats - Current chats state
   * @returns {Array} Array of messages for the conversation
   */
  static getConversationMessages(chatId, currentChats) {
    return currentChats[chatId]?.messages || [];
  }
}

export default ConversationService;