import { Bot, MonitorCheck, Plus, Sparkles, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import RepoUploadUI from "../Components/RepoUploadUI";
import { useChatStore } from "../store/chatStore";
import useRepoStore from "../store/repoStore";

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

type ChatMessage = {
	id: string | number;
	sender: "user" | "assistant";
	text: string;
	timestamp: Date;
};

const formatMessageTime = (timestamp: Date) =>
	timestamp.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

const MessageCard = ({ message }: { message: ChatMessage }) => {
	const isUser = message.sender === "user";

	return (
		<article
			className={`flex min-w-0 ${isUser ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`relative w-full max-w-full overflow-hidden rounded-[1.75rem] border shadow-2xl shadow-black/10 transition-all duration-300 sm:max-w-[86%] ${
					isUser
						? "border-cyan-400/20 bg-linear-to-br from-cyan-500/20 via-cyan-500/10 to-slate-950/90"
						: "border-white/10 bg-linear-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95"
				}`}
			>
				<div
					className={`absolute inset-x-0 top-0 h-px bg-linear-to-r ${
						isUser
							? "from-transparent via-cyan-300/70 to-transparent"
							: "from-transparent via-white/20 to-transparent"
					}`}
				/>

				<div className='flex items-start gap-4 p-4 sm:p-5'>
					<div
						className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold shadow-lg ${
							isUser
								? "border-cyan-300/30 bg-cyan-400/15 text-cyan-100"
								: "border-white/10 bg-white/5 text-white"
						}`}
					>
						{isUser ? (
							<UserRound className='h-5 w-5' />
						) : (
							<Bot className='h-5 w-5' />
						)}
					</div>

					<div className='min-w-0 flex-1 space-y-3'>
						<div className='flex flex-wrap items-center justify-between gap-2'>
							<div className='flex items-center gap-2'>
								<span
									className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${
										isUser
											? "border-cyan-300/25 bg-cyan-400/10 text-cyan-100"
											: "border-white/10 bg-white/5 text-slate-200"
									}`}
								>
									{isUser ? "You" : "Assistant"}
								</span>
								{!isUser && (
									<span className='inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-100'>
										<Sparkles className='h-3.5 w-3.5' />
										Repo-aware response
									</span>
								)}
							</div>

							<span className='text-xs font-medium tracking-wide text-slate-400'>
								{formatMessageTime(message.timestamp)}
							</span>
						</div>

						<div
							className={`min-w-0 rounded-2xl border px-4 py-3 shadow-inner ${
								isUser
									? "border-cyan-300/10 bg-slate-950/55 text-white"
									: "border-white/5 bg-black/20 text-slate-100"
							}`}
						>
							{isUser ? (
								<p className='text-sm leading-7 whitespace-pre-wrap wrap-break-word text-slate-100'>
									{message.text}
								</p>
							) : (
								<div className='min-w-0 space-y-3'>
									<ReactMarkdown
										remarkPlugins={[remarkGfm]}
										components={markdownComponents}
									>
										{message.text}
									</ReactMarkdown>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</article>
	);
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
	const newRepoClickHandler = useRepoStore(
		(state) => state.newRepoClickHandler,
	);
	const fetchMessages = useChatStore((state) => state.fetchMessages);
	const repoClickHandler = useRepoStore((state) => state.RepoClickHandler);
	const [inputChat, setInputChat] = useState<string>("");
	const postMessage = useChatStore((state) => state.postMessage);
	useEffect(() => {
		fetchRepos();
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [messages, isLoading, currRepo, newRepo]);

	return (
		<div className='h-screen w-full flex justify-between items-center bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_24%),linear-gradient(180deg,#020617_0%,#030712_100%)] text-white'>
			<aside className='left flex h-full w-[25vw] flex-col border-r border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl'>
				<div className='rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow-2xl shadow-black/10'>
					<p className='text-[11px] uppercase tracking-[0.35em] text-cyan-200/70'>
						Workspace
					</p>
					<h1 className='mt-2 text-4xl font-light uppercase tracking-[0.35em] text-cyan-200/90'>
						CHITGIT
					</h1>
					<p className='mt-3 text-sm leading-6 text-slate-400'>
						Keep your repo conversations structured, searchable, and visually
						calm.
					</p>
				</div>

				<button
					className='mt-6 flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/15 px-4 py-4 text-lg font-semibold text-cyan-50 shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-500/25'
					onClick={newRepoClickHandler}
				>
					<Plus className='h-5 w-5' />
					New Chat
				</button>

				<div className='mt-4 flex-1 rounded-3xl border border-white/10 bg-slate-900/40 p-3'>
					<div className='mb-3 flex items-center justify-between px-2'>
						<p className='text-xs font-medium uppercase tracking-[0.25em] text-slate-400'>
							Repositories
						</p>
						<span className='rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400'>
							{repos.length}
						</span>
					</div>
					<ul className='space-y-2'>
						{RepoError && (
							<p className='mb-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200'>
								{RepoError}
							</p>
						)}
						{repos.length === 0 ? (
							<p className='rounded-2xl border border-dashed border-white/10 bg-white/5 px-3 py-4 text-sm text-slate-500'>
								No repositories found.
							</p>
						) : (
							repos.map((repo) => (
								<li
									key={repo.repo_name}
									className='group cursor-pointer rounded-2xl border border-transparent bg-white/0 px-3 py-3 text-left text-base capitalize text-slate-300 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-white'
									onClick={async () => {
										await repoClickHandler(
											repo.repo_name,
											repo.conversation_id,
										);
										fetchMessages(conversationID!);
									}}
								>
									<div className='flex items-center justify-between gap-3'>
										<span className='truncate'>{repo.repo_name}</span>
										<span className='text-[10px] uppercase tracking-[0.3em] text-slate-500 group-hover:text-cyan-200/80'>
											Open
										</span>
									</div>
								</li>
							))
						)}
					</ul>
				</div>
			</aside>

			<main className='right relative h-full w-[75vw]'>
				<header className='flex items-center justify-between border-b border-white/10 bg-slate-950/30 px-5 py-4 backdrop-blur-xl'>
					<div>
						<p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
							Conversation
						</p>
						<h2 className='mt-1 text-2xl font-semibold text-white'>Chat</h2>
					</div>
					<h3 className='flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-50'>
						<MonitorCheck className='h-4 w-4 text-cyan-300' />
						{currRepo ? repoName : "No repository selected"}
					</h3>
				</header>

				<section className='relative h-[calc(100vh-80px)] overflow-y-auto p-5'>
					{errorInChat && (
						<div className='mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-100 backdrop-blur'>
							{errorInChat}
						</div>
					)}

					{newRepo ? (
						<RepoUploadUI />
					) : currRepo ? (
						<div className='overflow-y-auto flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden pb-40 h-[calc(100vh-230px)]'>
							{messages.length === 0 && !isLoading && (
								<div className='flex min-h-[48vh] items-center justify-center'>
									<div className='max-w-lg rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center shadow-2xl shadow-black/10 backdrop-blur'>
										<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-200'>
											<Sparkles className='h-6 w-6' />
										</div>
										<p className='text-lg font-medium text-white'>
											Start a conversation about {repoName}
										</p>
										<p className='mt-2 text-sm leading-6 text-slate-400'>
											Ask questions about the code, get suggestions, and keep
											the context anchored to this repository.
										</p>
									</div>
								</div>
							)}

							{messages.map((message) => (
								<MessageCard
									key={message.id}
									message={message as ChatMessage}
								/>
							))}

							{isLoading && (
								<div className='flex justify-start'>
									<div className='rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-lg shadow-black/10'>
										<div className='flex space-x-2'>
											<div className='h-2 w-2 animate-bounce rounded-full bg-cyan-300/70' />
											<div
												className='h-2 w-2 animate-bounce rounded-full bg-cyan-300/70'
												style={{ animationDelay: "0.1s" }}
											/>
											<div
												className='h-2 w-2 animate-bounce rounded-full bg-cyan-300/70'
												style={{ animationDelay: "0.2s" }}
											/>
										</div>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />

							<div className='pointer-events-none absolute inset-x-0 bottom-0 px-2 pb-3'>
								<div className='mx-auto max-w-7xl'>
									<div className='pointer-events-auto overflow-hidden rounded-[1.75rem] border border-cyan-400/15 bg-slate-950/90 shadow-[0_24px_80px_rgba(8,145,178,0.18)] backdrop-blur-2xl'>
										<div className='flex items-center justify-between border-b border-white/5 px-5 py-3'>
											<div className='flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400'>
												<Sparkles className='h-4 w-4 text-cyan-300' />
												Compose a repo-aware reply
											</div>
											<div className='rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-200'>
												Ready
											</div>
										</div>

										<textarea
											placeholder='Ask anything about the repository...'
											className='min-h-1 max-h-60 w-full resize-none bg-transparent px-5 py-4 pr-16 text-[15px] leading-7 text-white outline-none placeholder:text-slate-500'
											value={inputChat}
											onChange={(e) => setInputChat(e.target.value)}
											disabled={isLoading}

										/>

										<div className='flex items-center justify-between border-t border-white/5 bg-white/2 px-4 py-1'>
											<div className='flex items-center gap-2 text-sm text-slate-400'>
												<span className='h-2 w-2 animate-pulse rounded-full bg-emerald-400' />
												Repository indexed and ready
											</div>

											<button
												type='submit'
												className='flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-300 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
												onClick= {() => {
													if(inputChat.trim() === "" || isLoading) return;
													postMessage(inputChat, conversationID);
													setInputChat("");
												}}
											>
												Send
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className='flex h-full items-center justify-center text-gray-500'>
							No messages to display
						</div>
					)}
				</section>
			</main>
		</div>
	);
};

export default Home;
