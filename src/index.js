require('dotenv').config();
const http = require('http');
const fs = require('fs');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const { parse } = require('querystring');
const { validateUrl } = require('./validators/validateUrl');
const { validatePerson } = require('./validators/validatePerson');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let data = '';
  let stream = fs.createReadStream('./db.json');
  stream.on('data', (chunk) => (data += chunk));
  let urlRequest = url.parse(req.url, true);
  stream.on('end', () => {
    let persons = JSON.parse(data).persons;
    let currentUrl = validateUrl(urlRequest.pathname);
    if (currentUrl.isValid) {
      if (req.method == 'GET') {
        if (urlRequest.pathname.match(/^\/person$/)) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(data);
        } else if (urlRequest.pathname.match(/^\/person\/\d|-|\w/g)) {
          let urlArr = urlRequest.pathname.split('/');
          let persId = urlArr[2];

          let person = persons.find((person) => person.id === persId);

          if (person) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            person = JSON.stringify(person);
            res.end(person);
          } else {
            res.statusCode = 404;
            res.end(`user with id ${persId} isn't finded`);
          }
        }
      } else if (req.method == 'POST') {
        let body = '';
        req.on('data', (chunk) => (body += chunk.toString()));

        req.on('end', (chunk) => {
          let params = parse(body);

          let newPerson = {
            id: uuidv4(),
            name: params.name ? `${params.name}` : null,
            age: params.age ? +params.age : null,
            hobbies: params.hobbies ? params.hobbies.split(',') : [],
          };
          let personValidation = validatePerson(newPerson);
          if (personValidation.isValid) {
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            persons.push(newPerson);
            persons = { persons: [...persons] };
            persons = JSON.stringify(persons);
            let writeStream = fs.createWriteStream('./db.json', { flags: 'w' });
            writeStream.write(persons);
            newPerson = JSON.stringify(newPerson);
            res.end(newPerson);
          } else {
            res.statusCode = personValidation.statusCode;
            res.end(personValidation.message);
          }
        });
      } else if (req.method == 'PUT') {
        if (urlRequest.pathname.match(/^\/person\/\d|-|\w/g)) {
          let urlArr = urlRequest.pathname.split('/');
          let persId = urlArr[2];
          if (!persons.find((person) => person.id === persId)) {
            res.statusCode = 404;
            res.end(`user with id ${persId} isn't finded`);
          } else {
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
              let writeStream = fs.createWriteStream('./db.json', {
                flags: 'w',
              });
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
          let urlArr = urlRequest.pathname.split('/');
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
            res.end('<p>peerson was dremove</p>');
          } else {
            res.statusCode = 404;
            res.end(`user with id ${personId} isn't finded`);
          }
        }
      }
    } else {
      res.statusCode = currentUrl.statusCode;
      res.end(`${currentUrl.message}`);
    }
  });
  stream.on('error', (error) => {
    res.statusCode = 500;
    res.end('Error', error.message);
  });
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

module.exports = {server}