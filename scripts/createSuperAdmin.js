const { User,Role } = require("../models");
const { Op } = require("sequelize");

async function createAdmin() {
    try {
        const userRole = await Role.findOrCreate({ 
            where: {
                [Op.or]: [
                    { name: 'admin' },
                    { token: 'admin' }
                ]
            }, 
            defaults: { name: 'admin', token: 'admin', default: true}
         });

        const user = await User.findOrCreate({
            where: {
                email: 'admin@gmail.com'
            },
            defaults: {
            firstName: 'admin',
            lastName: 'admin',
            username: 'admin',
            email: 'admin@gmail.com',
            phoneNumber: '011111111',
            isActive: true,
            password: 'admin',
            roleId:userRole[0].id,
        }});

        console.log('--------');
        console.log(user);
    }
    catch(error){
        console.log(error);
    }
}

createAdmin();