const { Category } = require("../models");
const ResponseSchema = require('../schemes/ResponseSchema');

exports.create = async(name, description, section) => {
    try {
         const category = await Category.create({
            name,
            description,
            section
         });

         return new ResponseSchema(201, 'user category successfully', category);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.update = async(id, name, description, section) => {
    try {
        const category = await Category.findByPk(id);

        await category.update({
            name,
            description,
            section
        });

        return new ResponseSchema(200, 'category updated successfully', category);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}

exports.remove = async(id) => {
    try {
        await Category.destroy({
            where: {
                id: id
            }
        });

        return new ResponseSchema(200, 'Category deleted successfully', null);
    } catch (error) {
        console.log(error);
        return new ResponseSchema(500, 'there is an error in saving data', null);
    }
}