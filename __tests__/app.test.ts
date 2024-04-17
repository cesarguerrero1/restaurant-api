/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file This test suite ensures that we are using different database connections for testing and development
 */


import createApp from "../src/app";

describe("Testing Factory Design pattern", () => {

    test("Failing to provide an environment should default to development", () => {
        const app = createApp();
        expect(app.get("environment")).toBe("development");
    });

    test("Providing 'test' as an environment should set the environment to test", () => {
        const app = createApp("test");
        expect(app.get("environment")).toBe("test");
    });

});