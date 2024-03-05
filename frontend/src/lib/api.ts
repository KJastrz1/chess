import axios from "axios";
import { INewUser } from "../types/types";

const API_URL = "http://localhost:3000/api/v1";
// ============================================================
// AUTH API
// ============================================================

export async function createUserAccount(user: INewUser) {
    try {
        const response = await axios.post(`${API_URL}/users/register`, user);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create a new user account');
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const response = await axios.post(`${API_URL}/users/login`, user);
        return response.data;
    } catch (error) {
        throw new Error('Failed to sign in');
    }
}



// ============================================================
// GAMES API
// ============================================================
export async function getGameById(gameId: string) {
    try {
        const response = await axios.get(`${API_URL}/games/${gameId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch game data');
    }
}

export async function createGame() {
    try {
        const response = await axios.post(`${API_URL}/games`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create a new game');
    }
}