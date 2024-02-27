import { Route, Routes } from "react-router-dom"
import Board from "./pages/Board"
import Home from "./pages/Home"


const App = () => {
    return (
        <main className="flex h-screen">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<Board />} />
            </Routes>
        </main >
    )

}

export default App
