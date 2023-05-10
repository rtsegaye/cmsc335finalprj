const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') })
const express = require('express');
const ejs = require('ejs');
const app = express();
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors())


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server started and running at http://localhost:${port}/`);
  process.stdout.write('Stop to shutdown the server: ');
});

// process.stdin.on('data', (data) => {
//   const cmd = data.toString().trim();
//   if (cmd === 'stop') {
//     server.close(() => {
//       console.log('Server shutting down...');
//       process.exit(0);
//     });
//   } else {
//     console.log(`Unknown command: ${cmd}`);
//     process.stdout.write('Stop to shutdown the server: ');
//   }
// });

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









  // Connect to Mongo
//db
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const dbname = process.env.MONGO_DB_NAME;
const emailPass = process.env.EMAIL_PASS
const collection = process.env.MONGO_COLLECTION ;
const databaseAndCollection = {db: `${dbname}`, collection:`${collection}`};

const uri = `mongodb+srv://${userName}:${password}@cluster0.ux1fzck.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect();

app.get('/', (req, res) => {
    renderFile('./templates/index.ejs', res);
});

app.get('/appointment', (req, res) => {
    renderFile('./templates/appointment.ejs', res);
});

app.post('/appointment', async (req, res) => {
  nameVal = req.body.name
  email = req.body.email
  Phone = "" + req.body.phone1 + "-"+ req.body.phone2 + "-" +req.body.phone3
  dateVal = req.body.date
  session = req.body.session
  id = undefined
  message = "For some reason, this appointment was not made. "

  console.log(nameVal, email, Phone, dateVal, session)

  try {
    await client.connect();
    let person = {name : nameVal, email : email, phone: Phone, date: dateVal, session : session}
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(person);
    sendConfirmation(nameVal, email, dateVal)
    id = result.insertedId
    console.log(`Person entered with id ${result.insertedId}`);
  } catch (e){
    console.error(e)
  } finally {
    await client.close();
  }
  
  if(id){
    Application = `Thank you very much. Please check your email for a confirmation`
  }

  res.send(Application);
})


app.post('/appointment', async (req, res) => {
  nameVal = req.body.name
  email = req.body.email
  Phone = "" + req.body.phone1 + "-"+ req.body.phone2 + "-" +req.body.phone3
  dateVal = req.body.date
  session = req.body.session
  id = undefined
  message = "For some reason, this appointment was not made. "

  console.log(nameVal, email, Phone, dateVal, session)

  try {
    await client.connect();
    let person = {name : nameVal, email : email, phone: Phone, date: dateVal, session : session}
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(person);
    sendConfirmation(nameVal, email, dateVal)
    id = result.insertedId
    console.log(`Person entered with id ${result.insertedId}`);
  } catch (e){
    console.error(e)
  } finally {
    await client.close();
  }
  
  if(id){
    Application = `Thank you very much. Please check your email for a confirmation`
  }

  res.send(Application);
})


app.post('/appointment', async (req, res) => {
  nameVal = req.body.name
  email = req.body.email
  Phone = "" + req.body.phone1 + "-"+ req.body.phone2 + "-" +req.body.phone3
  dateVal = req.body.date
  session = req.body.session
  id = undefined
  message = "For some reason, this appointment was not made. "

  console.log(nameVal, email, Phone, dateVal, session)

  try {
    await client.connect();
    let person = {name : nameVal, email : email, phone: Phone, date: dateVal, session : session}
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(person);
    sendConfirmation(nameVal, email, dateVal)
    id = result.insertedId
    console.log(`Person entered with id ${result.insertedId}`);
  } catch (e){
    console.error(e)
  } finally {
    await client.close();
  }
  
  if(id){
    Application = `Thank you very much. Please check your email for a confirmation`
  }

  res.send(Application);
})

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

function sendConfirmation(name, email, date){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'emmanuelermias@gmail.com',
      pass: emailPass
    }
  });

  var mailOptions = {
    from: 'ekebede2@terpmail.umd.edu',
    to: email,
    subject: 'Appointment cofirmation',
    text: `Greetings ${name}, \n\n This is a confirmation message for your appointment on ${date}, with AfroFlick`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function sendConfirmation(name, email, date){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ekebede2@terpmail.umd.edu',
      pass: emailPass
    }
  });

  var mailOptions = {
    from: 'AfroFlicks@gmail.com',
    to: email,
    subject: 'Appointment cofirmation',
    text: `Greetings ${name}, \n\n This is a confirmation message for your appointment on ${date} with AfroFlick`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

  
  