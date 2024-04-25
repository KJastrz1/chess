import axios from "axios";
import { ILoginUser, INewUser } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

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

export async function signInAccount(user: ILoginUser) {
    try {
        const response = await axios.post(`${API_URL}/users/login`, user);
        return response.data;
    } catch (error) {
        throw new Error('Failed to sign in');
    }
}

export async function getCurrentUser() {
    try {
        const response = await axios.get(`${API_URL}/users/get-current-user`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user data');
    }
}

export async function logoutUser() {
    try {
        const response = await axios.get(`${API_URL}/users/logout`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to log out');
    }
}

export async function getWebSocketToken() {
    try {
        const response = await axios.get(`${API_URL}/users/get-websocket-token`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to log out');
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
        if (error.response && error.response.status === 404) {
            throw new Error('Game not found');
        } else if (error.response && error.response.status === 400) {
            throw new Error('Invalid game ID format');
        } else {
            throw new Error('Failed to fetch game data');
        }
    }
}

export async function getGames() {
    try {
        const response = await axios.get(`${API_URL}/games`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch games');
    }
}

export async function searchGames(searchTerm: string) {
    try {
        const response = await axios.get(`${API_URL}/games`, {
            params: {
                searchTerm,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch games');
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