const { User,Role } = require("../models");
const { Op } = require("sequelize");
const ResponseSchema = require('../schemes/ResponseSchema');

exports.create = async(role, firstName, lastName, username, email, phoneNumber, isActive, bio, password) => {
    try {
        const userRole = await Role.findOrCreate({ 
            where: {
                [Op.or]: [
                    { name: role }
                ]
            }, 
            defaults: { name: role, token: role.replace(/ /g, "_"), default: true}
         });

         const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            isActive: isActive,
            password,
            bio,
            roleId:userRole[0].id,
         });

         return new ResponseSchema(201, 'user added successfully', user);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.update = async(id, email, username, firstName, lastName, password, bio, phoneNumber) => {
    try {
        const user = await User.findByPk(id);

        if(email){
            const oldUser = await User.findOne({
                where: {
                    email: email
                }
            });

            if(oldUser && oldUser.id !== user.id){
                return new ResponseSchema(500, 'there is already user with that email', null);
            }
        }

        if(phoneNumber){
            const oldUser = await User.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            });

            if(oldUser && oldUser.id !== user.id){
                return new ResponseSchema(500, 'there is already user with that phone number', null);
            }
        }

        await user.update({
            username,
            firstName,
            lastName,
            email,
            password,
            bio,
            phoneNumber
        });

        return new ResponseSchema(200, 'user updated successfully', user);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.activateUser = async(id) => {
    try {
        const user = await User.findByPk(id);

        await user.update({
            isActive: true
        });

        return new ResponseSchema(200, 'user updated successfully', user);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.blockUser = async(id) => {
    try {
        const user = await User.findByPk(id);

        await user.update({
            isActive: false
        });

        return new ResponseSchema(200, 'user updated successfully', user);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.remove = async(id) => {
    try {
        await User.destroy({
            where: {
                id: id
            }
        });

        return new ResponseSchema(200, 'user deleted successfully', null);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}