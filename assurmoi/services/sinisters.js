const { Sinister, dbInstance } = require("../models");

const getAllSinisters = async (req, res) => {
    const { validated } = req.query;
    let queryParam = {};
    
    if (validated !== undefined) {
        queryParam.where = {
            validated: validated === 'true'
        };
    }
    
    try {
        const sinisters = await Sinister.findAll(queryParam);
        
        res.status(200).json({
            sinisters,
            filters: queryParam
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error on sinisters retrieval',
            stacktrace: error.errors
        });
    }
}

const getSinister = async (req, res) => {
    try {
        const sinister = await Sinister.findOne({
            where: { id: req.params.id }
        });

        if (!sinister) {
            return res.status(404).json({
                message: 'Sinister not found'
            });
        }

        res.status(200).json({
            sinister
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error on sinister retrieval',
            stacktrace: error.errors
        });
    }
}

const createSinister = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const sinister = await Sinister.create(req.body, { transaction });
        
        transaction.commit();
        return res.status(201).json({
            message: 'Sinister created',
            sinister
        });
    } catch (error) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on sinister creation',
            stacktrace: error.errors
        });
    }
}

const updateSinister = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const sinisterBody = req.body;
        const sinister = await Sinister.update({
            sinisterBody
        }, { 
            where: { id: req.params.id }, 
            transaction 
        });

        transaction.commit();
        return res.status(200).json({
            message: 'Sinister updated',
            sinister
        });
    } catch (error) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on sinister update',
            stacktrace: error.errors
        });
    }
}

const validateSinister = async (req, res) => {    
    const transaction = await dbInstance.transaction();
    try {
        const sinister = await Sinister.update({ 
            validated: true 
        }, {
            where: { id: req.params.id },
            transaction
        });

        transaction.commit();
        return res.status(200).json({
            message: "Sinister validated successfully",
            sinister
        });
    } catch (error) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on sinister validation',
            stacktrace: error.errors
        });
    }
}

module.exports = {
    getAllSinisters,
    getSinister,
    createSinister,
    updateSinister,
    validateSinister
}