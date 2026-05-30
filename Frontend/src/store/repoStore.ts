import { create } from "zustand";
import { fetchReposAPI, uploadRepoAPI } from "../api/ApiHandler";
import Api from "../api/Api";

const createConversation = async (repoUrl: string) => {
	try {
		const res = await Api.post("/chat/create_conversation", { url: repoUrl });
		return res.data;
	} catch (error) {
		console.error("Error creating conversation:", error);
		throw error;
	}
};
interface Repo {
	repo_name: string;
	conversation_id: number;
}

interface RepoState {
	repos: Repo[];
	currRepo: string | null;
	isRepoUploading: boolean;
	UploadingStatus: string | null;
	newRepo: boolean | null;
	conversationID: number | null;
	repoError: string | null;
	fetchRepos: () => Promise<void>;
	RepoClickHandler: (repoName: string, conversationId: number) => void;
	newRepoClickHandler: () => void;
	setCurrRepo: (repoName: string | null) => void;
	setNewRepo: (isNew: boolean | null) => void;
	setConversation: (conversationId: number | null) => void;
	setRepoError: (errorMessage: string | null) => void;
	RepoUplaodingHandler: (repoURL: string) => void;
}

const useRepoStore = create<RepoState>((set, get) => ({
	repos: [],
	currRepo: null,
	isRepoUploading: false,
	UploadingStatus: null,
	newRepo: false,
	conversationID: null,
	repoError: null,
	fetchRepos: async () => {
		set({ repoError: null });
		try {
			const res = await fetchReposAPI();
			set({ repos: Array.isArray(res) ? res : [] });
		} catch (error) {
			console.error("Error fetching repositories:", error);
			set({ repos: [], repoError: "Unable to load repositories right now." });
		}
	},
	RepoClickHandler: (repoName, conversationId) => {
        console.log("RepoClickHandler called with:", repoName, conversationId);
		set({ currRepo: repoName, newRepo: false, conversationID: conversationId });
        
	},
	newRepoClickHandler: () => {
		set({ currRepo: null, newRepo: true });
	},
	setCurrRepo: (repoName) => set({ currRepo: repoName }),
	setNewRepo: (isNew) => set({ newRepo: isNew }),
	setConversation: (conversationId) => set({ conversationID: conversationId }),
	setRepoError: (errorMessage) => set({ repoError: errorMessage }),
	RepoUplaodingHandler: async (repoURL: string) => {
		set({ isRepoUploading: true });
		try {
			const jobID = await uploadRepoAPI(repoURL).then((res) => res.job_id);
			//calling APi for checking status of the job every 2 seconds
			const checkStatus = async () => {
				try {
					const inter = setInterval(async () => {
						const res = await Api.get(`/job/${jobID}`);
						console.log("Job status response:", res.data);
						set({ UploadingStatus: res.data?.status || null });
						if (res.data?.status === "finished") {
							clearInterval(inter);
							set({ isRepoUploading: false, repoError: null });
							await createConversation(repoURL).catch((error) => {
								console.error(
									"Error creating conversation after upload:",
									error,
								);
							});
							get()
								.fetchRepos()
								.catch((error) => {
									console.error("Error fetching repos after upload:", error);
								});
						}
						if (res.data?.status === "failed") {
							clearInterval(inter);
							set({
								isRepoUploading: false,
								repoError: "Failed to upload repository. Please try again.",
							});
						}
					}, 2000);
				} catch {
					set({
						isRepoUploading: false,
						repoError: "Failed to upload repository. Please try again.",
					});
				}
			};
			checkStatus();
            set({ UploadingStatus: null });
		} catch {
			set({
				isRepoUploading: false,
				repoError: "Failed to upload repository. Please try again.",
			});
		}
	},
}));

export default useRepoStore;
