import { useMutation, useQuery } from "react-query";
import { QUERY_KEYS } from "./keyQuery";
import { createGame, createUserAccount, getCurrentUser, getGameById, getGames, getWebSocketToken, getPendingGames, signInAccount, getGamesHistory } from "./api";
import { IGameHistoryParams, IGameParams, ILoginUser, INewUser } from "@/types";
import { toast } from "react-toastify";



// ============================================================
// AUTH QUERIES
// ============================================================
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: ILoginUser) =>
            signInAccount(user),
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: () => getCurrentUser(),
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export const useGetWebSocketToken = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_WEBSOCKET_TOKEN],
        queryFn: () => getWebSocketToken(),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24 * 7,
        cacheTime: 1000 * 60 * 60 * 24 * 7,
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}


// ============================================================
// GAMES QUERIES
// ============================================================
export const useCreateGame = () => {
    return useMutation(createGame, {
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export const useGetGames = (params: IGameParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAMES, params],
        queryFn: () => getGames(params),
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export const useGetGamesHistory = (params: IGameHistoryParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAMES_HISTORY, params],
        queryFn: () => getGamesHistory(params),
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export const useGetGameById = (gameId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAME_BY_ID, gameId],
        queryFn: () => getGameById(gameId),
        enabled: !!gameId,
        onError: (error: Error) => {
            toast.error(error.message);
            return;
        },
        retry: (error) => {
            if (error instanceof Error && error.message !== 'Game not found' && error.message !== 'Invalid game ID format') {
                return true;
            }
            return false;
        },
    });
}






