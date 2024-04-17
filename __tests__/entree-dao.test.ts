/**
 * Cesar Guerrero
 * 04/17/2024
 * 
 * @file Integration test for the EntreeDAO against our SQLite database in memory
 */

import { testDataSource } from "../src/data-source";
import EntreeDAO from "../src/daos/entree-dao";
import entreeData from "../seed-data/entrees.json";

let entreeDAO: EntreeDAO;
beforeAll(async () => {
    //Create our database connection
    const dataSource = testDataSource();
    await dataSource.initialize();
    entreeDAO = new EntreeDAO(dataSource);
});

describe("Testing EntreeDAO methods", () => {
    //Since the same database connection is going to be used we want to make sure it is clear after all these tests
    afterAll(async () => {
        await entreeDAO.deleteAllEntrees();
    });

    //Valid data object
    const data = {
        name: "Test Entree",
        description: "Test Description",
        price: 10.99
    };

    test("Retrieve all rows from an empty table", async () => {
        expect(await entreeDAO.getAllEntrees()).toHaveLength(0);
    });

    test("Create a new valid entree in the database", async () => {

        const result = await entreeDAO.createEntree(data);
        expect(result.entreeID).toBe(1);
        expect(result.name).toBe(data.name);
        expect(result.description).toBe(data.description);
        expect(result.price).toBe(data.price);

        //The database should no longer be empty
        expect(await entreeDAO.getAllEntrees()).toHaveLength(1);
    });

    test("Attempt to create an entree with a negative price", async () => {
        const data = {
            name: "Test Entree",
            description: "Test Description",
            price: -1
        };

        await expect(entreeDAO.createEntree(data)).rejects.toThrow();
    });

    test("Attempt to create an entree with the same PK as an existing row", async () => {
        const data = {
            entreeID: 1,
            name: "Test Entree",
            description: "Test Description",
            price: 10.99
        };
        
        await expect(entreeDAO.createEntree(data)).rejects.toThrow();

    });

    test("Retrieve an entree by a valid PK", async () => {
        const result = await entreeDAO.getEntreeByID(1);
        expect(result).not.toBeNull();

        expect(result?.entreeID).toBe(1);
        expect(result?.name).toBe(data.name);
        expect(result?.description).toBe(data.description);
        expect(result?.price).toBe(data.price);
    });

    test("Attempt to retrieve an entree by an invalid PK", async () => {
        const result = await entreeDAO.getEntreeByID(2);
        expect(result).toBeNull();
    });

    test("Updating a non-extistent row in the table", async () => {
        const data = {
            entreeID: 10,
            name: "Test Entree",
            description: "Test Description",
            price: 10.99
        };

        await expect(entreeDAO.updateEntreeById(data)).rejects.toThrow();
    });

    test("Updating an existing entree with a negative price", async () => {
        const data = {
            entreeID: 1,
            name: "Test Entree",
            description: "Test Description",
            price: -1
        };

        await expect(entreeDAO.updateEntreeById(data)).rejects.toThrow();
    });

    test("Update an existing entree in the table", async () => {
        const newData = {
            ...data,
            entreeID: 1,
            description: "The description should now be different"
        };

        await entreeDAO.updateEntreeById(newData);
        const result = await entreeDAO.getEntreeByID(newData.entreeID);

        expect(result).not.toBeNull();
        expect(result?.entreeID).toBe(newData.entreeID);
        expect(result?.name).toBe(newData.name);
        expect(result?.description).toBe(newData.description);
        expect(result?.price).toBe(newData.price);
    });

    test("Deleting an existing row in the table", async () => {
        await entreeDAO.deleteEntreeById(1);
        expect(await entreeDAO.getAllEntrees()).toHaveLength(0);
    });

    test("Deleting a non-existent row in the table", async () => {
        await expect(entreeDAO.deleteEntreeById(1)).rejects.toThrow();
    });
});

describe("Testing all the EntreeDAO methods with multiple rows", () => {
    const dataArray = entreeData.entrees.items;

    test("The database should be empty", async () => {
        expect(await entreeDAO.getAllEntrees()).toHaveLength(0);
    });

    test("Create multiple rows in the database", async () => {
        //Since creating rows is promise-based we need to use Promise.all
        await Promise.all(dataArray.map(async (entree) => {
            await entreeDAO.createEntree(entree);
        }));

        expect(await entreeDAO.getAllEntrees()).toHaveLength(dataArray.length);
    });

    test("Updating one of the rows in the database", async () => {
        const data = dataArray[0];
        const newData = {
            ...data,
            entreeID: 2,
            description: "The description should now be different"
        }

        await entreeDAO.updateEntreeById(newData);
        const result = await entreeDAO.getEntreeByID(newData.entreeID);

        expect(result).not.toBeNull();
        expect(result?.entreeID).toBe(newData.entreeID);
        expect(result?.name).toBe(newData.name);
        expect(result?.description).toBe(newData.description);
        expect(result?.price).toBe(newData.price);
    });

    test("Deleting one of the rows in the database", async () => {
        await entreeDAO.deleteEntreeById(2);
        expect(await entreeDAO.getEntreeByID(2)).toBeNull();
        expect(await entreeDAO.getAllEntrees()).toHaveLength(dataArray.length - 1);
    });

    test("Clear the table", async () => {
        await entreeDAO.deleteAllEntrees();
        expect(await entreeDAO.getAllEntrees()).toHaveLength(0);
    });

});