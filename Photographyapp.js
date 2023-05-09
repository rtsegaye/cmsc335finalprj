const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') })
const express = require('express');
const ejs = require('ejs');
const app = express();
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//db
const databaseAndCollection = {db: "CMSC335FINALDB", collection:"reviewSession"};
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;



const port = process.argv[2];
const server = app.listen(port, () => {
  console.log(`Server started and running at http://localhost:${port}/`);
  process.stdout.write('Stop to shutdown the server: ');
});

process.stdin.on('data', (data) => {
  const cmd = data.toString().trim();
  if (cmd === 'stop') {
    server.close(() => {
      console.log('Server shutting down...');
      process.exit(0);
    });
  } else {
    console.log(`Unknown command: ${cmd}`);
    process.stdout.write('Stop to shutdown the server: ');
  }
});

const renderFile = (path, res) => {
    ejs.renderFile(path, (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(html);
    });
  };
  
app.get('/', (req, res) => {
    renderFile('./templates/index.ejs', res);
});

app.get('/appointment', (req, res) => {
    renderFile('./templates/appointment.ejs', res);
});
app.get('/prices', (req, res) => {
    renderFile('./templates/prices.ejs', res);
});
app.get('/review', (req, res) => {
    renderFile('./templates/write.review.ejs', res);
});
app.get('/index', (req, res) => {
    renderFile('./templates/index.ejs', res);
});

app.post('/submitreview', async (req, res) => {
    const applicationData = {
        writereview: req.body.writereview
    };
    
    try {
        const result = await insertApplicationData(applicationData);
        ejs.renderFile('./templates/review.ejs', applicationData, (err, html) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
        res.send(html);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
    });

async function insertApplicationData(applicationData) {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.byxwry2.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
        await insertreview(client, databaseAndCollection, applicationData);
    } catch (e) {
        console.error(e);
        throw new Error('Unable to insert application data');
    } finally {
        await client.close();
    }
    }

async function insertreview(client, databaseAndCollection, newReview) {
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(newReview);
}

  
  