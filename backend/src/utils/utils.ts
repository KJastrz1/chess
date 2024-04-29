import { GetAllGamesRequest } from '@src/controllers/GameController';
import { User } from '@src/models/User';
import mongoose from 'mongoose';

interface QueryParams {
    [key: string]: string;
}

interface SchemaPath {
    [key: string]: {
        instance: string,
        options?: any
    };
}


export async function buildQuery(params: QueryParams, schemaPaths: SchemaPath, requestingUserElo?: number) {
    const query: { [key: string]: any } = {};
    const eloRange = 50; 
   
    if (requestingUserElo) {
        const users = await User.find({
            eloRating: { $gte: requestingUserElo - eloRange, $lte: requestingUserElo + eloRange }
        }).select('_id');
        const userIds = users.map(user => user._id);
        query['$or'] = [{ player1: { $in: userIds } }, { player2: { $in: userIds } }];
    }

    for (const key of Object.keys(params)) {
        const value = params[key];
        if (schemaPaths[key] && value !== undefined) {
            const schemaType = schemaPaths[key].instance;
            if (schemaType === 'ObjectID' && mongoose.Types.ObjectId.isValid(value)) {
                query[key] = new mongoose.Types.ObjectId(value);
            } else if (schemaType === 'Number') {
                const number = parseInt(value, 10);
                if (!isNaN(number)) {
                    query[key] = number;
                }
            } else if (schemaType === 'String') {
                query[key] = { $regex: value, $options: 'i' };
            } else {
                query[key] = value;
            }
        }
    }

    return query;
}

