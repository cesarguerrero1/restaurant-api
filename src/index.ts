/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file Entry point into our program
 */

import {createApp, configureGraphQL} from './app';
import {seedDatabase} from './seed-database';


//Main function to start the server
async function main(){

    //We don't provide any argument which means this will be a development environment
    const app = await createApp();

    //Configure GraphQL
    await configureGraphQL(app);

    //Server listens on port 4000
    app.listen(4000);

    seedDatabase()
    .then(() => {
        console.log("Running a GraphQL API server at http://localhost:4000");
    })
    .catch((error) => {
        console.error("Error seeding the database");
        process.exit(1);
    });
}

//Start the server
main();