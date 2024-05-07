import { User } from "@src/models/User";
import { IPaginetedResult, IUserProfileResponse, IRankingParams } from "@src/types";
import mongoose, { Types } from "mongoose";


export async function updateEloRating(winnerId: Types.ObjectId, loserId: Types.ObjectId) {
    try {
        const kFactor = 32;
        const winner = await User.findById(winnerId);
        const loser = await User.findById(loserId)

        if (!winner || !loser) {
            throw new Error('One or both users not found');
        }

        const expectedScoreWinner = 1 / (1 + Math.pow(10, (loser.eloRating - winner.eloRating) / 400));
        const expectedScoreLoser = 1 / (1 + Math.pow(10, (winner.eloRating - loser.eloRating) / 400));

        winner.eloRating += kFactor * (1 - expectedScoreWinner);
        loser.eloRating += kFactor * (0 - expectedScoreLoser);

        await winner.save();
        await loser.save();

    } catch (error) {
        throw error;
    }
}

export async function getRankingPaginated(params: IRankingParams) {
    const query: { [key: string]: any } = {};

    const minEloRating = params.minEloRating ? parseInt(params.minEloRating, 10) : undefined;
    const maxEloRating = params.maxEloRating ? parseInt(params.maxEloRating, 10) : undefined;
    const page = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.itemsPerPage ? parseInt(params.itemsPerPage, 10) : 20;

    if (params.username) {
        query.username = { $regex: new RegExp(params.username, 'i') };
    }
    if (minEloRating !== undefined) {
        query.eloRating = { ...query.eloRating, $gte: minEloRating };
    }
    if (maxEloRating !== undefined) {
        query.eloRating = { ...query.eloRating, $lte: maxEloRating };
    }

    const skip = (page - 1) * itemsPerPage;

    const totalItems = await User.countDocuments(query);
    const users = await User.find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .sort({ eloRating: -1 });

    const players: IUserProfileResponse[] = users.map(user => ({
        _id: user._id.toString(),
        username: user.username,
        eloRating: user.eloRating,
        rankingPlace: user.rankingPlace
    }));

    const result: IPaginetedResult<IUserProfileResponse> = {
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        currentPage: page,
        items: players
    };

    return result;
}

export async function updateRankings() {
    try {
        const users = await User.find({}).sort({ eloRating: -1 }).exec();

        for (let i = 0; i < users.length; i++) {
            users[i].rankingPlace = i + 1;
            await users[i].save();
        }
    } catch (error) {
        console.error('Error updating user rankings:', error);
    }
}
