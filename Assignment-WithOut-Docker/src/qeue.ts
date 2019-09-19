import kue from 'kue';
import axios from "axios";
import { Job, DoneCallback } from "kue";
import { NPIURL } from "./NIPURL";
import DB from "./aws-config";

const queue = kue.createQueue();

queue.process("Providers", (job: Job, done: DoneCallback) => {
    axios
      .get(NPIURL+ job.data.data)
      .then(response => {
        if(response.data.results !== undefined){
          var params = {
            TableName:"Providers",
            Key:{
                "id": job.data.data,
            },
            UpdateExpression: "set info.identifiers = :i, info.taxonomies=:t, info.addresses=:a",
            ExpressionAttributeValues:{
                ":a":JSON.stringify(response.data.results[0]['addresses']),
                ":t":JSON.stringify(response.data.results[0]['taxonomies']),
                ":i":JSON.stringify(response.data.results[0]['identifiers'])
            },
            ReturnValues:"UPDATED_NEW"
        };
        DB.docClient.update(params, function(err, data) {
       
            if (err) {
             //console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
//console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }

        });
        done();
        return response.data.results;
        }
        else{
          done();
          return response;
        }
        
       
      })
      .catch(error => done(error));
  });


export = queue