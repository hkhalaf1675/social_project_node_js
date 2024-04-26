const  niv  = require('node-input-validator');
const {Role} = require("../models");
const db = require("../models/index");
const {Op, Sequelize} = require("sequelize");

niv.extend('complex', async ({ value }) => {
    return /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value);
});
niv.extend('uniqueRole', async ({ value }) => {
    const role = await Role.findOne({where: {name:value}});
    return (!role)
});
niv.extend('minContent', ({ value, args }) => {
    const minLength = args[0];
    const length = value.reduce((accumulator, current) => accumulator +(current.raw_content? current.raw_content.length : 0), 0);
    return (length >= minLength);
});
niv.extend('exist', async ({ value, args }) => {
    let filter = {};
    if(args[1]) filter[args[1]] = value;
    else filter['id'] = value;
    if(args[2]) filter['language'] = args[2];
    return (await db.sequelize.models[args[0]].findOne({where:filter}))!==null;
});

niv.extend('unique', async ({ value, args }) => {
    let filter = {};
    if(args[2]){
        filter['id'] = {[Op.ne]: args[2]};
    }
    if(args[1]){
        filter[args[1]] = value;
    }
    return (await db.sequelize.models[args[0]].findOne({where:filter, paranoid: false}))===null;
});
niv.extend('maxContent', ({ value, args }) => {
    const maxLength = Number(args[0]);
    const length = value.reduce((accumulator, current) => accumulator +(current.raw_content? current.raw_content.length : 0), 0);
    return (length <= maxLength);
});

// check of array of accounts exists
niv.extend('existsArray', async({value, args}) => {
    if(value.length == 0){
        return false;
    }
    let foundModel = null;
    for (const account_id of value) {
        foundModel = await db.sequelize.models[args[0]].findByPk(account_id);
        if(foundModel !==null){
            foundModel=null;
            continue;
        }
        else{
            return false;
        }
    }
    return true;
});

niv.extend('enum', async({value, args}) => {
    return args.includes(value);
});

niv.extend('enumArray', async({value, args}) => {
    if(!Array.isArray(value)){
        return false;
    }

    for (const item of value) {
        if(!args.includes(item)){
            return false;
        }
    }

    return true;
});

const validate = async (data,validationRules,language) =>{
        niv.addCustomMessages({
            'email.required': 'Please insert your email!',
            'message.required': 'Please type your message!',
            'email.unique': 'This email has already been registered! Please enter another email!',
            'email.email': 'Please add the \'@\' sign to your email!',
            'exist': 'The :attribute Not found!',
            'password.complex': 'The password is weak!',
            'date': 'The date must be a valid date!',
            'existsArray': 'Please add array of ' + ':arg0' + 's ids that exists',
            'enum': 'the value of :attribute must be one of { :args }',
            'enumArray': 'the value of :attribute must be array and the items of it must be one of { :args }',
        }, 'en');

    const v = new niv.Validator(data, validationRules);
    const matched = await v.check();
    if (matched) return {
        matched:true,
        errors:[]
    };
    const errors = [];
    for (let key in v.errors)
        errors.push(v.errors[key]['message']);
    return {
        matched:false,
        errors
    }
};

const validation =  (validationRules,params,query) => {
    return async (req, res, next) => {
        const v = await validate(params?req.params:(query?req.query:req.body),validationRules);
        if (v.matched)
            return next();
        return res.status(422).json({ errors:v.errors, success: false });
    }
};
module.exports = {validation,validate};