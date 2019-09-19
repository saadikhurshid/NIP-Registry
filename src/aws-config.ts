import AWS from "aws-sdk";
import {ServiceConfigurationOptions} from 'aws-sdk/lib/service';
let serviceConfigOptions : ServiceConfigurationOptions = {
    region: "us-west-2",
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
    endpoint: "http://localhost:8070"
};
let docClient = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);
let dynamodb = new AWS.DynamoDB(serviceConfigOptions);

export = {dynamodb,docClient}