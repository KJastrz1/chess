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

export function buildQuery(params: QueryParams, schemaPaths: SchemaPath) {
    const query: { [key: string]: any } = {};
    Object.keys(params).forEach(async key => {
        if (key === 'player1Username' && params[key]) {
            const users = await User.find({
                username: { $regex: params[key], $options: 'i' }
            }).select('_id');
            query['player1'] = { $in: users.map(user => user._id) };
        } else if (schemaPaths[key]) {
            const value = params[key];
            const schemaType = schemaPaths[key].instance;

            if (schemaType === 'ObjectID' && mongoose.Types.ObjectId.isValid(value)) {
                query[key] = new mongoose.Types.ObjectId(value);
            } else if (schemaType === 'Number') {
                const number = parseInt(value, 10);
                if (!isNaN(number)) query[key] = number;
            } else if (schemaType === 'String') {
                query[key] = { $regex: value, $options: 'i' };
            } else {
                query[key] = value;
            }
        }
    });
    return query;
}

