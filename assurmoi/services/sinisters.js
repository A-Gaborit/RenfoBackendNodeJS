const { Sinister } = require("../models");

const getAllSinisters = async (req, res) => {
    const { validated } = req.query;
    
    let queryParam = {};
    
    if (validated !== undefined) {
        queryParam.where = {
            validated: validated === 'true'
        };
    }
    
    // const sinisters = await Sinister.findAll(queryParam);
    
    res.status(200).json({
        sinisters: [],
        filters: queryParam
    });
}

const getSinister = async (req, res) => {
    const sinisterId = req.params.id

    res.status(200).json({
        sinister: sinisterId
    });
}

const createSinister = async (req, res) => {
    const sinister = req.body

    return res.status(201).json({
        sinister
    });
}

const updateSinister = async (req, res) => {
    const sinisterId = req.params.id
    const sinister = req.body

    return res.status(201).json({
        id: sinisterId,
        sinister
    });
}

const validateSinister = async (req, res) => {
    const sinisterId = req.params.id;
    const { validated } = req.body;
    
    return res.status(200).json({
        message: "Sinister validated successfully",
        sinister: {
            id: sinisterId,
            validated: validated
        }
    });
}

module.exports = {
    getAllSinisters,
    getSinister,
    createSinister,
    updateSinister,
    validateSinister
}