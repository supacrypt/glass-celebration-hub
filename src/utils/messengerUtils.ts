/**
 * Utility functions for triggering the Enhanced Messenger from any component
 */

export interface MessengerOptions {
  center?: boolean;
  chatId?: string;
  minimized?: boolean;
}

/**
 * Opens the Enhanced Messenger with specified options
 */
export const openMessenger = (options: MessengerOptions = {}) => {
  const { center = true, chatId, minimized = false } = options;
  
  window.dispatchEvent(new CustomEvent('openMessenger', {
    detail: {
      center,
      chatId,
      minimized
    }
  }));
};

/**
 * Opens the messenger in center mode (default for main actions)
 */
export const openMessengerCenter = (chatId?: string) => {
  openMessenger({ center: true, chatId });
};

/**
 * Opens the messenger in corner mode (minimized)
 */
export const openMessengerCorner = (chatId?: string) => {
  openMessenger({ center: false, minimized: true, chatId });
};

/**
 * Triggers messenger to start a specific chat
 */
export const startChat = (chatId: string, center: boolean = true) => {
  openMessenger({ center, chatId });
};

/**
 * Triggers messenger to start a video call
 */
export const startVideoCall = (chatId: string) => {
  window.dispatchEvent(new CustomEvent('startVideoCall', {
    detail: { chatId }
  }));
};

/**
 * Triggers messenger to start an audio call
 */
export const startAudioCall = (chatId: string) => {
  window.dispatchEvent(new CustomEvent('startAudioCall', {
    detail: { chatId }
  }));
};

/**
 * Closes the messenger
 */
export const closeMessenger = () => {
  window.dispatchEvent(new CustomEvent('closeMessenger'));
};

// Export all functions as a namespace for convenience
export const MessengerAPI = {
  open: openMessenger,
  openCenter: openMessengerCenter,
  openCorner: openMessengerCorner,
  startChat,
  startVideoCall,
  startAudioCall,
  close: closeMessenger
};

export default MessengerAPI;