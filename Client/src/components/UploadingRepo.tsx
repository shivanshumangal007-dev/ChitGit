import { useEffect, useState } from "react";
import api from "../Api.tsx";
type ChildProps = {
	setUploading: React.Dispatch<React.SetStateAction<boolean>>;
	setNewRepo: React.Dispatch<React.SetStateAction<boolean | null>>;
	jobId: string | null;
	onUploadComplete: () => void;
	repoUrl: string;
	setRepoUrl: React.Dispatch<React.SetStateAction<string>>;
};

const UploadingRepo = ({
	setUploading,
	setNewRepo,
	jobId,
	onUploadComplete,
	repoUrl,
	setRepoUrl,
}: ChildProps) => {
	const createConversation = async (repoUrl: string) => {
		try {
			const res = await api.post("/chat/create_conversation", { url: repoUrl });
			return res.data;
		} catch (error) {
			console.error("Error creating conversation:", error);
			throw error;
		}
	};

	const [status, setStatus] = useState<string>("");
	useEffect(() => {
		if (!jobId) return;

		const interval = setInterval(async () => {
			try {
				const res = await api.get(`/job/${jobId}`);
				console.log("Job status response:", res.data);
				const currentStatus = res.data?.status;

				if (currentStatus) {
					setStatus(currentStatus);
				}
				if (currentStatus === "failed"){
					clearInterval(interval);
					// setUploading(false);
					// setNewRepo(true);
					// onUploadComplete();
					setRepoUrl("");
					setStatus("failed");
				}
				if (currentStatus === "finished") {
					clearInterval(interval);
					setUploading(false);
					setNewRepo(true);
					onUploadComplete();
					createConversation(repoUrl).catch((error) => {
						console.error("Error creating conversation after upload:", error);
					});
					setRepoUrl("");
				}
			} catch (error) {
				console.error("Error checking upload status:", error);
				clearInterval(interval);
				setStatus("failed");
				setUploading(false);
				setNewRepo(true);
			}
		}, 6000);

		return () => clearInterval(interval);
	}, [jobId, onUploadComplete, setNewRepo, setUploading]);
	return (
		<div className='w-full h-full flex flex-col gap-9 items-center justify-center'>
			<div className='text-4xl font-bold'>Uploading Repository...</div>
			<div className='w-1/2 h-3 bg-gray-300 rounded-full'>
				<div className='w-[50%] h-full bg-blue-500 rounded-full'></div>
			</div>
			<div className='text-2xl font-semibold'>Current Status: {status}</div>
			{status === "failed" || status.length > 2 ? (
				<div className='text-red-500 text-center'>
					<p>
						failed to upload your repository, pls retry again after sometime
						after checking the repo url
					</p>
					<button
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
						onClick={() => {
							setRepoUrl("");
							setStatus("");
							setUploading(false);
						}}
					>
						Retry
					</button>
				</div>
			) : null}
		</div>
	);
};

export default UploadingRepo;
