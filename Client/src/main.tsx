import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter, Routes, useNavigate } from "react-router";
import { Route } from "react-router";
import Home from "./pages/Home.tsx";


const RootApp = () => {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <Routes>
        <Route
          path='/'
          element={<App />}
        />
        <Route
          path='/home'
          element={<Home />}
        />
      </Routes>
    </ClerkProvider>
  )
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
      <RootApp/>
    </BrowserRouter>
	</StrictMode>,
);
