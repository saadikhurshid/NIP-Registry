import events from "events";
import Axios from "axios";
import { NPIURL } from "./NIPURL";
import DB from "./aws-config";
let em = new events.EventEmitter();
em.on('NIPRegistery', function (data) {
  // data is NPI number fetched from the frontend
    Axios.post(NPIURL+ 1467456137,  // using hardcoded NPI number from the api can be replaced with data as it contains NIP number from the USer Registration Form
    ).then((response)=>{
        if(response.data.results !== undefined){
            var params = {
                TableName:"Providers",
                Key:{
                    "id": data,
                },
                UpdateExpression: "set info.identifiers = :i, info.taxonomies=:t, info.addresses=:a",
                ExpressionAttributeValues:{
                    ":a":JSON.stringify(response.data.results[0]['addresses']),
                    ":t":response.data.results[0]['taxonomies'],
                    ":i":response.data.results[0]['identifiers']
                },
                ReturnValues:"UPDATED_NEW"
            };
            DB.docClient.update(params, function(err, data) {
                if (err) {
                    // console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    // console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });
        }
        
    }).catch(err=>{
        console.log(err)
    })
})

export = em