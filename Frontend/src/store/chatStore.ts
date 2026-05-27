import { create } from "zustand";
import { fetchMessagesAPI, postMessageAPI } from "../api/ApiHandler";

interface Message {
	id: string;
	text: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

interface conversationState {
	conversationId: number | null;
	messages: Message[];
	isLoading: boolean;
	errorInChat: string | null;
	setConversationId: (conversationId: number) => void;
	addMessage: (message: Message) => void;
	fetchMessages: (conversationId: number) => Promise<void>;
	postMessage: (userMessageContent: string) => Promise<void>;
	// createConversation: (repoUrl: string) => Promise<void>;
}

const useChatStore = create<conversationState>((set, get) => ({
	messages: [],
	isLoading: false,
	conversationId: null,
	errorInChat: null,
	setConversationId: (conversationId: number) => set({ conversationId }),
	addMessage: (message: Message) =>
		set((state) => ({ messages: [...state.messages, message] })),
	postMessage: async (userMessageContent: string) => {
		set({ isLoading: true, errorInChat: null });
		const userMessage: Message = {
			id: `msg-${Date.now()}`,
			text: userMessageContent,
			sender: "user",
			timestamp: new Date(),
		};
		set((state) => ({ messages: [...state.messages, userMessage] }));
        let response;
        try{
            response = await postMessageAPI(userMessage, get().conversationId!);
        }catch(error){
            set({ errorInChat: "Failed to send message. Please try again." });
            set({ isLoading: false });
            return;
        }
        const answer = response?.final_ai_answer;
		if (!answer) {
			set({ errorInChat: "The server returned an empty response." });
            set({ isLoading: false });
            return;
		}

		const botMessage: Message = {
			id: `msg-${Date.now() + 1}`,
			text: String(answer),
			sender: "assistant",
			timestamp: new Date(),
		};
		set((state) => ({ messages: [...state.messages, botMessage] }));
        set({ isLoading: false });
	},
	fetchMessages: async (conversationId: number) => {
		set({ isLoading: true, errorInChat: null, messages: [] });
		try {
			const m = await fetchMessagesAPI(conversationId);
			const fetchedMessages = m.map((msg: any) => ({
				id: `msg-${msg.id}`,
				text: msg.content,
				sender: msg.role,
				timestamp: new Date(msg.created_at),
			}));
			set({ messages: fetchedMessages, errorInChat: null });
			set({ isLoading: false });
		} catch (error) {
			console.error("Error fetching messages:", error);
			set({ errorInChat: "Unable to load messages right now." });
			set({ isLoading: false });
		}
	},
}));

export { useChatStore };
