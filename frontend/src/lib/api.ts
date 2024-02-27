import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";
export const getGameById = async (gameId: string) => {
    try {
        const response = await axios.get(`${API_URL}/games/${gameId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch game data');
    }
};