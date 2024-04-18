/**
 * Cesar Guerrero
 * 04/17/2024
 * 
 * @file This file contains end to end tests for the GraphQL endpoint, specifically for the appetizer resolver.
 */

import express from "express";
import request from "supertest";
import {createApp, configureGraphQL} from '../src/app';
import appetizerData from "../seed-data/appetizers.json";
import { Appetizer } from "../src/models/appetizer";

let application: express.Express;
beforeAll(async () => {
    application = await createApp("test");
    await configureGraphQL(application);
});

const getAllAppetizersQuery = `
query{
    appetizers{
        appetizerID,
        name,
        description,
        price
    }
}`;

describe("Create Appetizers using GraphQL", () => {
    const dataArray = appetizerData.appetizers.items;

    test("No appetizers should exist in the database", async () => {
        const queryData ={
            query: getAllAppetizersQuery
        };
        
        const response = await request(application).post("/graphql").send(queryData);

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.appetizers).toHaveLength(0);
    });

    test("Attempting to create an appetizer with invalid data should fail", async () => {
        const queryData = {
            query: `
                    mutation CreateAppetizer{
                        createAppetizer(data: {

                        }){
                            appetizerID,
                            name,
                            price,
                            description
                        }
                    }
            `
        }
        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.errors).toBeDefined();
    });

    test("Should be able to create appetizers", async () => {

        const promiseArray = dataArray.map( async (appetizer) => {
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
            return request(application).post("/graphql").send(queryData);

        });

        const responseArray = await Promise.all(promiseArray);

        responseArray.forEach((response) => {
            expect(response.status).toBe(200);
            expect(response.body.data.createAppetizer).toHaveProperty("appetizerID");
            expect(response.body.data.createAppetizer).toHaveProperty("name");
            expect(response.body.data.createAppetizer).toHaveProperty("price");
            expect(response.body.data.createAppetizer).toHaveProperty("description");
        });


        //Call the query to get all the appetizers
        const queryData ={
            query: getAllAppetizersQuery
        };
        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.data.appetizers).toHaveLength(dataArray.length);
    });
});

describe("Querying Appetizers using GraphQL", () => {
    let appetizerArray: Appetizer[];
    beforeAll(async () => {
        //Call the query to get all the appetizers
        const queryData ={
         query: getAllAppetizersQuery
        };
        const response = await request(application).post("/graphql").send(queryData);

        appetizerArray = response.body.data.appetizers;
    });


    test("Get all appetizers then get a single appetizer using one of the IDs", async () => {

        const singleAppetizer = appetizerArray[0];

        //Now retrieve an appetizer by its ID
        const queryData2 = {
            query: `
                    query GetAppetizer{
                        appetizer(appetizerID: ${singleAppetizer.appetizerID}){
                            appetizerID,
                            name,
                            description,
                            price
                        }
                    }
                `
        }

        const response2 = await request(application).post("/graphql").send(queryData2);
        expect(response2.status).toBe(200);

        const secondAppetizer = response2.body.data.appetizer;
        expect(secondAppetizer.appetizerID).toBe(singleAppetizer.appetizerID);
        expect(secondAppetizer.name).toBe(singleAppetizer.name);
        expect(secondAppetizer.description).toBe(singleAppetizer.description);
        expect(secondAppetizer.price).toBe(singleAppetizer.price);        

    });

    test("Attempt to get an appetizer with an invalid ID", async () => {
        const queryData = {
            query: `
                    query GetAppetizer{
                        appetizer(appetizerID: 100){
                            appetizerID,
                            name,
                            description,
                            price
                        }
                    }
                `
        }

        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.data.appetizer).toBeNull();
    });


});

describe("Deleting Appetizers using GraphQL", () => {
    //We know the database is not empty and that PK 1 will exist
    const queryData = {
        query: `
                mutation DeleteAppetizer{
                    deleteAppetizer(appetizerID: 1)
                }
            `
    }

    test("Delete a valid appetizer", async () => {
        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.data.deleteAppetizer).toBeTruthy();
    });

    test("Attempt to delete an invalid appetizer", async () => {
        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.data.deleteAppetizer).toBeFalsy();
    });

});

describe("Updating Appetizers using GraphQL", () => {
    let appetizerArray: Appetizer[];
    beforeAll(async () => {
        //Call the query to get all the appetizers
        const queryData ={
         query: getAllAppetizersQuery
        };
        const response = await request(application).post("/graphql").send(queryData);

        appetizerArray = response.body.data.appetizers;
    });


    test("Update an invalid appetizer", async () => {
        const queryData = {
            query: `
                    mutation UpdateAppetizer{
                        updateAppetizer(data: {
                            appetizerID: 100,
                            name: "New Name",
                            price: 10.99,
                            description: "New Description"
                        }){
                            appetizerID,
                            name,
                            description,
                            price
                        }
                    }
            `
        };

        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.errors).toBeDefined();
    });

    test("Update an valid appetizer with valid data", async () => {
        const singleAppetizer = appetizerArray[0];
        const queryData = {
            query: `
                    mutation UpdateAppetizer{
                        updateAppetizer(data: {
                            appetizerID: ${singleAppetizer.appetizerID},
                            name: "Original Name",
                            price: 100
                        }){
                            appetizerID,
                            name,
                            description,
                            price
                        }
                    }
            `
        };

        const response = await request(application).post("/graphql").send(queryData);
        const updatedAppetizer = response.body.data.updateAppetizer;
        expect(updatedAppetizer.appetizerID).toBe(singleAppetizer.appetizerID);
        expect(updatedAppetizer.name).toBe("Original Name");
        expect(updatedAppetizer.price).toBe(100);
        expect(updatedAppetizer.description).toBe(singleAppetizer.description);
    });

    test("Update an valid appetizer with no data", async () => {
        const singleAppetizer = appetizerArray[0];
        const queryData = {
            query: `
                    mutation UpdateAppetizer{
                        updateAppetizer(data: {
                            appetizerID: ${singleAppetizer.appetizerID}
                        }){
                            appetizerID,
                            name,
                            description,
                            price
                        }
                    }
            `
        };

        const response = await request(application).post("/graphql").send(queryData);
        const updatedAppetizer = response.body.data.updateAppetizer;
        expect(updatedAppetizer.appetizerID).toBe(singleAppetizer.appetizerID);
        expect(updatedAppetizer.name).toBe("Original Name");
        expect(updatedAppetizer.price).toBe(100);
        expect(updatedAppetizer.description).toBe(singleAppetizer.description);
    });

});
