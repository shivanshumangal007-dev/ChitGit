import { MonitorCheck, Plus } from "lucide-react";
// import React from "react";

const Home = () => {
	return (
		<div className='h-screen w-full flex justify-betweeen items-center bg-gray-950 text-white'>
			<div className='left w-[25vw] bg-gray-900/20 border-r-[0.2px] border-r-zinc-100 p-4 h-full'>
				<h1 className='text-4xl uppercase tracking-wider font-light text-cyan-300/80'>
					CHITGIT
				</h1>
				<h1 className='text-xl font-bold p-4 bg-cyan-800 rounded-lg mt-10 cursor-pointer flex items-center gap-2 hover:bg-cyan-700 transition-all duration-300'>
					<Plus /> New Chat
				</h1>
				<div className='mt-4 p-4 bg-gray-900/50 rounded-lg'>
					<ul>
						<li>repo 1</li>
						<li>repo 2</li>
						<li>repo 3</li>
						<li>repo 4</li>
					</ul>
				</div>
			</div>
			<div className='right w-[75vw] h-full relative'>
				<header className='p-4 bg-gray-900/50 border-b-[0.2px] border-b-zinc-100 flex justify-between'>
					<h2 className='text-2xl font-bold'>Chat</h2>
					<h3 className='text-lg font-semibold bg-black rounded-full px-4 py-2 border border-zinc-100 flex items-center gap-2'>
						<MonitorCheck color='#00ffbf' />
						Repository 1
					</h3>
				</header>
				<div className='p-4 h-[calc(100vh-128px)] overflow-y-auto'>
					<div className='flex flex-col gap-4'>
						<div className='bg-gray-900/50 p-4 rounded-lg self-start max-w-[60%]'>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
								cumque voluptate, corporis quisquam voluptate, corporis quisquam
								cumque voluptate, corporis quisquam voluptate, corporis quisquam
								cumque voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate.
							</p>
						</div>
						<div className='bg-gray-900/50 p-4 rounded-lg self-end max-w-[60%]'>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
								cumque voluptate, corporis quisquam voluptate, corporis quisquam
								cumque voluptate, corporis quisquam voluptate, corporis quisquam
								cumque voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate, corporis quisquam
								voluptate, corporis quisquam voluptate.
							</p>
						</div>
					</div>
				</div>
				<div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-full px-6 pb-6'>
					<div className='relative max-w-5xl mx-auto'>
						<div className='rounded-2xl border border-cyan-500/20 bg-[#0B1120]/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/5 overflow-hidden'>
							<textarea
								placeholder='Ask anything about the repository...'
								className='
          w-full
          resize-none
          bg-transparent
          text-white
          placeholder:text-zinc-500
          px-5
          py-4
          pr-16
          min-h-18
          max-h-55
          outline-none
          text-[15px]
          leading-7
        '
							/>

							<div className='flex items-center justify-between px-4 py-3 border-t border-white/5 bg-white/2'>
								<div className='flex items-center gap-2 text-sm text-zinc-500'>
									<span className='h-2 w-2 rounded-full bg-emerald-400 animate-pulse' />
									Repository indexed and ready
								</div>

								<button
									type='submit'
									className='
            flex
            items-center
            gap-2
            rounded-xl
            bg-cyan-500
            hover:bg-cyan-400
            px-4
            py-2
            text-sm
            font-medium
            text-black
            transition-all
            duration-200
            hover:scale-[1.02]
            active:scale-[0.98]
            shadow-lg
            shadow-cyan-500/20
          '
								>
									Send
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
