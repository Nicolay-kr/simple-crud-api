# Task 3: simple-crud-api

## Before running commands from the command line, you must:

1. Have NodeJS LTS version (16.13.0 at the time of test development)
2. Clone a repository using git
3. Switch to develop branch
4. Install dependencies using `npm i`

**Usage example:**

1. To run the server in development mode from the command line use `"npm run start:dev"` command.
2. To run the server in production mode from the command line use `"npm run start:prod"` command.
3. To run the tests from the command line use next commands:

- `"npm run start:test"` to start separate server for testing on 4000 port;
- `"npm run test"` in another terminal to run tests (when the server is running on port 4000).

For cheking API  you can use Postman https://www.postman.com/
### API path `/person`:

    * **GET** `/person` or `/person/${personId}` returns all persons or person with corresponding `personId`
    * **POST** `/person` is used to create record about new person and store it in database (you must pass all the required fields described below to successfully complete the request)
    * **PUT** `/person/${personId}` is used to update record about existing person (you must pass all the required fields described below to successfully complete the request)
    * **DELETE** `/person/${personId}` is used to delete record about existing person from database

### Persons are stored as `objects` that have following properties:

    * `id` — unique identifier (`string`, `uuid`) generated on server side
    * `name` — person's name (`string`, **required**)
    * `age` — person's age (`number`, **required**)
    * `hobbies` — person's hobbies (`array` of `strings` or empty `array`, **required**)
