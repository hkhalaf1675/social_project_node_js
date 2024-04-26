const { User,Role } = require("../models");
const { Op } = require("sequelize");
const ResponseSchema = require('../schemes/ResponseSchema');
const { createJwtToken } = require("./jwtServices");
const bcrypt = require('bcrypt');

exports.register = async(firstName, lastName, username, email, phoneNumber, bio, password) => {
    try {
        const userRole = await Role.findOrCreate({ 
            where: {
                [Op.or]: [
                    { name: 'user' },
                    { token: 'user' }
                ]
            }, 
            defaults: { name: 'user', token: 'user', default: true}
         });

        let user = await User.create({
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            isActive: false,
            password,
            bio,
            roleId:userRole[0].id,
        });
        
        user = user.toJSON();
        delete user.password;

        return new ResponseSchema(200, 'user added successfully', user);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.login = async(email, password) => {
    try {
        let user = await User.findOne({
            attributes:['id','email','password','isActive','roleId','username', 'bio', 'profilePicture'],
            where: { email }
        });

        if(!user){
            return new ResponseSchema(422, 'invalid credentials', null);
        }

        const valid = await bcrypt.compare(password, user.password);

        if(!valid){
            return new ResponseSchema(422, 'invalid credentials', null);
        }

        if(!user.isActive){
            return new ResponseSchema(422, 'user is not active', null);
        }

        const role = await Role.findByPk(user.roleId);

        const token = await createJwtToken(user, role.name);

        await user.update({
            lastLogin: Date.now()
        });

        user = user.toJSON();
        delete user.password;

        return new ResponseSchema(200, 'user successfully login', {user, token});

    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an internal error ', null);
    }
}