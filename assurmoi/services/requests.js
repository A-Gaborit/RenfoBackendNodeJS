const { Op } = require("sequelize");
const { Request } = require('../models');

const getAllRequests = async (req, res) => {    
    let queryParam = {};
    
    if (req.query.status) {
        queryParam.where = {
            status: {
                [Op.eq]: req.query.status
            }
        };
    }
    
    const requests = await Request.findAll(queryParam);
    
    res.status(200).json({
        requests: [],
        filters: queryParam
    });
};

const getRequest = async (req, res) => {
    const id = req.params.id;
    
    return res.status(200).json({
        request: { id }
    });
};

const createRequest = async (req, res) => {
    const data = req.body;
    
    if (!data.sinister_id) {
        return res.status(400).json({
            message: 'sinister_id required'
        });
    }

    return res.status(201).json({
        message: 'Request created',
        request: data
    });
};


const updateRequest = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    
    return res.status(200).json({
        message: 'Request updated',
        request: {
            id,
            ...data
        }
    });
};

module.exports = {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest
};