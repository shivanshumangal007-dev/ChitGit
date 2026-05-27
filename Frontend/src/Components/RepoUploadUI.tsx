import React, { useState } from "react";
import useRepoStore from "../store/repoStore";

const RepoUploadUI: React.FC = () => {
	const isRepoUploading = useRepoStore((state) => state.isRepoUploading);
	const RepoUplaodingHandler = useRepoStore(
		(state) => state.RepoUplaodingHandler,
	);
	const UploadingStatus = useRepoStore((state) => state.UploadingStatus);
	const [InputRepo, setInputRepo] = useState<string>("second");
	const statusQue = [
		"checking_repo_collection",
		"checking_repo",
		"processing_files",
		"embedding_chunks",
		"uploading_chunks",
		"finished",
	];
	const getStageStyle = (currentStage: string| null, stage: string) => {
        if(!currentStage || currentStage == "failed") return "bg-slate-700";
		const currentIndex = statusQue.indexOf(currentStage as any);
		const stageIndex = statusQue.indexOf(stage as any);

		// completed stages
		if (stageIndex < currentIndex) {
			return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
		}

		// current active stage
		if (stageIndex === currentIndex) {
			return "bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.7)]";
		}

		// pending stages
		return "bg-slate-700";
	};
	const getLabelStyle = (currentStage: string|null, stage: string) => {
        if(!currentStage || currentStage == "failed") return "text-zinc-500";   
		const currentIndex = statusQue.indexOf(currentStage as any);
		const stageIndex = statusQue.indexOf(stage as any);

		if (stageIndex < currentIndex) {
			return "text-emerald-400";
		}
		if (stageIndex === currentIndex) {
			return "text-cyan-400";
		}
		return "text-zinc-500";
	};
	return isRepoUploading ? (
		<div className='w-full h-full flex items-center justify-center p-4'>
			<div className='glass-panel p-md rounded-lg flex flex-col gap-3 animate-pulse-slow w-full'>
				<div className='flex justify-between items-center'>
					<span className='text-xl text-on-surface'>
						Indexing Repository: vercel/ai
					</span>
					<span className='text-[12px] text-on-surface-variant'>
						In Progress
					</span>
				</div>
				<div className='flex gap-2 w-full h-1'>
					{statusQue.map((status) => {
						const style = getStageStyle(UploadingStatus, status);
						return (
							<div className={`h-full rounded-full flex-1 ${style}`}></div>
						);
					})}
				</div>
				<div className='flex justify-between text-[10px] text-on-surface-variant font-label-caps uppercase mt-1'>
					{statusQue.map((status) => (
						<span className={getLabelStyle(UploadingStatus, status)}>
							{status}
						</span>
					))}
				</div>
			</div>
		</div>
	) : (
		<div className='w-full h-full flex items-center justify-center p-4'>
			<div className='rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-900/10 backdrop-blur w-full'>
				<h3 className='text-lg font-semibold text-white mb-2'>
					Upload repository or PDF
				</h3>
				<p className='text-sm text-slate-300 mb-4'>
					Enter a repository URL or a direct PDF link to start ingestion.
				</p>

				<label
					htmlFor='repo-url'
					className='sr-only'
				>
					Repository or PDF URL
				</label>

				<div className='flex items-center gap-3'>
					<input
						id='repo-url'
						type='text'
						placeholder='https://github.com/owner/repo '
						value={InputRepo}
						onChange={(e) => setInputRepo(e.target.value)}
						className='flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10'
					/>

					<button
						type='button'
						className='rounded-xl bg-cyan-500 px-4 py-3 text-sm font-medium text-black hover:bg-cyan-400 transition cursor-pointer'
						onClick={() => {
							RepoUplaodingHandler(InputRepo);
						}}
					>
						Start uploading repo
					</button>
				</div>

				<p className='mt-3 text-xs text-slate-400'>
					Note: ingesting a repository can take around 5 minutes to build the
					chat index.
				</p>
			</div>
		</div>
	);
};

export default RepoUploadUI;
