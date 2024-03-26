import {  Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Game } from '../models/Game';
import { IGame } from '../types/index';
import { AuthenticatedRequest } from '@src/types/express';

export const createGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {       
        const game = new Game({
            player1: req.user._id,
        });

        await game.save();
        res.status(201).json(game);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export interface GetAllGamesRequest extends AuthenticatedRequest {
    query: {
        searchTerm?: string;
    };
}
export const getAllGames = async (req: GetAllGamesRequest, res: Response): Promise<void> => {
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
        res.json(games);
    } catch (err: any) {
        res.status(500).send('Server Error');
    }
};

export interface GetGameByIdRequest extends AuthenticatedRequest {
    params: {
        id: string;
    };
}
export const getGameById = async (req: GetGameByIdRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid game ID format' });
        return;
    }
    try {
        const game = await Game.findById(id);
        if (!game) {
            res.status(404).json({ message: 'Game not found' });
            return;
        }
        res.json(game);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export interface UpdateGameRequest extends AuthenticatedRequest {
    game: IGame;
}
export const updateGame = async (req: UpdateGameRequest, res: Response): Promise<void> => {
    try {
        const game = await Game.findByIdAndUpdate(req.game._id, req.game, { new: true });
        if (!game) {
            res.status(404).json({ message: 'Game not found' });
            return
        }
        res.json(game);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export interface DeleteGameRequest extends AuthenticatedRequest {
    params: {
        id: string;
    };
}
export const deleteGame = async (req: DeleteGameRequest, res: Response): Promise<void> => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) {
            res.status(404).json({ message: 'Game not found' });
            return
        }
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
