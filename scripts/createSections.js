const { Section, Category } = require("../models");

async function createSections(){
    try {
        // enum:Movies,Tv shows,Video games,Books
        let sections = [];
        sections.push({
            name: 'Movies', 
            categories: [ 
                {name: 'Action'},
                {name: 'Drama'},
                {name: 'Fantasy'},
                {name: 'Comedy'}, 
                {name: 'Crime'},
                {name: 'Horror'}
            ]
        });

        sections.push({
            name: 'Tv shows', 
            categories: [ 
                {name: 'Action'},
                {name: 'Drama'},
                {name: 'Fantasy'},
                {name: 'Comedy'}, 
                {name: 'Crime'},
                {name: 'Horror'}
            ]
        });

        sections.push({
            name: 'Video games',
            categories: [ 
                {name: 'Fiction'},
                {name: 'Mystery'},
                {name: 'History'},
                {name: 'Historical Fiction'}, 
                {name: 'Crime'},
                {name: 'Horror'}
            ]
        });

        sections.push({
            name: 'Books',
            categories: [ 
                {name: 'Adventure'},
                {name: 'Battle royal'},
                {name: 'Role-playing game (RPG)'},
                {name: 'Sport'}, 
                {name: 'Shooter'},
                {name: 'Horror'}
            ]
        });

        const response = await Section.bulkCreate(sections, {
            include: [{ association: 'categories'}]
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

createSections();