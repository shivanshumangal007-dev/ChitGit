import React, { useState } from "react";
import useRepoStore from "../store/repoStore";

const RepoUploadUI: React.FC = () => {
	const isRepoUploading = useRepoStore((state) => state.isRepoUploading);
    const RepoUplaodingHandler = useRepoStore((state) => state.RepoUplaodingHandler);
    const UploadingStatus = useRepoStore((state) => state.UploadingStatus);
    const [InputRepo, setInputRepo] = useState<string>("second");
	return isRepoUploading ? (
		<div>repo uploading.... {UploadingStatus}</div>
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
