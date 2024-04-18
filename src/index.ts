/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file Entry point into our program
 */

import {createApp, configureGraphQL} from './app';


//Main function to start the server
async function main(){

    //We don't provide any argument which means this will be a development environment
    const app = await createApp();

    //Configure GraphQL
    configureGraphQL(app);

    //Server listens on port 4000
    app.listen(4000);
    console.log("Running a GraphQL API server at http://localhost:4000");
}

//Start the server
main();