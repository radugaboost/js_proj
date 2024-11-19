import userRepository from '../../core/repositories/user.js';

function isAuthenticated(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.status(401).send();
    }
}

function isNotAuthenticated(req, res, next) {
    if (!req.session.username) {
        next();
    } else {
        res.status(401).send();
    }
}

async function isAdminAuthenticated(req, res, next) {
    if (req.session.username) {
        const user = await userRepository.getById(req.session.user_id);
        if (user.is_admin){
            next();
        } else {
            res.status(403).send();
        }
    } else {
        res.status(401).send();
    }
}

export default { isAuthenticated, isNotAuthenticated, isAdminAuthenticated };