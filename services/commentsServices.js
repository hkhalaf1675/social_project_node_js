const { Post, User, Role, Comment } = require("../models");
const ResponseSchema = require('../schemes/ResponseSchema');

exports.create = async(userId, postId, comment_text) => {
    try {
        const comment = await Comment.create({
            userId,
            postId,
            comment_text
         });

         return new ResponseSchema(201, 'comment post successfully', comment);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in input data', null);
    }
}

exports.update = async(id, userId, comment_text) => {
    try {
        const comment = await Comment.findByPk(id);

        const user = await User.findByPk(userId);
        if(!user){
            return new ResponseSchema(401, 'Unauthorized user', null);
        }

        const role = await Role.findByPk(user.roleId);

        if(comment.userId != userId && role.name != 'admin'){
            return new ResponseSchema(400, 'that user can not update this comment', null);
        }

        await comment.update({
            comment_text
        });

        return new ResponseSchema(200, 'comment updated successfully', comment);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in input data', null);
    }
}

exports.remove = async(id, userId) => {
    try {
        const comment = await Comment.findByPk(id);

        const user = await User.findByPk(userId);
        if(!user){
            return new ResponseSchema(401, 'Unauthorized user', null);
        }

        const role = await Role.findByPk(user.roleId);

        if(comment.userId != userId && role.name != 'admin'){
            return new ResponseSchema(400, 'that user can not update this comment', null);
        }

        await comment.destroy();

        return new ResponseSchema(200, 'comment deleted successfully', null);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in input data', null);
    }
}
