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
    const currentUserId = req.user.id;

    const response = await usersServices.update(
        currentUserId,
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
                attributes: ['name'],
                where: (role) ? {name: {[Op.substring]: [role]}} : {}
            }
        ]
    };

    const options = {
        page,
        perPage
    };

    const response = await pagination(User, options, query);

    return res.status(200).json(response);
}

exports.changeProfilePicture = async(req, res) => {
    const fileData = req.file;
    const id = req.params.id;
    const currentUserId = req.user.id;

    const currentUser = await User.findByPk(currentUserId);
    if(!currentUser){
        return res.status(401).json({success: false, message: 'Unauthorized user'});
    }

    const role = await Role.findByPk(currentUser.roleId);

    if(currentUser.id != id && role.name != 'admin'){
        return res.status(401).json({success: false, message: 'that user can not update that account'});
    }

    if(!fileData){
        return res.status(400).json({success: false, message: 'Please upload the picture'});
    }

    const user = await User.findByPk(id);

    await user.update({
        profilePicture : fileData.buffer
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