import { GetGamesHistoryRequest } from '@src/controllers/GameController';
import { Game } from '@src/models/Game';
import { IUserModel, User } from '@src/models/User';
import { GameStatus, IGameHistoryItem, IGameHistoryParams, IGameParams, IPaginetedResult } from '@src/types';
import mongoose from 'mongoose';

export async function buildGamesQuery(params: IGameParams, schemaPaths: any, requestingUser: IUserModel) {

    const query: { [key: string]: any } = {};
    const eloRange = 100;

    if (requestingUser?.eloRating) {
        const eloUsers = await User.find({
            eloRating: { $gte: requestingUser.eloRating - eloRange, $lte: requestingUser.eloRating + eloRange }
        }).select('_id');
        const eloUserIds = eloUsers.map(user => user._id.toString());

        if (params.player1Username) {
            const nameUsers = await User.find({ username: { $regex: new RegExp(params.player1Username, 'i') } }).select('_id');
            const nameUserIds = nameUsers.map(user => user._id.toString());
            const combinedUserIds = eloUserIds.filter(id => nameUserIds.includes(id));
            query['player1'] = { $in: combinedUserIds };
        } else {
            query['player1'] = { $in: eloUserIds };

        }
    } else if (params.player1Username) {
        const users = await User.find({ username: { $regex: new RegExp(params.player1Username, 'i') } }).select('_id');
        const userIds = users.map(user => user._id.toString());
        query['player1'] = { $in: userIds };
    }


    for (const key of Object.keys(params) as (keyof IGameParams)[]) {
        const value = params[key];
        if (value !== undefined && key !== 'player1Username' && schemaPaths[key]) {
            const schemaType = schemaPaths[key].instance;
            switch (schemaType) {
                case 'ObjectID':
                    if (mongoose.Types.ObjectId.isValid(value)) {
                        query[key] = new mongoose.Types.ObjectId(value);
                    }
                    break;
                case 'Number':
                    const number = parseInt(value, 10);
                    if (!isNaN(number)) {
                        query[key] = number;
                    }
                    break;
                case 'String':
                    query[key] = { $regex: new RegExp(value, 'i') };
                    break;
                default:
                    query[key] = value;
            }
        }
    }
    return query;
}

export async function getGamesHistoryPaginated(req: GetGamesHistoryRequest) {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const itemsPerPage = parseInt(req.query.itemsPerPage || "20", 10);

        const query = await buildGameHistoryPaginatedQuery(req.query, Game.schema.paths, req.user);

        const totalItems = await Game.countDocuments(query);
        const games = await Game.find(query)
            .populate('player1', 'username eloRating')
            .populate('player2', 'username eloRating')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .sort({ createdAt: -1 });

        const gamesResult: IGameHistoryItem[] = games.map(game => ({
            _id: game._id.toString(),
            player1: {
                _id: game.player1,
                username: (game.player1 as IUserModel).username,
                eloRating: (game.player1 as IUserModel).eloRating,
                rankingPlace: (game.player1 as IUserModel).rankingPlace
            },
            player2: {
                _id: (game.player2 as IUserModel)._id.toString(),
                username: (game.player2 as IUserModel).username,
                eloRating: (game.player2 as IUserModel).eloRating,
                rankingPlace: (game.player2 as IUserModel).rankingPlace
            },
            winner: game.winner ? game.winner.toString() : null,
            moveTime: game.moveTime,
            createdAt: game.createdAt.toISOString(),
        }));
        const result: IPaginetedResult<IGameHistoryItem> = {
            totalItems,
            totalPages: Math.ceil(totalItems / itemsPerPage),
            currentPage: page,
            items: gamesResult
        };

        return result;
    } catch (err) {
        throw new Error(`An error occurred while retrieving game history`);
    }
};

async function buildGameHistoryPaginatedQuery(params: IGameHistoryParams, schemaPaths: any, requestingUser: IUserModel) {
    const query: { [key: string]: any } = { status: GameStatus.Finished };

    if (params.result) {
        switch (params.result) {
            case 'won':
                query['winner'] = requestingUser._id;
                break;
            case 'lost':
                query['winner'] = { $ne: requestingUser._id };
                break;
            case 'draw':
                query['winner'] = null;
                break;
        }
    }

    query['$or'] = [{ player1: requestingUser._id }, { player2: requestingUser._id }];

    if (params.opponentUsername) {
        const users = await User.find({ username: { $regex: new RegExp(params.opponentUsername, 'i') } }).select('_id');
        const userIds = users.map(user => user._id).filter(id => !id.equals(requestingUser._id));
        query['$or'] = [
            { player1: requestingUser._id, player2: { $in: userIds } },
            { player2: requestingUser._id, player1: { $in: userIds } }
        ];
    }

    for (const key of Object.keys(params) as (keyof IGameHistoryParams)[]) {
        const value = params[key];
        if (value !== undefined && !['opponentUsername', 'status', 'result', 'page', 'itemsPerPage'].includes(key) && schemaPaths[key]) {
            const schemaType = schemaPaths[key].instance;
            switch (schemaType) {
                case 'ObjectID':
                    if (mongoose.Types.ObjectId.isValid(value)) {
                        query[key] = new mongoose.Types.ObjectId(value);
                    }
                    break;
                case 'Number':
                    const number = parseInt(value, 10);
                    if (!isNaN(number)) {
                        query[key] = number;
                    }
                    break;
                case 'String':
                    query[key] = { $regex: new RegExp(value, 'i') };
                    break;
                default:
                    query[key] = value;
            }
        }
    }

    return query;
}
