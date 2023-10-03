import { create } from "zustand";

export const useCurrentConversationStore = create((set) => ({
  to: null,
  from: null,
  subject: null,
  conversationID: null,
}));

export const useAuthStore = create((set) => ({
  email: null,
  name: null,
  avatar: null,
}));

export const useLongPollerStore = create((set) => ({
  /**
   * poller object
   * {
   *   id: 'unique-name-for-your-poller`
   *   url: '/url/to/your/poller'
   * }
   */
  pollers: []

  /**
   * pollersData object
   * {
   *   id: 'unique-name-for-your-poller`
   *   data: {}
   * }
   */
  , pollersData: []

  , addPoller: (newPoller) => set(
    (state) => (
      { pollers: [...state.pollers, newPoller] }
    ))

  , getPoller: (pollerID) => {
    const poller = useLongPollerStore.getState().pollers.find(
      (poller) => poller.id === pollerID
    );
    return poller;
  }

  , getPollerData: (pollerID) => {
    const poller = useLongPollerStore.getState().pollersData.find(
      (poller) => poller.id === pollerID
    );
    return poller;
  }

  , removePoller: (pollerID) =>
    set((state) => ({
      pollers: state.pollers.filter((poller) => poller.id !== pollerID),
      pollersData: state.pollersData.filter((poller) => poller.id !== pollerID),
    })),
}));