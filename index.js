require('dotenv').config();
const http = require('http');
const fs = require('fs');
const url = require('url');
const { v4: uuidv4 } = require('uuid');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let urlRequest = url.parse(req.url, true);

  if (req.method == 'GET') {
    let data = '';
    let stream = fs.createReadStream('./db.json');
    stream.on('data', (chunk) => (data += chunk));

    if (urlRequest.pathname.match(/^\/person$/))  {
      stream.on('end', () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      });
      stream.on('error', error => console.log('Error', error.message));
    }

    else if (urlRequest.pathname.match(/^\/person\/\d+/)) {
      let personId = urlRequest.pathname.match(/\d+/)[0]
      stream.on('end', () => {
        let persons = JSON.parse(data).persons;
        let person = persons.find((person)=>person.id===personId);

        if(person){
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          person = JSON.stringify(person)
          res.end(person);
          stream.on('error', error => console.log('Error', error.message));
        }else{
          res.statusCode = 404;
          res.end(`user with id ${personId} isn't finded`);
        }
      });
    }
  } 
  else if (req.method == 'GET') {
  } 
  else if (req.method == 'PUT') {
  }
  else if (req.method == 'DELETE') {
  }

  // res.end('<h1>Hello, world!</h1>');
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
