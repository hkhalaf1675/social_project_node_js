const { where, Op } = require("sequelize");
const { Post, User, Role, Rating, SavedPost } = require("../models");
const ResponseSchema = require('../schemes/ResponseSchema');

exports.create = async(title, description, image, userId, categoryId) => {
    try {
        const post = await Post.create({
            title,
            description,
            image,
            userId,
            categoryId
         });

         return new ResponseSchema(201, 'user post successfully', post);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.update = async(id, userId, title, description, categoryId) => {
    try {
        const post = await Post.findByPk(id);

        const user = await User.findByPk(userId);
        if(!user){
            return new ResponseSchema(401, 'Unauthorized user', null);
        }

        const role = await Role.findByPk(user.roleId);

        if(post.userId != userId && role.name != 'admin'){
            return new ResponseSchema(400, 'that user can not update this post', null);
        }

        await post.update({
            title,
            description,
            categoryId
        });

        return new ResponseSchema(200, 'post updated successfully', post);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.remove = async(id, userId) => {
    try {
        const post = await Post.findByPk(id);

        const user = await User.findByPk(userId);
        if(!user){
            return new ResponseSchema(401, 'Unauthorized user', null);
        }

        const role = await Role.findByPk(user.roleId);

        if(post.userId != userId && role.name != 'admin'){
            return new ResponseSchema(400, 'that user can not update this post', null);
        }

        await post.destroy();

        return new ResponseSchema(200, 'post deleted successfully', null);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.likePost = async(postId) => {
    try {
        const postRate = await Rating.findOrCreate({
            where: {
                postId: postId
            },
            defaults: { postId: postId, default: true}
        });

        await Rating.update({
            likeCount: (postRate[0].likeCount + 1)
        }, {
            where: {
                id: postRate[0].id
            }
        });

        return new ResponseSchema(200, 'post liked successfully', null);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.disLikePost = async(postId) => {
    try {
        const postRate = await Rating.findOrCreate({
            where: {
                postId: postId
            },
            defaults: { postId: postId, default: true}
        });

        await Rating.update({
            disLikeCount: (postRate[0].disLikeCount + 1)
        }, {
            where: {
                id: postRate[0].id
            }
        });

        return new ResponseSchema(200, 'post disliked successfully', null);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.savePost = async(postId, userId) => {
    try {
        const savedPost = await SavedPost.findOrCreate({
            where: {
                [Op.and]: [
                    {userId: userId},
                    {postId: postId}
                ]
            },
            defaults: {userId: userId, postId: postId, default: true}
        });

        return new ResponseSchema(200, 'post saved successfully', savedPost);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.removePostFromSaved = async(postId, userId) => {
    try {
        const savedPost = await SavedPost.findOne({
            where: {
                [Op.and]: [
                    {userId: userId},
                    {postId: postId}
                ]
            }
        });

        if(!savedPost){
            return new ResponseSchema(400, 'that user does not saved the post before', null);
        }

        await savedPost.destroy();
        return new ResponseSchema(200, 'post removed from user saved successfully', null);

    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}
