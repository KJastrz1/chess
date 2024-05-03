import { Route, Routes } from "react-router-dom"
import Board from "./pages/_root/Board"
import Play from "./pages/_root/Play"
import LoginPage from "./pages/_auth/LoginPage"
import RegisterPage from "./pages/_auth/RegisterPage"
import AuthLayout from "./pages/_auth/AuthLayout"
import RootLayout from "./pages/_root/RootLayout"
import History from "./pages/_root/History"
import Ranking from "./pages/_root/Ranking"
import GameHistory from "./pages/_root/GameHistory"

const App = () => {
  return (
    <main className="flex flex-col min-h-screen bg-light-2 dark:bg-gray-800 text-dark-1 dark:text-light-2">

      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Play />} />
          <Route path="/game/:id" element={<Board />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<GameHistory />} />
          <Route path="/ranking" element={<Ranking />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

      </Routes>
    </main >
  )
}

export default App


