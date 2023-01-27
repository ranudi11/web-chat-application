import * as mongodb from "mongodb";
 
export interface User {

email: string;
nickName: string;
gender: "male"|"female" ;
age:string;
password:string;
_id?: mongodb.ObjectId;

}