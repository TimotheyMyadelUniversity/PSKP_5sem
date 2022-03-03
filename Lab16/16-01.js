import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import pkg from 'graphql';
import fs from 'fs';
import { resolver } from './resolver.js';

const { buildSchema } = pkg;
const schema = buildSchema(fs.readFileSync('./schema.gql').toString());

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
}));
app.listen(3000, () => console.log('Now browse to localhost:3000/graphql'));