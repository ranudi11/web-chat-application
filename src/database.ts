import * as mongodb from "mongodb";
import { User } from "./user";
 
export const collections: {
   users?: mongodb.Collection<User>;
} = {};
 
export async function connectToDatabase(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("chatappDB");
   await applySchemaValidation(db);
 
   const usersCollection = db.collection<User>("users");
   collections.users = usersCollection;
}
 
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",
           required: ["email", "nickName", "gender","age","password"],
           additionalProperties: false,
           properties: {
               _id: {},
               email: {
                   bsonType: "string",
                   description: "'email' is required and is a string",
               },
               nickName: {
                   bsonType: "string",
                   description: "'nickName' is required and is a string",
                   minLength: 3
               },
               gender: {
                   bsonType: "string",
                   description: "'gender' is required and is one of 'male', or 'female'",
                   enum: ["male", "female"],
               },
		age: {
                   bsonType: "string",
                   description: "'Age' is required and is a string",
               },
		password: {
                   bsonType: "string",
                   description: "'Password' is required and is a string",
		minLength:3
               },
           },
       },
   };
 
   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "users",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("users", {validator: jsonSchema});
       }
   });
}