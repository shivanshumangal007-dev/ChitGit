import { useState } from "react";

const NewRepo = () => {
	const [repoUrl, setRepoUrl] = useState("");
    const handleSubmit = () => {
        setRepoUrl(""); // Clear input after submission
        // Handle repository creation logic here
        console.log("Creating repository with URL:", repoUrl);
    }
	return (
		<div className='w-full h-full flex flex-col gap-9 items-center justify-center'>
			<input
				type='text'
				placeholder='paste here your git repository URL'
				className='px-10 py-4 rounded-full text-4xl w-[50%] border-2 border-zinc-400 '
				value={repoUrl}
				onChange={(e) => setRepoUrl(e.target.value)}
			/>
			<input
				type='submit'
				value='Create Repository'
				className='ml-4 bg-blue-800 hover:bg-blue-950 transition-all duration-200 cursor-pointer text-white font-bold py-2 px-4 rounded-full'
                onClick={() => handleSubmit()}
			/>
		</div>
	);
};

export default NewRepo;
