import Api from "./Api.ts";

interface Message {
	id: string;
	text: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

const LoginAPI = async (email:string, password: string) => {
	const response = await Api.post('/login', {email, password});
	return response.data;
}
const RegisterAPI = async (email:string, password: string, username: string) => {
	const response = await Api.post('/register', {email, password, username});
	return response.data;
}

const fetchMessagesAPI = async (conversationId: number) => {
	try {
		const response = await Api.get(`/chat/${conversationId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching messages:", error);
		throw error;
	}
};
const postMessageAPI = async (Message: Message, conversationId: number) => {
	try {
		const response = await Api.post("/chat", {
			conversation_id: conversationId,
			role: "user",
			content: Message.text,
		});

		return response.data;
	} catch (error) {
		console.error("Error sending chat message:", error);
		throw error;
	}
};

const fetchReposAPI = async () => {
	try {
		const res = await Api.get("/all-repos");
		return res.data;
		// set({ repos: Array.isArray(res.data) ? res.data : [] });
	} catch (error) {
		console.error("Error fetching repositories:", error);
		// set({ repos: [], repoError: "Unable to load repositories right now." });
		throw error;
	}
};

const uploadRepoAPI = async (repoUrl: string) => {
	const res = await Api.post("/repo", { url: repoUrl });
	return res.data;
};
export { fetchMessagesAPI, postMessageAPI, fetchReposAPI, uploadRepoAPI , LoginAPI, RegisterAPI };
