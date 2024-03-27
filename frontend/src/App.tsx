import { Route, Routes } from "react-router-dom"
import Board from "./pages/_root/Board"
import Home from "./pages/_root/Home"
import LoginPage from "./pages/_auth/LoginPage"
import RegisterPage from "./pages/_auth/RegisterPage"
import AuthLayout from "./pages/_auth/AuthLayout"
import RootLayout from "./pages/_root/RootLayout"

const App = () => {
  return (
    <main className="flex flex-col min-h-screen bg-light-2 dark:bg-gray-800 text-dark-1 dark:text-light-2">
      
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/game/:id" element={<Board />} />
        </Route>
      </Routes>
    
    </main >
  )

}

export default App


