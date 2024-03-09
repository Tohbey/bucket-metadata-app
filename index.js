'use strict';

const express = require('express');
const axios = require('axios');

const BASE_URL = "https://www.googleapis.com/storage/v1/b/s2331174-cw1-ccws/o/";
const objectNames = ["1324832.png", "1325062.jpeg", "1325724.png"]
const response = {
    "studentName": "Fafowora Oluwatobiloba Kayode",
    "studentId": "S2331174",
    "responseDate": new Date().toLocaleDateString(),
    "responseTime": new Date().toLocaleTimeString()
}

const app = express();

const getObjectMetadata = (objectName) => {
    return axios.get(BASE_URL + objectName)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching data:', error.message);
            throw error; // Re-throw the error to propagate it further if needed
        });
};


app.get('/', (req, res) => {
    res.status(200).send(`
        <h3>The Third App Engine App Task!</h3>
        <p>Add <b>'/ofafow300'</b> This will view all the 3 images metadata</p>
        <p>Add <b>'/ofafow300/1', '/ofafow300/2', '/ofafow300/3'</b> to view metadata for each image.</p>
  `).end();
});

app.get('/ofafow300/', async (req, res) => {
    try {
        // Map each object name to a promise resolving metadata
        const metaDataPromises = objectNames.map(async name => {
            return getObjectMetadata(name);
        });

        const payload  = {
            ...response,
            metaData: await Promise.all(metaDataPromises)
        }
        // Send response
        res.status(200).send(payload);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


app.get('/ofafow300/:objectId', async (req, res) => {
    const objectId = req.params.objectId;
    if (objectId >= 1 && objectId <= 3) {
        const name = objectNames[objectId - 1];
        try {
            const metadata = await getObjectMetadata(name);
            const metaDataResponse = {
                ...response,
                fileName: metadata.name,
                contentType: metadata.contentType,
                fileSize: metadata.size,
                createdDate: metadata.timeCreated,
            }

            res.status(200).send(metaDataResponse).end();
        } catch (e) {
            console.log(e);
        }
    } else {
        res.status(200).send("Incorrect ImageId, Please use a valid ImageId").end();
    }
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

module.exports = app;