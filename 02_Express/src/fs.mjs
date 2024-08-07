import express from 'express';
import fs from 'fs';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;
const ROOT_FOLDER = '../approutes/';

app.use(express.json()); //accept json data from client
app.use(express.urlencoded({ extended: true })); //accept url encoded data from client

//  write a function to handel file based routing
async function handleFileRoute(fileUrl, req, res) { 
    try {
        // import the module from the fileurl
        const module = await import(fileUrl);
        let data = null;

        // grab the request method
        const httpMethod = req.method.toLowerCase();

        // call the method in the module using dot(.) or squareBrackets[]
        if(module[httpMethod]) {
            // call the function
            data = await module[httpMethod](req, res);
            return data;
        } else {
            // call the default function
            data = await module.defaultFunc(req, res);
            return data;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function handelDynamicRoute(folder) { 
    try {
        // get all files in the folder
        const files =await fs.promises.readdir(folder);
        // find first dynamic files from the all files
        const dynamicFileName = await files.find(fname => fname.match(/\[[a-zA-Z0-9\._]+\]/));

        // remove '[' and '].js' from dynamic file name and return only the fole name
        return {
            file: dynamicFileName,
            params: dynamicFileName.replace('[','').replace('].mjs','')
        }

    } catch (error) {
        console.log(error);
        return null
    }
}


// accept all routes
app.all('*', async (req, res) => { 
    let fileUrl = (ROOT_FOLDER + req.url).replace('//', '/'); //remove double slashes and replace with single slash

    // check if file exists
    const isFileExist = fs.existsSync(fileUrl + '.mjs');
    if (!isFileExist) {
        fileUrl += '/index.mjs';
        fileUrl = fileUrl.replace('//', '/');
    } else {
        fileUrl += '.mjs';
    }

    console.log(fileUrl);

    // call the file based routing function
    const result = await handleFileRoute(fileUrl, req, res); // store the response into the result variable

    // send response to the user
    if (result === false) {

        // to extract the folder path by removing parameters
        const pathArray = (ROOT_FOLDER + req.url).replace('//', '/').split('/');
        const lastparameter = pathArray.pop();
        const folderPath = pathArray.join('/');
        console.log(folderPath);
        console.log(lastparameter);

        // call the dynamic routing function
        const dynamicHandler = await handelDynamicRoute(folderPath);
        console.log(dynamicHandler);

        if (!dynamicHandler) {
            res.status(404).send('Page Not Found');
        }

        // override the request params
        req.params = {...req.params, [dynamicHandler.params]: lastparameter};

        // call the file based routing function
        const result = await handleFileRoute([folderPath, dynamicHandler.file].join('/'), req, res);

        res.send(result)

    } else {
        res.send(result);
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

