import AWS from "aws-sdk";
import {ServiceConfigurationOptions} from 'aws-sdk/lib/service';
let serviceConfigOptions : ServiceConfigurationOptions = {
    region: "us-west-2",
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
    endpoint: "http://dynamo:8000" // please use your machine ip address if you want to run it locally  
};
let docClient = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);
let dynamodb = new AWS.DynamoDB(serviceConfigOptions);

export = {dynamodb,docClient}