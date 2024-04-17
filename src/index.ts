/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file Entry point into our program
 */

import express, { Response, Request } from 'express';

import createApp from './app';

//We don't provide any argument which means this will be a development environment
const app = createApp();

//Server listens on port 4000
app.listen(4000);