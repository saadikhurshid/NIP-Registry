import express from "express";
import bodyParser from "body-parser";
import path from "path";
import DynamoDbLocal from "dynamodb-local";
import DB from "./aws-config";
import {params} from './model';
import em from "./eventEmitter";

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
            "id": NPINumber,
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
        if(err){
            res.render('index', {message: 'Something went wrong please try again'});
        }
        else{
        
         em.emit("NIPRegistery",NPINumber)
         res.render('index', {message: 'You have been successfully registered'});
        }
    })
   
});

app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
  
    DynamoDbLocal.launch(dynamoLocalPort,null).then(()=>{
        
        DB.dynamodb.createTable(params, function(err, data) {
            if (err) {
                // console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                // console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });
    }).catch(err=>{
        console.log(err)
    })
    console.log("  Press CTRL-C to stop\n");
});

export = app