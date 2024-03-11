const express = require('express');
const Game = require('../models/Game');
const { initialBoard } = require('../consts/chessPieces');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.createGame = async (req, res) => {
    try {

        const game = new Game({
            board: initialBoard,
        });
        await game.save();

        res.status(201).json(game);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllGames = async (req, res) => {
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
            }).populate('player1', 'username')
                .populate('player2', 'username');
        } else {
            games = await Game.find()
                .populate('player1', 'username')
                .populate('player2', 'username');
        }
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getGameById = async (req, res) => {
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
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.json(game);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
