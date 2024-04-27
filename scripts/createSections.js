const { Section } = require("../models");

async function createSections(){
    try {
        // enum:Movies,Tv shows,Video games,Books
        let sections = [];
        sections.push({name: 'Movies'});
        sections.push({name: 'Tv shows'});
        sections.push({name: 'Video games'});
        sections.push({name: 'Books'});

        const response = await Section.bulkCreate(sections);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

createSections();