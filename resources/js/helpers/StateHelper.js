import { create } from "zustand";

export const useCurrentConversationStore = create((set) => ({
  to: null,
  from: null,
  subject: null,
  conversationID: null,
}));