import { IUserModel, User } from '@src/models/User';
import { GameStatus, IGameParams } from '@src/types';
import mongoose from 'mongoose';

export async function buildGamesQuery(params: IGameParams, schemaPaths: any, requestingUser: IUserModel) {

    const query: { [key: string]: any } = {};
    const eloRange = 100;

    if (requestingUser && params.status === GameStatus.Finished) {
        query['$or'] = [
            { player1: requestingUser._id },
            { player2: requestingUser._id }
        ];
    }

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



