import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { Game } from '@/models/Game';
import { User } from '@/models/User';
import { IGame, IUser } from '@chess/types';


interface CreateGameRequest extends Request {
    user: IUser;
}
export const createGame = async (req: CreateGameRequest, res: Response): Promise<void> => {
    try {
        console.log('createGame', req.user);
        const game = new Game({
            player1: req.user._id,
        });
        console.log('createGame', game);
        await game.save();
        res.status(201).json(game);
    } catch (err:any) {
        res.status(400).json({ message: err.message });
    }
};

interface GetAllGamesRequest extends Request {
    query: {
        searchTerm?: string;
    };
}
export const getAllGames = async (req: GetAllGamesRequest, res: Response) => {
    console.log('getAllGames', req.query.searchTerm);
    try {
        let games;

        if (req.query.searchTerm) {

            const users = await User.find({
                username: { $regex: req.query.searchTerm, $options: "i" }
            }).select('_id');

            const userIds = users.map(user => user._id);

            games = await Game.find({
                player1: { $in: userIds }
            }).select('player1 moveTime')
                .populate('player1', 'username');
        } else {
            games = await Game.find()
                .select('player1 moveTime')
                .populate('player1', 'username');
        }
        console.log('getGames', games);
        res.json(games);
    } catch (err:any) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

interface GetGameByIdRequest extends Request {
    params: {
        id: string;
    };
}
export const getGameById = async (req: GetGameByIdRequest, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid game ID format' });
    }

    try {
        const game = await Game.findById(id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
};

interface UpdateGameRequest extends Request {
    game: IGame;
}
export const updateGame = async (req: UpdateGameRequest, res: Response) => {
    try {
        const game = await Game.findByIdAndUpdate(req.game._id, req.game, { new: true });
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.json(game);
    } catch (err:any) {
        res.status(400).json({ message: err.message });
    }
};

interface DeleteGameRequest extends Request {
    params: {
        id: string;
    };
}
export const deleteGame = async (req: DeleteGameRequest, res: Response) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(204).send();
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
};
