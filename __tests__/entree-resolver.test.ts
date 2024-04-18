/**
 * Cesar Guerrero
 * 04/18/24
 * 
 * @file This file contains end to end tests for the GraphQL endpoint, specifically for the entree resolver.
 */

import express from "express";
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

});