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
   *   onNewUpdates: (data) => { console.debug(data) }
   *   order: 'desc'
   * }
   */
  pollers: []

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

  , updatePoller: (pollerID, updates) => set((state) => {
    const updatedPollers = state.pollers.map((poller) =>
      poller.id === pollerID ? { ...poller, ...updates } : poller
    );

    const found = updatedPollers.some((poller) => poller.id === pollerID);

    if (!found) {
      console.info(pollerID, 'poller missing');
    }

    return {
      pollers: updatedPollers,
    };
  })

  , removePoller: (pollerID) => set((state) => ({
      pollers: state.pollers.filter((poller) => poller.id !== pollerID)
    })),
}));