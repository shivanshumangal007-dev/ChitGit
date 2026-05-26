import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
	return (
		<div className='min-h-screen bg-slate-950 text-white lg:grid lg:grid-cols-2'>
			<div className='relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-center lg:px-12 xl:px-16'>
				<div
					className='absolute inset-0 opacity-30'
					style={{
						backgroundImage:
							"radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.35) 1px, transparent 0)",
						backgroundSize: "32px 32px",
					}}
				/>
				<div className='absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl' />
				<div className='absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl' />

				<div className='relative z-10 max-w-xl space-y-6'>
					<p className='text-sm uppercase tracking-[0.35em] text-cyan-300/80'>
						ChitGit
					</p>
					<h1 className='text-4xl font-semibold tracking-tight text-white xl:text-6xl'>
						Understand any GitHub repository with AI.
					</h1>
					<p className='max-w-lg text-base leading-7 text-slate-300 xl:text-lg'>
						Chat with your codebase, inspect architecture, and get instant help
						from a model that understands the repository you&apos;re working on.
					</p>

					<div className='relative mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur'>
						<div className='flex items-center gap-2 border-b border-white/10 pb-3 text-sm text-slate-300'>
							<span className='inline-block h-2 w-2 rounded-full bg-cyan-400' />
							agent.ts
						</div>
						<pre className='mt-4 overflow-x-auto text-sm leading-6 text-slate-200'>
							{`async function analyzeRepo(url) {
  const context = await fetch(url)

  // Generate AST and embeddings
  return AI.process(context, {
    model: 'chitgit-v4',
    deep: true,
  })
}`}
						</pre>
					</div>
				</div>
			</div>

			<div className='flex items-center justify-center px-6 py-12 sm:px-10 lg:px-12'>
				<div className='w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10'>
					<div className='mb-8 space-y-2 text-center lg:text-left'>
						<p className='text-sm uppercase tracking-[0.3em] text-cyan-300/80'>
							Welcome back
						</p>
						<h2 className='text-3xl font-semibold tracking-tight text-white'>
							Sign in to continue
						</h2>
						<p className='text-sm leading-6 text-slate-400'>
							Access your repositories, conversations, and upload history.
						</p>
					</div>

					<form className='space-y-4'>
						<div className='space-y-2'>
							<label
								htmlFor='email'
								className='text-sm font-medium text-slate-200'
							>
								Email
							</label>
							<input
								id='email'
								type='email'
								placeholder='you@example.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20'
							/>
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='password'
								className='text-sm font-medium text-slate-200'
							>
								Password
							</label>
							<input
								id='password'
								type='password'
								value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
								className='w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20'
							/>
						</div>

						<button
							type='submit'
							className='mt-2 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300'
						>
							Sign in
						</button>
					</form>

					<p className='mt-6 text-center text-sm text-slate-400 lg:text-left'>
						New here?{" "}
						<a
							className='font-medium text-cyan-300 hover:text-cyan-200 cursor-pointer'
              onClick={() => {
                navigate("/register");
              }}
						>
							Create an account
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
