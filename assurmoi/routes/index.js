const userRoutes = require('./users');
const authRoutes = require('./auth');
const sinisterRoutes = require('./sinisters');
const requestRoutes = require('./requests')
const documentRoutes = require('./documents')

function initRoutes(app) {
    app.use('/user', userRoutes);
    app.use('/auth', authRoutes);
    app.use('/sinister', sinisterRoutes);
    app.use('/request', requestRoutes);
    app.use('/document', documentRoutes);

    app.use('/', (req, res, next) => {
        // Middleware
        console.log("middleware 1 homepage");
        next();
    }, (req, res, next) => {
        // controller
        console.log("controller 1 homepage");
        res.status(200).json({ 
            message: "Bienvenue sur la route d'accueil" 
        });
    });
}

module.exports = initRoutes;