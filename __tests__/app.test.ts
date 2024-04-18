/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file This test suite ensures that we are using different database connections for testing and development
 */


import {createApp} from "../src/app";

describe("Testing Factory Design pattern", () => {

    test("Failing to provide an environment should default to development", async () => {
        const app = await createApp();
        expect(app.get("environment")).toBe("development");
    });

    test("Providing any environment other than 'test', like 'development', should default to development", async () => {
        const app = await createApp("development");
        expect(app.get("environment")).toBe("development");
    });

    test("Providing any environment other than 'test', like 'nonsense', should default to development", async () => {
        const app = await createApp("nonsense");
        expect(app.get("environment")).toBe("development");
    });

    test("Providing 'test' as an environment should set the environment to test", async () => {
        const app = await createApp("test");
        expect(app.get("environment")).toBe("test");
    });

});