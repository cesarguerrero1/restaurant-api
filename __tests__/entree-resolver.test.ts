/**
 * Cesar Guerrero
 * 04/18/24
 * 
 * @file This file contains end to end tests for the GraphQL endpoint, specifically for the entree resolver.
 */

import express, { response } from "express";
import request from "supertest";
import {createApp, configureGraphQL} from '../src/app';
import entreeData from "../seed-data/entrees.json";
import { Entree } from "../src/models/entree";


let application: express.Express;
beforeAll(async () => {
    application = await createApp("test");
    await configureGraphQL(application);
});

//This is used at various points throughout the test suite
const getAllEntreesQuery = `
query{
    entrees{
        entreeID,
        name,
        description,
        price
    }
}`;

describe("Create Entrees using GraphQL", () => {
    const dataArray = entreeData.entrees.items;

    test("No entrees should exist in the database", async () => {
        const queryData ={
            query: getAllEntreesQuery
        };
        
        const response = await request(application).post("/graphql").send(queryData);

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.entrees).toHaveLength(0);
    });

    test("Create an entree with invalid data", async () => {
        const queryData = {
            query:`
                mutation CreateEntree{
                    createEntree(data:{}){
                        entreeID,
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

    test("Should be able to create entrees", async () => {
        //We need to use a Promise Array becuase .map() will not wait for the promises to resolve
        const promiseArray = dataArray.map(async (entree) => {
            const queryData = {
                query: `
                    mutation CreateEntree{
                        createEntree(data:{
                            name: "${entree.name}",
                            description: "${entree.description}",
                            price: ${entree.price}
                        }){
                            entreeID,
                            name,
                            price,
                            description
                        }
                    }
                `
            }
            return request(application).post("/graphql").send(queryData);
        });

        //All the promises are now resolved and we can check the responses
        const responseArray = await Promise.all(promiseArray);

        responseArray.forEach((response) => {
            expect(response.status).toBe(200);
            expect(response.body.data.createEntree).toHaveProperty("entreeID");
            expect(response.body.data.createEntree).toHaveProperty("name");
            expect(response.body.data.createEntree).toHaveProperty("price");
            expect(response.body.data.createEntree).toHaveProperty("description");
        });

        const queryData = {
            query: getAllEntreesQuery
        };

        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.data.entrees).toHaveLength(dataArray.length);
    });

});

describe("Query Entrees using GraphQL", () => {
    //This entire test suite relies on data in the database so going to grab it all now
    let entreeArray: Entree[];
    beforeAll(async () => {
        const queryData = {
            query: getAllEntreesQuery
        };

        const response = await request(application).post("/graphql").send(queryData);

        entreeArray = response.body.data.entrees;
    });

    test("Get a single entree", async () => {
        const singleEntree = entreeArray[0];
        const queryData = {
            query: `
                query GetSingleEntree{
                    entree(entreeID: ${singleEntree.entreeID}){
                        entreeID,
                        name,
                        price,
                        description
                    }
                }
            `
        };

        const response = await request(application).post("/graphql").send(queryData);
        expect(response.status).toBe(200);

        const returnedEntree = response.body.data.entree;
        expect(returnedEntree.entreeID).toBe(singleEntree.entreeID);
        expect(returnedEntree.name).toBe(singleEntree.name);
        expect(returnedEntree.description).toBe(singleEntree.description);
        expect(returnedEntree.price).toBe(singleEntree.price);
    });

    test("Invalid ID should return null", async () => {
        const queryData = {
            query: `
                query GetSingleEntree{
                    entree(entreeID: -1){
                        entreeID,
                        name,
                        price,
                        description
                    }
                }
            `
        };

        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.data.entree).toBeNull();
    });

});

describe("Deleting Entrees using GraphQL", () => {
    const queryData = {
        query: `
            mutation DeleteEntree{
                deleteEntree(entreeID: 1)
            }
        `
    };

    test("Delete an entree", async () => {
        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.data.deleteEntree).toBeTruthy();
    });

    test("Attempt to delete an invalid entree", async () => {
        const response = await request(application).post("/graphql").send(queryData);
        expect(response.body.data.deleteEntree).toBeFalsy();
    });
});