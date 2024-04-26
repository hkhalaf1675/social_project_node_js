const { decode } = require('jsonwebtoken');
const { User, Role } = require('../models');
const ResponseSchema = require('../schemes/ResponseSchema');
const { Op } = require('sequelize');

async function checkAuth(roleNames, token){
    if (!token) {
        return new ResponseSchema(401, 'A token is required for authentication!', null);
    }
    
    try {
        token = token.split(' ')[1] ?? token;

        const decoded = decode(token);

        const user = await User.findOne({where: {
            email: decoded.user.email
        }});

        if(!user){
            return new ResponseSchema(401, 'Unauthorized!', null);
        }

        const roles = await Role.findAll({
            where: {
                name: {
                    [Op.or]: [roleNames]
                }
            }
        });

        if(!roles){
            return new ResponseSchema(401, 'Unauthorized!', null);
        }

        if(roles.some(r => r.id == user.roleId)){
            return new ResponseSchema(200, 'authorized user', null);
        }
        else{
            return new ResponseSchema(401, 'Unauthorized!', null);
        }
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, ' there is an internal error', null);
    }
}

exports.adminAuth = async(req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    
    const response = await checkAuth(['admin'], token);

    if(response.code == 200){
        next();
    }
    else{
        return res.status(response.code).json({success: false, message: response.message});
    }
}

exports.userAuth = async(req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    
    const response = await checkAuth(['user', 'admin'], token);

    if(response.code == 200){
        next();
    }
    else{
        return res.status(response.code).json({success: false, message: response.message});
    }
}