const { Op } = require("sequelize");
const {  Section } = require("../models");
const { pagination } = require("../services/paginationServices");

exports.get = async(req, res) => {
    const { id, page, perPage, name } = req.query;

    let filter = {};
    if(id){
        filter['id'] = id;
    }
    if(name){
        filter['name'] = {
            [Op.substring]: name
        };
    }

    const query = {
        order: [
            ['id', 'DESC']
        ],
        where: filter,
    };

    const options = {
        page,
        perPage
    };

    const response = await pagination(Section, options, query);

    return res.status(200).json(response);
}