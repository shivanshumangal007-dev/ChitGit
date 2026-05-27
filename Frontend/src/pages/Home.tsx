import { MonitorCheck, Plus } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore } from "../store/chatStore";
import { useEffect, useRef } from "react";
import useRepoStore from "../store/repoStore";
import RepoUploadUI from "../Components/RepoUploadUI";

const markdownComponents: Components = {
	p: ({ children }) => (
		<p className='m-0 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-gray-100'>
			{children}
		</p>
	),
	h1: ({ children }) => (
		<h1 className='mt-0 mb-3 text-2xl font-semibold tracking-tight text-white'>
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2 className='mt-5 mb-2 text-xl font-semibold tracking-tight text-white'>
			{children}
		</h2>
	),
	h3: ({ children }) => (
		<h3 className='mt-4 mb-2 text-lg font-semibold tracking-tight text-white'>
			{children}
		</h3>
	),
	h4: ({ children }) => (
		<h4 className='mt-4 mb-2 text-base font-semibold tracking-tight text-white'>
			{children}
		</h4>
	),
	ul: ({ children }) => (
		<ul className='my-3 list-disc space-y-1 pl-5 text-sm leading-7 text-gray-100'>
			{children}
		</ul>
	),
	ol: ({ children }) => (
		<ol className='my-3 list-decimal space-y-1 pl-5 text-sm leading-7 text-gray-100'>
			{children}
		</ol>
	),
	li: ({ children }) => <li className='wrap-break-word'>{children}</li>,
	blockquote: ({ children }) => (
		<blockquote className='my-4 border-l-4 border-blue-500 bg-gray-800/70 px-4 py-3 text-sm leading-7 text-gray-200'>
			{children}
		</blockquote>
	),
	strong: ({ children }) => (
		<strong className='font-semibold text-white'>{children}</strong>
	),
	em: ({ children }) => <em className='italic text-gray-50'>{children}</em>,
	a: ({ children, href }) => (
		<a
			href={href}
			target='_blank'
			rel='noreferrer'
			className='wrap-break-word text-blue-300 underline decoration-blue-400/70 underline-offset-4 hover:text-blue-200'
		>
			{children}
		</a>
	),
	code: ({ children, className, ...props }) => {
		if (!className) {
			return (
				<code
					className='rounded-md bg-gray-950/80 px-1.5 py-0.5 font-mono text-[0.9em] text-blue-200 ring-1 ring-gray-700/80'
					{...props}
				>
					{children}
				</code>
			);
		}

		return (
			<code
				className={`${className ?? ""} block overflow-x-auto rounded-lg bg-gray-950 px-4 py-3 font-mono text-sm leading-6 text-gray-100`}
				{...props}
			>
				{children}
			</code>
		);
	},
	pre: ({ children }) => (
		<pre className='my-4 max-w-full overflow-x-auto rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm leading-6 text-gray-100'>
			{children}
		</pre>
	),
	table: ({ children }) => (
		<div className='my-4 max-w-full overflow-x-auto rounded-xl border border-gray-700 bg-gray-900/80'>
			<table className='min-w-full border-collapse text-left text-sm text-gray-100'>
				{children}
			</table>
		</div>
	),
	thead: ({ children }) => (
		<thead className='bg-gray-800 text-gray-50'>{children}</thead>
	),
	tr: ({ children }) => (
		<tr className='border-b border-gray-700 last:border-b-0'>{children}</tr>
	),
	th: ({ children }) => (
		<th className='border-r border-gray-700 px-3 py-2 align-top font-semibold last:border-r-0'>
			{children}
		</th>
	),
	td: ({ children }) => (
		<td className='border-r border-gray-700 px-3 py-2 align-top last:border-r-0'>
			{children}
		</td>
	),
};

