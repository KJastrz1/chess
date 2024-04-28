import { Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Game } from '../models/Game';
import { IGame } from '../types/index';
import { AuthenticatedRequest } from '@src/types/express';
import { buildQuery } from '@src/utils/utils';

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
        player1?: string;
        player2?: string;
        status?: string;
        moveTime?: string;
        winner?: string;
        player1Username?: string;
    };
}

export const getAllGames = async (req: GetAllGamesRequest, res: Response): Promise<void> => {
    console.log("query", req.query);
    try {
        const query = buildQuery(req.query, Game.schema.paths);

        const games = await Game.find(query)
            .populate('player1', 'username')
            .populate('player2', 'username');
        console.log("games", games.length);
        res.json(games);
    } catch (err) {
        console.error(err);
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
        const game = await Game.findById(id)
            .populate('player1', 'username')
            .populate('player2', 'username');
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
