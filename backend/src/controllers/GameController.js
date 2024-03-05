const express = require('express');
const Game = require('../models/Game');
const { initialBoard } = require('../consts/chessPieces');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

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
    try {
        const games = await Game.find();
        console.log(games);
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
