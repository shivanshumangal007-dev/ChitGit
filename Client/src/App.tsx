import { Show, SignIn } from "@clerk/react"
import { Navigate } from "react-router"


const App = () => {

  return (
    <div className="h-screen w-full bg-gray-500 text-4xl flex items-center justify-center">
      <Show when = "signed-out">
        <SignIn/>
      </Show>
      <Show when = "signed-in">
        <Navigate to="/home"/>
      </Show>
    </div>
  )
}

export default App
