const { Op } = require("sequelize");
const { Request, Sinister, dbInstance } = require('../models');
const { transitions } = require('../machines/request.machine');
const { ROLES } = require('../middlewares/auth');

const getAllRequests = async (req, res) => {
    try {
        let queryParam = {};
        if (req.query.status) {
            queryParam.where = {
                status: {
                    [Op.eq]: req.query.status
                }
            };
        }

        if (req.user.role === ROLES.POLICYHOLDER) {
            const userSinisters = await Sinister.findAll({
                where: { user_id: req.user.id },
            });
            const sinisterIds = userSinisters.map(s => s.id);

            queryParam.where = {
                ...queryParam.where,
                sinister_id: {
                    [Op.in]: sinisterIds
                }
            };
        }

        const requests = await Request.findAll(queryParam);
        
        return res.status(200).json({
            requests
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Error on requests',
            stacktrace: error.errors
        });
    }
};

const getRequest = async (req, res) => {  
    try {
        const request = await Request.findOne({
            where: { id: req.params.id }
        });
        
        if (!request) {
            return res.status(404).json({
                message: 'Request not found'
            });
        }

        if (req.user.role === ROLES.POLICYHOLDER) {
            const sinister = await Sinister.findOne({
                where: {
                    id: request.sinister_id,
                    user_id: req.user.id
                }
            });

            if (!sinister) {
                return res.status(403).json({
                    message: 'Access denied. You can only view your own requests.'
                });
            }
        }

        return res.status(200).json({
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

async function transitionRequest(req, res) {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const request = await Request.findOne({ where: { id: req.params.id } });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const currentState = request.status;
    const stateTransitions = transitions[currentState];

    if (!stateTransitions || !stateTransitions[status]) {
      return res.status(400).json({
        error: `Status '${status}' not allowed from state '${currentState}'`
      });
    }

    const transition = stateTransitions[status];

    if (transition.requiredFields) {
      const missingFields = transition.requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
    }

    if (transition.apply) {
      transition.apply(request, req.body);
    }

    if (transition.next) {
      request.status = transition.next;
    }

    if (transition.close) {
      request.closed = true;
      request.status = 'CLOSED';
    }

    await request.save();

    return res.status(200).json({
      message: 'Transition applied successfully',
      data: request
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}

module.exports = {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    transitionRequest
};