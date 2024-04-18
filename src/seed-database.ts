/**
 * Seed the database with some sample data.
 * @param {DataSource} dataSource - The data source to seed
 */

import axios from "axios";
import entreeData from "../seed-data/entrees.json";
import appetizerData from "../seed-data/appetizers.json";
import enchiladaData from "../seed-data/enchiladas.json";
import enchiladaPriceData from "../seed-data/enchilada-prices.json";


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

    //The enchilada prices need to be created BEFORE the enchiladas
    const enchiladaPriceArray = enchiladaPriceData.enchiladaPrices.items;
    const priceQueryData = {
        query:`
                mutation CreateEnchiladaPrice{
                    createEnchiladaPrice(data: {
                        priceForOne: ${enchiladaPriceArray[0].price},
                        priceForTwo: ${enchiladaPriceArray[1].price},
                        priceForThree: ${enchiladaPriceArray[2].price}
                    }){
                        enchiladaPriceID,
                        priceForOne,
                        priceForTwo,
                        priceForThree
                    }
                }
            `
    }
    await axios.post("http://localhost:4000/graphql", priceQueryData);

    //Seed the enchiladas
    const enchiladaArray = enchiladaData.enchiladas.items;
    for(let i = 0; i < enchiladaArray.length; i++){
        const enchilada = enchiladaArray[i];
        //Notice that we are hardcoding the enchiladaPriceID to 1 as we only have one price row in the database
        const queryData = {
            query:`
                    mutation CreateEnchilada{
                        createEnchilada(data: {
                            name: "${enchilada.name}",
                            description: "${enchilada.description}",
                            enchiladaPriceID: 1
                        }){
                            enchiladaID,
                            name,
                            enchiladaPrice{
                                enchiladaPriceID,
                                priceForOne,
                                priceForTwo,
                                priceForThree
                            }
                        }
                    }
                `
        }
        const result = await axios.post("http://localhost:4000/graphql", queryData);
    };
};