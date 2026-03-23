const userRoutes = require('./users');

function initRoutes(app) {
    app.use('/user', userRoutes);

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