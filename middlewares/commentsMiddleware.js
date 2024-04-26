const { Op } = require("sequelize");
const { Post, User, Category, Rating, Comment } = require("../models");
const { pagination } = require("../services/paginationServices");
const commentsServices = require("../services/commentsServices");

exports.create = async(req, res) => {
    const { postId, comment_text } = req.body;
    const userId = req.user.id;

    const response = await commentsServices.create(
        userId, 
        postId, 
        comment_text
    );

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.update = async(req, res) => {
    const { comment_text } = req.body;
    const id = req.params.id;
    const userId = req.user.id;

    const response = await commentsServices.update(
        id,
        userId
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

    const response = await commentsServices.remove(
        id, 
        userId
    );

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.get = async(req, res) => {
    const { id, page, perPage, postId, userId } = req.query;

    let filter = {};
    if(id){
        filter['id'] = id;
    }
    if(postId){
        filter['postId'] = postId
    }
    if(userId){
        filter['userId'] = userId
    }

    const query = {
        order: [
            ['createdAt', 'DESC']
        ],
        where: filter,
        include: [
            {
                model: User,
                association: 'user'
            },
            {
                model: Post,
                association: 'post',
            }
        ]
    };

    const options = {
        page,
        perPage
    };

    const response = await pagination(Comment, options, query);

    return res.status(200).json(response);
}