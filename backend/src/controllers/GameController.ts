import { Response } from 'express';
import mongoose from 'mongoose';
import { Game } from '@src/models/Game';
import { IGameResponse, IGameHistoryParams, IGameParams } from '@src/types/index';
import { AuthenticatedRequest } from '@src/types/express';
import { buildGamesQuery, getGamesHistoryPaginated, getGamesPagineted } from '@src/services/GameService';

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

export interface GetGamesRequest extends AuthenticatedRequest {
    query: IGameParams;
}
export const getGames = async (req: GetGamesRequest, res: Response): Promise<void> => {
    try {
        const games = await getGamesPagineted(req);      
       
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
    game: IGameResponse;
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

export interface GetGamesHistoryRequest extends AuthenticatedRequest {
    query: IGameHistoryParams;
}
export const getGamesHistory = async (req: GetGamesHistoryRequest, res: Response): Promise<void> => {
    try {
        const games = await getGamesHistoryPaginated(req);    

        console.log("games", games.items.length);
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};