import { useQuery } from "react-query";
import { QUERY_KEYS } from "./queriesKeys";
import { getGameById } from "./api";

export const useGetGameById = (gameId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GAME_BY_ID, gameId],
        queryFn: () => getGameById(gameId),
        enabled: !!gameId,
    });
}