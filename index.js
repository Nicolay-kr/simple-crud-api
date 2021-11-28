require('dotenv').config();
const http = require('http');
const fs = require('fs');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const { parse } = require('querystring');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let data = '';
  let stream = fs.createReadStream('./db.json');
  // stream.pipe(fs.createWriteStream('./db.json',{flags:'r+'}));
  stream.on('data', (chunk) => (data += chunk));
  let urlRequest = url.parse(req.url, true);
  stream.on('end', () => {
    // console.log('data', data);
    let persons = JSON.parse(data).persons;

    if (req.method == 'GET') {
      if (urlRequest.pathname.match(/^\/person$/)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      } else if (urlRequest.pathname.match(/^\/person\/\d|-|\w/g)) {
        let urlArr = urlRequest.pathname.split("/");
        let persId = urlArr[2];

        let person = persons.find((person) => person.id === persId);

        if (person) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          person = JSON.stringify(person);
          res.end(person);
          stream.on('error', (error) => console.log('Error', error.message));
        } else {
          res.statusCode = 404;
          res.end(`user with id ${persId} isn't finded`);
        }
        // });
      }
    } else if (req.method == 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk.toString()));

      req.on('end', (chunk) => {
        let params = parse(body);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        let newPerson = {
          id: uuidv4(),
          name: params.name,
          age: params.age,
          hobbies: params.hobbies.split(','),
        };
        persons.push(newPerson);
        persons = { persons: [...persons] };
        persons = JSON.stringify(persons);
        let writeStream = fs.createWriteStream('./db.json', { flags: 'w' });
        writeStream.write(persons);
        newPerson = JSON.stringify(newPerson);
        res.end(newPerson);
      });

    } else if (req.method == 'PUT') {
      if (urlRequest.pathname.match(/^\/person\/\d|-|\w/g)) {
        let urlArr = urlRequest.pathname.split("/");
        let persId = urlArr[2];
        if(!persons.find(person=>person.id===persId)){
          res.statusCode = 404;
          res.end(`user with id ${persId} isn't finded`);
        }else{
          let body = '';
          req.on('data', (chunk) => (body += chunk.toString()));
  
          req.on('end', (chunk) => {
            let params = parse(body);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
  
            let editPerson = {
              id: persId,
              name: params.name,
              age: params.age,
              hobbies: params.hobbies.split(','),
            };
            persons.forEach((person, index) => {
              if (person.id === persId) {
                persons[index] = editPerson;
              }
            });
            persons = { persons: [...persons] };
            persons = JSON.stringify(persons);
            let writeStream = fs.createWriteStream('./db.json', { flags: 'w' });
            writeStream.write(persons);
            editPerson = JSON.stringify(editPerson);
            res.end(editPerson);
          });
        }
    
      } else {
        res.statusCode = 400;
        res.end(`user's id invalid`);
      }

    } else if (req.method == 'DELETE') {
      if (urlRequest.pathname.match(/^\/person\/\d|-|\w/g)) {
        let urlArr = urlRequest.pathname.split("/");
        let personId = urlArr[2];
        let deletePerson = persons.find((person) => person.id === personId);

        if (deletePerson) {
          persons = persons.filter((person) => person.id !== personId);
          persons = { persons: [...persons] };
          persons = JSON.stringify(persons);
          let writeStream = fs.createWriteStream('./db.json', { flags: 'w' });
          writeStream.write(persons);

          res.statusCode = 204;
          res.setHeader('Content-Type', 'text/html');
          res.end("<p>peerson was dremove</p>");
        } else {
          res.statusCode = 404;
          res.end(`user with id ${personId} isn't finded`);
        }
        // });
      } else {
        res.statusCode = 400;
        res.end(`user's id invalid`);
      }
    }
  });
  stream.on('error', (error) => console.log('Error', error.message));

  // res.end('<h1>Hello, world!</h1>');
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
