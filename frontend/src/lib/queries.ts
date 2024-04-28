import { useMutation, useQuery } from "react-query";
import { QUERY_KEYS } from "./keyQuery";
import { createGame, createUserAccount, getCurrentUser, getGameById, getGames, getWebSocketToken, searchGames, signInAccount } from "./api";
import { ILoginUser, INewUser } from "@/types";
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
        onSuccess: (data) => {
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export const useSearchGames = (player1Username: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_GAMES, player1Username],
        queryFn: () => searchGames(player1Username),
        onError: (error: Error) => {
            toast.error(error.message);
        },

    });
}

export const useGetGames = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAMES],
        queryFn: () => getGames(),
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
        retry: (failureCount, error) => {
            if (error instanceof Error && error.message !== 'Game not found' && error.message !== 'Invalid game ID format') {
                return true;
            }
            return false;
        },
    });
}






