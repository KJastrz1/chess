import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export async function getGameById(gameId: string) {
    try {
        const response = await axios.get(`${API_URL}/games/${gameId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch game data');
    }
};

export async function createGame() {
    try {
        const response = await axios.post(`${API_URL}/games`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create a new game');
    }
};