const Home = () => {
	const messages = useChatStore((state) => state.messages);
	const isLoading = useChatStore((state) => state.isLoading);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const repoName = useRepoStore((state) => state.currRepo);
	const fetchRepos = useRepoStore((state) => state.fetchRepos);
	const errorInChat = useChatStore((state) => state.errorInChat);
	const RepoError = useRepoStore((state) => state.repoError);
	const repos = useRepoStore((state) => state.repos);
	const newRepo = useRepoStore((state) => state.newRepo);
	const currRepo = useRepoStore((state) => state.currRepo);
    const conversationID = useRepoStore((state) => state.conversationID);
    const newRepoClickHandler = useRepoStore((state) => state.newRepoClickHandler);

	useEffect(() => {
		fetchRepos();
	}, []);

	return (
		<div className='h-screen w-full flex justify-between items-center bg-gray-950 text-white'>
			<aside className='left w-[25vw] bg-gray-900/20 border-r-[0.2px] border-r-zinc-100 p-4 h-full'>
				<h1 className='text-4xl uppercase tracking-wider font-light text-cyan-300/80'>
					CHITGIT
				</h1>
				<button className='text-xl font-bold p-4 bg-cyan-800 rounded-lg mt-10 cursor-pointer flex items-center gap-2 hover:bg-cyan-700 transition-all duration-300'
                onClick={newRepoClickHandler}
                >
					<Plus /> New Chat
				</button>

				<div className='mt-4 p-4 bg-gray-900/50 rounded-lg'>
					<ul>
						{RepoError ? (
							<p className='text-red-500 text-sm'>{RepoError}</p>
						) : repos.length === 0 ? (
							<p className='text-gray-500 text-sm'>No repositories found.</p>
						) : (
							repos.map((repo) => (
								<li
									key={repo.repo_name}
									className='text-gray-300 hover:text-white cursor-pointer text-lg backdrop:bg-gray-800/50 p-2 capitalize'
								>
									{repo.repo_name}
								</li>
							))
						)}
					</ul>
				</div>
			</aside>

			<main className='right w-[75vw] h-full relative'>
				<header className='p-4 bg-gray-900/50 border-b-[0.2px] border-b-zinc-100 flex justify-between'>
					<h2 className='text-2xl font-bold'>Chat</h2>
					<h3 className='text-lg font-semibold bg-black rounded-full px-4 py-2 border border-zinc-100 flex items-center gap-2'>
						<MonitorCheck color='#00ffbf' /> {currRepo ? repoName : "No repository selected"}
					</h3>
				</header>

				<section className='p-4 h-[calc(100vh-128px)] overflow-y-auto relative'>
					{errorInChat && (
						<div className='bg-red-900/60 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4'>
							{errorInChat}
						</div>
					)}

					{newRepo ? (
						<RepoUploadUI/>
					) : currRepo ? (
						<div className='flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-w-0'>
							{messages.length === 0 && !isLoading && (
								<div className='flex items-center justify-center h-full text-gray-500'>
									<div className='text-center'>
										<p className='text-lg'>
											Start a conversation about {repoName}
										</p>
										<p className='text-sm mt-2'>
											Ask questions about the code, get suggestions, and more.
										</p>
									</div>
								</div>
							)}

							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex min-w-0 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`min-w-0 max-w-full sm:max-w-[85%] px-4 py-3 rounded-lg overflow-hidden ${
											message.sender === "user"
												? "bg-blue-600 text-white rounded-br-none"
												: "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700"
										}`}
									>
										{message.sender === "assistant" ? (
											<div className='min-w-0 space-y-3'>
												<ReactMarkdown
													remarkPlugins={[remarkGfm]}
													components={markdownComponents}
												>
													{message.text}
												</ReactMarkdown>
											</div>
										) : (
											<p className='text-sm leading-6 whitespace-pre-wrap wrap-break-word'>
												{message.text}
											</p>
										)}

										<span className='mt-2 block text-xs text-gray-400'>
											{message.timestamp.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>
								</div>
							))}

							{isLoading && (
								<div className='flex justify-start'>
									<div className='bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg rounded-bl-none'>
										<div className='flex space-x-2'>
											<div className='w-2 h-2 bg-gray-500 rounded-full animate-bounce' />
											<div
												className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'
												style={{ animationDelay: "0.1s" }}
											/>
											<div
												className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'
												style={{ animationDelay: "0.2s" }}
											/>
										</div>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />

							<div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-full px-6 pb-6'>
								<div className='relative max-w-5xl mx-auto'>
									<div className='rounded-2xl border border-cyan-500/20 bg-[#0B1120]/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/5 overflow-hidden'>
										<textarea
											placeholder='Ask anything about the repository...'
											className={`w-full resize-none bg-transparent text-white placeholder:text-zinc-500 px-5 py-4 pr-16 min-h-18 max-h-55 outline-none text-[15px] leading-7`}
										/>

										<div className='flex items-center justify-between px-4 py-3 border-t border-white/5 bg-white/2'>
											<div className='flex items-center gap-2 text-sm text-zinc-500'>
												<span className='h-2 w-2 rounded-full bg-emerald-400 animate-pulse' />{" "}
												Repository indexed and ready
											</div>

											<button
												type='submit'
												className={`flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20`}
											>
												Send
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className='flex items-center justify-center h-full text-gray-500'>
							No messages to display
						</div>
					)}
				</section>
			</main>
		</div>
	);
};

export default Home;
