/**
 * Seed the database with some sample data.
 * @param {DataSource} dataSource - The data source to seed
 */

import axios from "axios";
import entreeData from "../seed-data/entrees.json";
import appetizerData from "../seed-data/appetizers.json";


export async function seedDatabase(){

    //Seed the appetizers
    const appetizerArray = appetizerData.appetizers.items;
    for(let i = 0; i < appetizerArray.length; i++){
        const appetizer = appetizerArray[i];
        const queryData = {
            query:`
                    mutation CreateAppetizer{
                        createAppetizer(data: {
                            name: "${appetizer.name}",
                            price: ${appetizer.price},
                            description: "${appetizer.description}"
                        }){
                            appetizerID,
                            name,
                            price,
                            description
                        }
                    }
                `
        }

        await axios.post("http://localhost:4000/graphql", queryData);
    };

    
    //Seed the entrees
    const entreeArray = entreeData.entrees.items;
    for(let i = 0; i < entreeArray.length; i++){
        const entree = entreeArray[i];
        const queryData = {
            query:`
                    mutation CreateEntree{
                        createEntree(data: {
                            name: "${entree.name}",
                            price: ${entree.price},
                            description: "${entree.description}"
                        }){
                            entreeID,
                            name,
                            price,
                            description
                        }
                    }
                `
        }
        await axios.post("http://localhost:4000/graphql", queryData);
    };
    
};