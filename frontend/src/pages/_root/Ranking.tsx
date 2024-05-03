import React, { useState } from "react";
import { useGetRanking } from "../../lib/queries";
import Input from "@/components/Ui/Input";
import Loader from "@/components/Ui/Loader";
import Button from "@/components/Ui/Button";
import { IRankingParamsFrontend, IUserProfileResponse } from "@/types";
import PageButtons from "@/components/Ui/PageButtons";
import { FaTrophy } from "react-icons/fa";

const Ranking = () => {

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
    };

    return (
        <div className="flex flex-col w-full items-center p-4 gap-8">
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
                <Loader />
            ) : rankingQuery.data ? (
                <>
                    <div className="flex justify-center">
                        <PageButtons
                            page={rankingQuery.data.currentPage || 1}
                            totalPages={rankingQuery.data.totalPages || 1}
                            setPage={setPage} />
                    </div>

                    <table className="w-[80%] md:w-[70%] divide-y">
                        <thead>
                            <tr className="border-y border-gray-800 dark:border-gray-200">
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Place</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ELO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rankingQuery.data.items.map((player: IUserProfileResponse) => (
                                <tr key={player._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium items-center">
                                        <div className="flex flex-row gap-2 items-center">
                                            {player.rankingPlace && (
                                                <>
                                                    {player.rankingPlace}
                                                    {player.rankingPlace <= 3 && (
                                                        <FaTrophy className={`ml-2 text-${player.rankingPlace === 1 ? 'gold' : player.rankingPlace === 2 ? 'silver' : 'bronze'}-400`} />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm ">{player.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm ">{Math.floor(player.eloRating)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </>
            ) : null}
        </div>
    );
};

export default Ranking;
