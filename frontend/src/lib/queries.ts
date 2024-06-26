import { useMutation, useQuery } from "react-query";
import { QUERY_KEYS } from "./keysQuery";
import { createGame, createUserAccount, getCurrentUser, getGameById, getGames, getWebSocketToken, signInAccount, getGamesHistory, getRanking } from "./api";
import { IGameHistoryParamsFrontend, IGameParamsFrontend, IGameResponse, ILoginUserRequest, IRankingParamsFrontend, IRegisterUserRequest } from "@/types";
import { toast } from "react-toastify";



// ============================================================
// AUTH QUERIES
// ============================================================
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: IRegisterUserRequest) => createUserAccount(user),
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: ILoginUserRequest) =>
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

export const useGetRanking = (params: IRankingParamsFrontend) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RANKING, params],
        queryFn: () => getRanking(params),
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

export const useGetGames = (params: IGameParamsFrontend) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAMES, params],
        queryFn: () => getGames(params),
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export const useGetGamesHistory = (params: IGameHistoryParamsFrontend) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAMES_HISTORY, params],
        queryFn: () => getGamesHistory(params),
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export const useGetGameById = (gameId: string, noRefetch?: boolean) => {
    return useQuery<IGameResponse, Error>({
        queryKey: [QUERY_KEYS.GET_GAME_BY_ID, gameId],
        queryFn: () => getGameById(gameId),
        enabled: !!gameId,
        staleTime: noRefetch ? Infinity : 0,
        onError: (error: Error) => {
            toast.error(error.message);
            return;
        },
        retry: (error: unknown) => {
            if (error instanceof Error && error.message !== 'Game not found' && error.message !== 'Invalid game ID format') {
                return true;
            }
            return false;
        },
    });
}






