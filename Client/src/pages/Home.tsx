import { SignOutButton } from "@clerk/react";
import { PenLine } from "lucide-react";
import { useState } from "react";
import NewRepo from "../components/NewRepo";
import RepoChat from "../components/RepoChat";

const Home = () => {
	const [currRepo, setCurrRepo] = useState<string | null>(null);
	const [newRepo, setNewRepo] = useState<boolean>(true);


	let repos = ["repo1", "repo2", "repo3", "repo4", "repo5"];


	const repoClickHandler = (repoName: string) => {
		setCurrRepo(repoName);
		setNewRepo(false);
	};

	const newRepoClickHandler = () => {
		setCurrRepo(null);
		setNewRepo(true);
	};
	return (
		<div className='h-screen w-full flex justify-around bg-gray-950 text-white p-2'>
			<SignOutButton>
				<button className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded absolute top-4 right-4'>
					Sign Out
				</button>
			</SignOutButton>
			<div className='w-[25vw] bg-gray-900 rounded-3xl p-4 text-3xl relative'>
				<h1 className='text-center mb-4 text-7xl'>ChitGit</h1>
				<p className='text-right text-xl mb-2 bg-gray-800 p-2 rounded-lg capitalize hover:bg-gray-700 cursor-pointer flex gap-3 justify-between' onClick={newRepoClickHandler}>
					<PenLine /> search for new repo
				</p>
				<div className='flex flex-col py-20 px-4 h-full gap-1'>
					{
						repos.map((repo, index) => {
							return (
								<h1 className='hover:bg-gray-700 p-2 rounded-lg transition-all duration-300 cursor-pointer' key={index} onClick={() => repoClickHandler(repo)}>
									{repo}
								</h1>
							);
						} )
					}

				</div>
			</div>
			<div className='w-[70vw] text-lg rounded-3xl overflow-hidden h-full'>
				{newRepo ? <NewRepo/> : <RepoChat repoName={currRepo!}/>}
			</div>
		</div>
	);
};

export default Home;
