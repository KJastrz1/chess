import React, { useState } from "react";
import { useGetRanking } from "../../lib/queries";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Ui/Input";
import Loader from "@/components/Ui/Loader";
import Button from "@/components/Ui/Button";
import { IRankingParamsFrontend, IUserProfileResponse } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import PageButtons from "@/components/Ui/PageButtons";

const Ranking = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [tempParams, setTempParams] = useState<IRankingParamsFrontend>({ page: 1, itemsPerPage: 20 });
    const [params, setParams] = useState<IRankingParamsFrontend>({ page: 1, itemsPerPage: 20 });
    const rankingQuery = useGetRanking(params);

    const handleSearchChange = (newParams: Partial<IRankingParamsFrontend>) => {
        setTempParams(prev => ({ ...prev, ...newParams }));
    };

    const handleSearch = () => {
        setParams(tempParams);
    };

    const setPage = (page: number) => {
        handleSearchChange({ page });
    }
    console.log("ranking data", rankingQuery.data)

    return (
        <div className="flex flex-col items-center p-4 gap-4">
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Username"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange({ username: e.target.value })}
                />
                <div className="flex flex-row items-center gap-2 md:gap-4">
                    <Input
                        type='number'
                        placeholder="Min ELO"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange({ minEloRating: e.target.value })} />
                    <Input
                        type="number"
                        placeholder="Max ELO"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange({ maxEloRating: e.target.value })} />
                </div>

                <Button onClick={handleSearch}>Search</Button>
            </div>


            {rankingQuery.isLoading ? (
                <div className="flex w-full h-full p-10 justify-center items-center">
                    <Loader />
                </div>
            ) : rankingQuery.data ? (
                <div className="w-full md:p-10">
                    <div className="flex justify-center mb-4">
                        <PageButtons
                            page={rankingQuery.data?.currentPage || 1}
                            totalPages={rankingQuery.data?.totalPages || 1}
                            setPage={setPage} />
                    </div>
                    {rankingQuery.data.items.map((player: IUserProfileResponse) => (
                        <div key={player._id} className="grid grid-cols-3 items-center border-b border-gray-800 dark:border-gray-200 p-4">
                            <span className="justify-self-start font-semibold">{player.username}</span>
                            <span className="justify-self-start font-semibold"> {Math.floor(player.eloRating)}</span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default Ranking;
