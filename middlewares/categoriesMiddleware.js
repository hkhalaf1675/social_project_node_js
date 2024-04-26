const { Op } = require("sequelize");
const { Category } = require("../models");
const { pagination } = require("../services/paginationServices");
const categoriesServices = require("../services/categoriesServices");

exports.create = async(req, res) => {
    const { name, description, section } = req.body;

    const response = await categoriesServices.create(
        name, 
        description, 
        section
    );

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.update = async(req, res) => {
    const { name, description, section } = req.body;
    const id = req.params.id;

    const response = await categoriesServices.update(
        id,
        name, 
        description, 
        section
    );

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.remove = async(req, res) => {
    const id = req.params.id;

    const response = await categoriesServices.remove(id);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.get = async(req, res) => {
    const { id, page, perPage, name, section } = req.query;

    let filter = {};
    if(id){
        filter['id'] = id;
    }
    if(name){
        filter['name'] = {
            [Op.substring]: name
        };
    }
    if(section){
        filter['section'] = {
            [Op.substring]: section
        };
    }

    const query = {
        order: [
            ['id', 'DESC']
        ],
        where: filter
    };

    const options = {
        page,
        perPage
    };

    const response = await pagination(Category, options, query);

    return res.status(200).json(response);
}