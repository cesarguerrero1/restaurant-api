/**
 * Cesar Guerrero
 * 04/17/2024
 * 
 * @file Integration test for the AppetizerDAO against our SQLite database in memory
 */


import createApp from "../src/app";
import { testDataSource } from "../src/data-source";
import AppetizerDAO from "../src/daos/appetizer-dao";
import appData from "../seed-data/appetizers.json";

//We need to create the DAO before running the tests
let appetizerDAO: AppetizerDAO;
beforeAll(async () => {
    const dataSource = testDataSource();
    await dataSource.initialize();
    appetizerDAO = new AppetizerDAO(dataSource);
});

describe("Testing AppetizerDAO methods", () => {

    //We want the table to be cleare for the next test group
    afterAll(async () => {
        await appetizerDAO.deleteAllAppetizers();
    });

    test("Retrieve all rows from an empty table", async () => {
        expect(await appetizerDAO.getAllAppetizers()).toHaveLength(0);
    });

    test("Create a new valid appetizer in the database", async () => {
        const data = {
            name: "",
            description: "",
            price: 0
        };

        const result = await appetizerDAO.createAppetizer(data);
        //We expect all the field values to be the same as the data object
        expect(result.appetizerID).toBe(1); //Recall that the ID is auto-incremented
        expect(result.name).toBe("");
        expect(result.description).toBe("");
        expect(result.price).toBe(0);

        expect(await appetizerDAO.getAllAppetizers()).toHaveLength(1);
    });

    test("Attempt to create an appetizer with a negative price", async () => {
        const data = {
            name: "",
            description: "",
            price: -1
        };

        await expect(appetizerDAO.createAppetizer(data)).rejects.toThrow();
    });

    test("Attempt to create an appetizer with the same PK as an existing row", async () => {
        const data = {
            appetizerID: 1,
            name: "",
            description: "",
            price: 0
        };

        await expect(appetizerDAO.createAppetizer(data)).rejects.toThrow();
    });

    test("Retrieve an appetizer by a valid PK", async () => {
        const result = await appetizerDAO.getAppetizerByID(1);
        expect(result).not.toBeNull();

        expect(result?.appetizerID).toBe(1);
        expect(result?.name).toBe("");
        expect(result?.description).toBe("");
        expect(result?.price).toBe(0);
        
    });

    test("Attempt to retrieve an appetizer by an invalid PK", async () => {
        const result = await appetizerDAO.getAppetizerByID(2);
        expect(result).toBeNull();
    });

    test("Update a non-existent appetizer", async () => {
        const data = {
            appetizerID: 2,
            name: "",
            description: "",
            price: 0
        };

        await expect(appetizerDAO.updateAppetizerById(data)).rejects.toThrow();
    });

    test("Update an existing appetizer with a negative price", async () => {
        const data = {
            appetizerID: 1,
            name: "",
            description: "",
            price: -1
        };

        await expect(appetizerDAO.updateAppetizerById(data)).rejects.toThrow();
    });

    test("Update an existing appetizer", async () => {
        const data = {
            appetizerID: 1,
            name: "New Name",
            description: "New Description",
            price: 1
        };

        await appetizerDAO.updateAppetizerById(data);
        const result = await appetizerDAO.getAppetizerByID(1);
        expect(result).not.toBeNull();

        expect(result?.appetizerID).toBe(1);
        expect(result?.name).toBe("New Name");
        expect(result?.description).toBe("New Description");
        expect(result?.price).toBe(1);
    });

    test("Delete an existing appetizer", async () => {
        await appetizerDAO.deleteAppetizerById(1);
        expect(await appetizerDAO.getAllAppetizers()).toHaveLength(0);
    });

    test("Delete a non-existent appetizer", async () => {
        await expect(appetizerDAO.deleteAppetizerById(2)).rejects.toThrow();
    });
});

describe("Testing all AppetizerDAO methods with multiple rows", () => {

    const dataArray = appData.appetizers.items;

    test("The database should be empty", async () => {
        const result = await appetizerDAO.getAllAppetizers();
        expect(result).toHaveLength(0);
    });

    test("Create multiple rows in the database", async () => {
        //We are returning an array of promises, so we need to wait for all of them to resolve
        await Promise.all(dataArray.map((item) => {
            return appetizerDAO.createAppetizer(item);
        }));

        const result = await appetizerDAO.getAllAppetizers();
        expect(await appetizerDAO.getAllAppetizers()).toHaveLength(dataArray.length);
    });

    test("Updating one of the rows in the database", async () => {
        const data = dataArray[0];
        const newData = {
            ...data,
            appetizerID: 2,
            name: "Update Name"
        };

        await appetizerDAO.updateAppetizerById(newData);
        const result = await appetizerDAO.getAppetizerByID(newData.appetizerID);

        expect(result).not.toBeNull();
        expect(result?.appetizerID).toBe(2);
        expect(result?.name).toBe("Update Name");
        expect(result?.description).toBe(data.description);
        expect(result?.price).toBe(data.price);
    });

    test("Delete one of the rows in the database", async () => {
        await appetizerDAO.deleteAppetizerById(2);
        expect(await appetizerDAO.getAllAppetizers()).toHaveLength(dataArray.length - 1);
    });


    test("Clear the table", async () => {
        await appetizerDAO.deleteAllAppetizers();
        expect(await appetizerDAO.getAllAppetizers()).toHaveLength(0);
    });

});