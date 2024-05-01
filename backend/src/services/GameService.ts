import { IUserModel, User } from '@src/models/User';
import { GameStatus, IGameHistoryParams, IGameParams } from '@src/types';
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

    console.log("query", query)
    return query;
}

export async function buildGameHistoryQuery(params: IGameHistoryParams, schemaPaths: any, requestingUser: IUserModel) {
    console.log(params)
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
        console.log(userIds);


        query['$or'] = [
            { player1: requestingUser._id, player2: { $in: userIds } },
            { player2: requestingUser._id, player1: { $in: userIds } }
        ];

    }

    for (const key of Object.keys(params) as (keyof IGameHistoryParams)[]) {
        const value = params[key];
        if (value !== undefined && !['opponentUsername', 'status', 'result'].includes(key) && schemaPaths[key]) {
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

    console.log("Game History Query", query);
    return query;
}
