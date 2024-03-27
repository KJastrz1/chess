import { useMutation, useQuery } from "react-query";
import { QUERY_KEYS } from "./keyQuery";
import { createGame, createUserAccount, getCurrentUser, getGameById, getGames, getWebSocketToken, searchGames, signInAccount } from "./api";
import { ILoginUser, INewUser } from "@/types";
import { toast } from "react-toastify";
import { Toast, ToastType } from "@/components/Ui/Toast";


// ============================================================
// AUTH QUERIES
// ============================================================
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: ILoginUser) =>
            signInAccount(user),
    });
};

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: () => getCurrentUser(),
    });
}

export const useGetWebSocketToken = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_WEBSOCKET_TOKEN],
        queryFn: () => getWebSocketToken(),
    });
}


// ============================================================
// GAMES QUERIES
// ============================================================
export const useCreateGame = () => {
    return useMutation(createGame, {
        onSuccess: (data) => {

        },
        onError: (err, newEvent, context) => {
          
            toast(
              <Toast type={ToastType.ERROR} message="Error when adding activity" />
            );
          },
    });
}

export const useSearchGames = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_GAMES, searchTerm],
        queryFn: () => searchGames(searchTerm),

    });
}

export const useGetGames = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAMES],
        queryFn: () => getGames(),
    });
}


export const useGetGameById = (gameId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAME_BY_ID, gameId],
        queryFn: () => getGameById(gameId),
        enabled: !!gameId,
    });
}




