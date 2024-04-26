const { Op } = require("sequelize");
const { User, Role } = require("../models");
const { pagination } = require("../services/paginationServices");
const usersServices = require("../services/usersServices");

exports.create = async(req, res) => {
    const { username,email, password, firstName, lastName, phoneNumber, bio, role, isActive } = req.body;

    const response = await usersServices.create(
        role, 
        firstName, 
        lastName, 
        username,
        email,
        phoneNumber,
        isActive,
        bio,
        password
    );

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.update = async(req, res) => {
    const { username,email, password, firstName, lastName, phoneNumber, bio} = req.body;
    const id = req.params.id;

    const response = await usersServices.update(
        id,
        email,
        username,
        firstName,
        lastName,
        password,
        bio,
        phoneNumber
    );

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.activateUser = async(req, res) => {
    const id = req.params.id;

    const response = await usersServices.activateUser(id);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.blockUser = async(req, res) => {
    const id = req.params.id;

    const response = await usersServices.blockUser(id);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.get = async(req, res) => {
    const { id, page, perPage, email, username, firstName, lastName, role , active } = req.query;

    let filter = {};
    if(id){
        filter['id'] = id;
    }
    if(email){
        filter['email'] = {
            [Op.substring]: email
        };
    }
    if(username){
        filter['username'] = {
            [Op.substring]: username
        };
    }
    if(firstName){
        filter['firstName'] = {
            [Op.substring]: firstName
        };
    }
    if(lastName){
        filter['lastName'] = {
            [Op.substring]: lastName
        };
    }
    if(active){
        filter['isActive'] = (active == 0) ? false : true;
    }

    const query = {
        order: [
            ['id', 'DESC']
        ],
        where: filter,
        include: [
            {
                model: Role,
                association: 'role',
                where: (role) ? {name: {[Op.substring]: [role]}} : {}
            }
        ]
    };

    const options = {
        page,
        perPage,
        lists: 'users'
    };

    const response = await pagination(User, options, query);

    return res.status(200).json(response);
}

exports.changeProfilePicture = async(req, res) => {
    const fileData = req.file;
    const id = req.params.id;

    if(!fileData){
        return res.status(400).json({success: false, message: 'Please upload the picture'});
    }

    const user = await User.findByPk(id);

    await user.update({
        profilePicture : fileData
    });

    return res.status(200).json({success: true, message: 'picture uploaded successfully', data: user});

}

exports.remove = async(req, res) => {
    const id = req.params.id;

    const response = await usersServices.remove(id);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}