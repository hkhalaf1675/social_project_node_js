const { Op } = require("sequelize");
const { Post, User, Category, Rating, Comment, Section, SavedPost } = require("../models");
const { pagination } = require("../services/paginationServices");
const postsServices = require("../services/postsServices");

exports.create = async(req, res) => {
    const { title, description, categoryId, image } = req.body;
    const userId = req.user.id;

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
    const { title, description, categoryId, image } = req.body;
    const id = req.params.id;
    const userId = req.user.id;

    const response = await postsServices.update(
        id,
        userId,
        title, 
        description,
        categoryId,
        image
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
    const { id, userId, page, perPage, title, description, username, category, section } = req.query;

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
        categoryFilter['id']= category
    }

    if(section){
        categoryFilter['sectionId']= section
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
                where: categoryFilter,
                include: [
                    {
                        model: Section,
                        as: 'section'
                    }
                ]
            },
            {
                model: Rating,
                association: 'ratings'
            },
            {
                model: Comment,
                association: 'comments'
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

exports.getCurrentUserPosts = async(req, res) => {
    const { page, perPage } = req.query;
    const currentUser = req.user;
    let filter = {};
    if(currentUser){
        filter['userId'] = currentUser.id;
    }

    const query = {
        order: [
            ['createdAt', 'DESC']
        ],
        where: filter,
        include: [
            {
                model: Category,
                association: 'category'
            },
            {
                model: Rating,
                association: 'ratings'
            },
            {
                model: Comment,
                association: 'comments'
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

exports.likePost = async(req, res) => {
    const postId = req.params.postId;

    const response = await postsServices.likePost(postId);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.disLikePost = async(req, res) => {
    const postId = req.params.postId;

    const response = await postsServices.disLikePost(postId);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.savePost = async(req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    const response = await postsServices.savePost(postId, userId);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.removePostFromSaved = async(req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    const response = await postsServices.removePostFromSaved(postId, userId);

    return res.status(response.code)
    .json({ 
            success: (response.code != 200 && response.code != 201) ? false : true, 
            "message":response.message, 
            "data": response.data 
        });
}

exports.getCurrentUserSavedPosts = async(req, res) => {
    const { page, perPage } = req.query;
    const userId = req.user.id;

    const savedPosts = await SavedPost.findAll({
        where: {
            userId: userId
        }
    })

    let postsIds = [];
    for (const post of savedPosts) {
        postsIds.push(post.postId);
    }

    let filter = {};
    filter['id'] = {
        [Op.in]: postsIds
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
                model: Category,
                association: 'category',
                include: [
                    {
                        model: Section,
                        as: 'section'
                    }
                ]
            },
            {
                model: Rating,
                association: 'ratings'
            },
            {
                model: Comment,
                association: 'comments'
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