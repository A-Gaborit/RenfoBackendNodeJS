const { Op } = require('sequelize');
const { User, dbInstance } = require('../models');
const bcrypt = require('bcrypt');
require('dotenv').config();

const  getAllUsers = async (req, res) => {
    let queryParam = {};
    if(req.query?.search) {
        queryParam = {
            where: {
                firstname: {
                    [Op.like]: `%${req.query.search}%`
                }
            }
        }
    }
    const users = await User.findAll(queryParam);
    res.status(200).json({
        users
    });
}

const getUser = async (req, res) => {
    const user = await User.findOne({
        where: { id: req.params.id}
    })
    res.status(200).json({
        user
    });
}

const createUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { username, firstname, lastname, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT));
        const user = await User.create({
            username,
            firstname,
            lastname,
            email,
            password : hashedPassword
        }, { transaction });
        
        transaction.commit();
        return res.status(201).json({
            user: user.clean()
        });
    } catch (error) {
        transaction.rollback();
        return res.status(400).json({
            message: "Error on user creation",
            stacktrace: error.errors
        });
    }
}

const updateUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { username, firstname, lastname, email, password } = req.body;
        const user_id = req.params.id;

        const user = await User.findOne({
            where: { id: user_id }
        }, { transaction });
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.password = password;
        await user.save();

        await transaction.commit();
        return res.status(200).json({
            message: "Successfully updated",
            user
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            message: "Error on user update",
            stacktrace: error.errors
        });
    }
}

const deactivateUser = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const user_id = req.params.id;

        const user = await User.update({
            active: false
        }, {
            where: { id: user_id },
            transaction
        });

        await transaction.commit();
        return res.status(200).json({
            message: "Successfully deactivated",
            user
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            message: "Error on user deactivation",
            stacktrace: error.errors
        });
    }
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deactivateUser
}