const { Op } = require("sequelize");
const { Post, User, Category, Rating } = require("../models");
const { pagination } = require("../services/paginationServices");
const postsServices = require("../services/postsServices");

exports.create = async(req, res) => {
    const { title, description, categoryId } = req.body;
    let image = req.file;
    const userId = req.user.id;

    if(image){
        image = image.buffer;
    }

    const response = await postsServices.create(
        title, 
        description, 
        image,
        userId,
        categoryId
    );

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.update = async(req, res) => {
    const { title, description, categoryId } = req.body;
    const id = req.params.id;
    const userId = req.user.id;

    const response = await postsServices.update(
        id,
        userId,
        title, 
        description,
        categoryId
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
    const userId = req.user.id;

    const response = await postsServices.remove(id, userId);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.get = async(req, res) => {
    const { id, page, perPage, title, description, username, category, section } = req.query;
    const userId = req.params.userId;

    let filter = {};
    if(id){
        filter['id'] = id;
    }
    if(title){
        filter['title'] = {
            [Op.substring]: title
        };
    }
    if(description){
        filter['description'] = {
            [Op.substring]: description
        };
    }

    let userFilter = {};
    if(username){
        userFilter['username']= {
            [Op.substring]: [username]
        }
    }
    if(userId){
        userFilter['id'] = userId;
    }

    let categoryFilter = {};
    if(category){
        categoryFilter['name']= {
            [Op.substring]: [category]
        }
    }
    if(section){
        categoryFilter['section']= {
            [Op.substring]: [section]
        }
    }

    const query = {
        order: [
            ['createdAt', 'DESC']
        ],
        where: filter,
        include: [
            {
                model: User,
                association: 'user',
                where: userFilter
            },
            {
                model: Category,
                association: 'category',
                where: categoryFilter
            },
            {
                model: Rating,
                association: 'ratings'
            }
        ]
    };

    const options = {
        page,
        perPage
    };

    const response = await pagination(Post, options, query);

    return res.status(200).json(response);
}