const { Op } = require("sequelize");
const { Request, dbInstance } = require('../models');

const getAllRequests = async (req, res) => {    
    let queryParam = {};
    
    if (req.query.status) {
        queryParam.where = {
            status: {
                [Op.eq]: req.query.status
            }
        };
    }
    
    try {
        const requests = await Request.findAll(queryParam);
        
        res.status(200).json({
            requests,
            filters: queryParam
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Error on requests',
            stacktrace: error.errors
        });
    }
};

const getRequest = async (req, res) => {
    const id = req.params.id;
    
    try {
        const request = await Request.findOne({
            where: { id }
        });
        
        if (!request) {
            return res.status(404).json({
                message: 'Request not found'
            });
        }
        
        res.status(200).json({
            request
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Error on request',
            stacktrace: error.errors
        });
    }
};

const createRequest = async (req, res) => {
    const transaction = await dbInstance.transaction();

    try {
        const request = await Request.create(req.body, {transaction});

        transaction.commit();
        return res.status(201).json({
            message: 'Request created',
            request
        });
    } catch (error) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on request creation',
            stacktrace: error.errors
        });
    }
};

const updateRequest = async (req, res) => {
    const transaction = await dbInstance.transaction();
    
    try {
        const requestBody = req.body;

        const request = await Request.update({
            requestBody
        }, { 
            where: { id: req.params.id }, 
            transaction 
        });
        
        transaction.commit();
        return res.status(200).json({
            message: 'Successfully updated',
            request
        });
    } catch (error) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on request update',
            stacktrace: error.errors
        });
    }
};

module.exports = {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest
};