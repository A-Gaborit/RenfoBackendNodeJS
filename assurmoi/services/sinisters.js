const { Sinister, Request, Document, dbInstance } = require("../models");
const { ROLES } = require("../middlewares/auth");
const formidable = require('formidable')
require('dotenv').config()
const fs = require('fs');

const getAllSinisters = async (req, res) => {    
    try {
        const { validated } = req.query;
        const user = req.user;
        let queryParam = {};
        
        if (validated !== undefined) {
            queryParam.where = {
                validated: validated === 'true'
            };
        }

        if (user.role === ROLES.POLICYHOLDER) {
            queryParam.where = {
                ...queryParam.where,
                user_id: user.id
            };
        }

        const sinisters = await Sinister.findAll(queryParam);
        
        return res.status(200).json({
            sinisters
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
        const user = req.user;
        const sinisterId = req.params.id;

        const sinister = await Sinister.findOne({
            where: { id: sinisterId },
            include: [
                { model: Document, as: 'cniDriver' },
                { model: Document, as: 'vehicleRegistrationCertificate' },
                { model: Document, as: 'insuranceCertificate' },
                { model: Request, as: 'request' }
            ]
        });

        if (!sinister) {
            return res.status(404).json({
                message: 'Sinister not found'
            });
        }

        if (user.role === ROLES.POLICYHOLDER && sinister.user_id !== user.id) {
            return res.status(403).json({
                message: 'Access denied. You can only view your own sinisters.'
            });
        }

        return res.status(200).json({
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
        const sinisterId = req.params.id;

        const existingSinister = await Sinister.findByPk(sinisterId);

        if (existingSinister.validated) return res.status(400).json({ message: "Sinister is already validated" });

        existingSinister.validated = true;
        await existingSinister.save({ transaction });

        const request = await Request.create({
            sinister_id: sinisterId,
            status: 'INITIATE'
        }, { transaction });

        await transaction.commit();
        return res.status(200).json({
            message: "Sinister validated successfully and request created",
            existingSinister,
            request
        });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            message: 'Error on sinister validation',
            stacktrace: error.errors
        });
    }
}

const setSinisterDocument = async (req, res) => {
    const { id } = req.params;
    const transaction = await dbInstance.transaction();

    try {
        const form = new formidable.IncomingForm();
        const filepath = await form.parse(req, (err, field, files) => {
            const docType = field.type[0];
            const file = files.file[0];
            if(!docType) return res.status(400).json({ message: 'Document type is required' });
            if(!file) return res.status(400).json({ message: 'File is required' });
            if (err) throw new Error(err);

            const oldpath = file.filepath;
            const filename = Date.now().toString() + '-' + files.file[0].originalFilename;
            const newpath = process.env.UPLOAD_DIR + filename;
            if(!fs.existsSync(process.env.UPLOAD_DIR)) {
                fs.mkdirSync(process.env.UPLOAD_DIR)
            }
            fs.copyFile(oldpath, newpath, async (err) => {
                if (err) throw new Error(err);

                const document = await Document.create({
                    type: docType,
                    path: filename,
                    validated: false
                }, { transaction });

                const sinister = await Sinister.findOne({ where: { id } });
                if (!sinister) return res.status(404).json({ message: 'Sinister not found' });

                const typeToFieldMap = {
                    'CNI_DRIVER': 'cni_driver',
                    'VEHICLE_REGISTRATION': 'vehicle_registration_certificate',
                    'INSURANCE_CERTIFICATE': 'insurance_certificate'
                };

                const fieldName = typeToFieldMap[docType];
                if (fieldName) {
                    sinister[fieldName] = document.id;
                    await sinister.save({ transaction });
                }

                await transaction.commit();

                res.status(201).json({
                    message: 'Success',
                    filename
                });
                res.end();
            });
        });
    } catch (err) {
        return res.status(400).json({
            message: 'Error on fileupload',
            err
        })
    }
}

const getFile = (req, res, next) => {
    if(fs.existsSync(process.env.UPLOAD_DIR + req.params.pathname)) {
        const readStream = fs.createReadStream(process.env.UPLOAD_DIR + req.params.pathname);
        readStream.pipe(res);
    } else {
        return res.status(404).json({ message: "No file found"});
    }
}

module.exports = {
    getAllSinisters,
    getSinister,
    createSinister,
    updateSinister,
    validateSinister,
    setSinisterDocument,
    getFile
}