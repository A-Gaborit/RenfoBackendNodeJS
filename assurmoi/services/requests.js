const { Op } = require("sequelize");
const { Request, Sinister, dbInstance } = require('../models');
const { transitions, isValidTransition, getNextState, getAvailableTransitions } = require('../machines/request.machine');
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
  const transaction = await dbInstance.transaction();
  try {
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    const request = await Request.findOne({ 
      where: { id: req.params.id },
      transaction 
    });

    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Request not found' });
    }

    const currentState = request.status;    
    if (!isValidTransition(currentState, action, request, req.body)) {
      await transaction.rollback();
      return res.status(400).json({
        error: `Action '${action}' not allowed from state '${currentState}' or conditions not met`
      });
    }

    const transition = transitions[currentState][action];
    if (transition.requiredFields) {
      const missingFields = transition.requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);
      
      if (missingFields.length > 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
    }

    if (transition.condition) {
      const conditionMet = transition.condition(request, req.body);
      if (!conditionMet) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Conditions for transition '${action}' not met`
        });
      }
    }

    if (transition.apply) {
      transition.apply(request, req.body);
    }

    const nextState = getNextState(currentState, action);
    if (nextState) request.status = nextState;

    if (transition.close) {
      request.closed = true;
      request.status = 'CLOSED';
    }

    await request.save({ transaction });
    await transaction.commit();

    return res.status(200).json({
      message: 'Transition applied successfully',
      data: request
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}

async function getRequestTransitions(req, res) {
  try {
    const request = await Request.findOne({ where: { id: req.params.id } });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const availableTransitions = getAvailableTransitions(request.status, request);

    return res.status(200).json({
      currentState: request.status,
      availableActions: availableTransitions
        .filter(t => t.available)
        .map(t => ({
          action: t.action,
          nextState: t.next,
          requiredFields: t.requiredFields || [],
          close: t.close || false
        }))
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}

module.exports = {
    getAllRequests,
    getRequest,
    createRequest,
    updateRequest,
    transitionRequest,
    getRequestTransitions
};