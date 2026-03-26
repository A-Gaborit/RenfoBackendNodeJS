const { Document, dbInstance } = require('../models')

const getAllDocuments = async (req, res) => {
    const queryParam = {};

    if (req.query?.validated !== undefined) {
        queryParam.where = {
            validated: validated === 'true'
        };    
    }

    const documents = await Document.findAll(queryParam);

    res.status(200).json({ 
        documents 
    })
}

const getDocument = async (req, res) => {
    const id = req.params.id;
    const document = await Document.findOne({
        where: { id },
    })

    if (!document) {
        return res.status(404).json({ 
            message: 'Document not found' 
        })
    }

    res.status(200).json({ 
        document 
    })
}

const createDocument = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { type, path, validated } = req.body

        const document = await Document.create({
            type,
            path,
            validated
        }, { transaction })

        await transaction.commit();
        return res.status(201).json({ 
            document 
        })
    } catch(err) {
        await transaction.rollback();
        return res.status(400).json({
            message: 'Error on document creation',
            stacktrace: err.errors
        })
    }
}

const validateDocument = async (req, res) => {    
    const transaction = await dbInstance.transaction();
    try {
        const document = await Document.update({ 
            validated: true 
        }, {
            where: { id: req.params.id },
            transaction
        });

        transaction.commit();
        return res.status(200).json({
            message: "Document validated successfully",
            document
        });
    } catch (error) {
        transaction.rollback();
        return res.status(400).json({
            message: 'Error on document validation',
            stacktrace: error.errors
        });
    }
}

const deleteDocument = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const document_id = req.params.id

        const status = await Document.destroy({
            where: { id: document_id },
            transaction
        })

        await transaction.commit();
        return res.status(200).json({
            message: "Successfuly deleted",
            status
        })
    } catch(err) {
        await transaction.rollback();
        return res.status(400).json({
            message: 'Error on document deletion',
            stacktrace: err.errors
        })
    }
}

module.exports = {
    getAllDocuments,
    getDocument,
    createDocument,
    validateDocument,
    deleteDocument
}