import { useMutation, useQuery } from "react-query";
import { QUERY_KEYS } from "./keyQuery";
import { createGame, createUserAccount, getGameById, signInAccount } from "./api";
import { INewUser } from "../types/types";

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
        mutationFn: (user: { email: string; password: string }) =>
            signInAccount(user),
    });
};


// ============================================================
// GAMES QUERIES
// ============================================================
export const useCreateGame = () => {
    return useMutation(createGame, {
        onSuccess: (data) => {

        },
    });
}

export const useGetGameById = (gameId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAME_BY_ID, gameId],
        queryFn: () => getGameById(gameId),
        enabled: !!gameId,
    });
}




