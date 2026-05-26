import { create } from "zustand";
import { fetchReposAPI } from "../api/ApiHandler";

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
}

const useRepoStore = create<RepoState>((set) => ({
    repos: [],
    currRepo: null,
    isRepoUploading: false,
    UploadingStatus: null,
    newRepo: true,
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
        set({ currRepo: repoName, newRepo: false, conversationID: conversationId });
    },
    newRepoClickHandler: () => {
        set({ currRepo: null, newRepo: true });
    },
    setCurrRepo: (repoName) => set({ currRepo: repoName }),
    setNewRepo: (isNew) => set({ newRepo: isNew }),
    setConversation: (conversationId) => set({ conversationID: conversationId }),
    setRepoError: (errorMessage) => set({ repoError: errorMessage }),
}));

export default useRepoStore;