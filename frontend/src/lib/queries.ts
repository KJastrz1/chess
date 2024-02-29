import { useMutation, useQuery } from "react-query";
import { QUERY_KEYS } from "./keyQuery";
import { createGame, getGameById } from "./api";

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
