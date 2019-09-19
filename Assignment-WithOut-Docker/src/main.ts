import express from "express";
import bodyParser from "body-parser";
import path from "path";
import DynamoDbLocal from "dynamodb-local";
import DB from "./aws-config";
import {params} from './model';
import kue from 'kue';
import queue from "./qeue";

const dynamoLocalPort = 8070;

let resources = path.join(__dirname, '../', 'resources');

let app = express();

app.set("port", process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(resources, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(resources, 'web')));
app.use('/node_modules', express.static(path.join(__dirname, '../', 'node_modules')));

app.use("/kue-api/", kue.app);

app.get('/', (req, res, next)=>
{
    res.render('index');
});



app.post('/register', (req, res, next)=>
{
    let {firstName, lastName, NPINumber} = req.body;
    var params = {
        TableName: "Providers",
        Item: {
            "id": JSON.parse(NPINumber),
            "firstName": firstName,
            "lastName": lastName,
            "info":{
                "addresses": "Empty",
                "taxonomies": "Empty",
                "identifiers":"Empty"
            }
        },
        ReturnValues: 'ALL_OLD',
    };
    
    DB.docClient.put(params,function(err,data){
        // if(err){
        //     res.render('index', {message: 'Something went wrong please try again'});
        // }
        // else{
      queue.create("Providers", {
                data: JSON.parse(NPINumber) // I was tesing api with this NPI number 1467456137
            }).priority("high")
                .save();

         res.render('index', {message: 'You have been successfully registered'});
        // }
    })
   
});


app.get('/providers',function(req,res){
    var params = {
        TableName: "Providers"
    }
DB.docClient.scan(params,function(err,data){
    res.send(data.Items)
})
})

var test = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
  
    DynamoDbLocal.launch(dynamoLocalPort,null).then(()=>{
         console.log("Database Launching.......")
        DB.dynamodb.createTable(params, function(err, data) {
            if (err) {
                 //console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                //console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });
     }).catch(err=>{
         console.log(err)
     })
    console.log("  Press CTRL-C to stop\n");
});
test.close()
export = app