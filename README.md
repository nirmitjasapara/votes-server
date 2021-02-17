# Votes Server

### Users Endpoints

### POST `/api/auth/login`

```js
// req.body
{
  user_name: String,
  password: String
}

// res.body
{
  authToken: String
}
```

### POST `/api/auth/register`

```js
// req.body
{
  user_name: String,
  full_name: String,
  password: String
}

// res.body
{
  user_name: String,
  full_name: String,
  password: String,
  date_created: Timestamp
}
```

### GET `/api/polls/`

```js
Returns all the Polls
// res.body
[
  id: ID,
  name: String,
  description: String,
  user_id: UserId
]
```

### POST `/api/polls/`

Creates a new poll. Requires a `name` and `description` with an AuthToken for the UserID. Then creates poll options with the `options` and created `poll_id`.

```js
// req.body
{
  name: String,
  description: String,
  options: [String]
}

// req.header
Authorization: Bearer ${token}

// res.body
{
  id: ID,
  name: String,
  description: String,
  user_id: UserId,
  options: [{ name: String, poll_id: PollId}]
}
```

### GET `/api/polls/:id`

```js
// req.params
{
  id: ID
}

// req.header
Authorization: Bearer ${token}

// res.body
{
  id: ID,
  name: String,
  description: String,
  user_id: UserId,
  options: [{ name: String, poll_id: PollId}]
}
```

### DELETE `/api/polls/:id`

```js
// req.params
{
  id: ID
}

// req.header
Authorization: Bearer ${token}

// res.body
[
  status: 204
]
```

### POST `/api/vote/`

```js
// req.body
{
  polloption_id: PollOptionId
}

// req.header
Authorization: Bearer ${token}

// res.body
{
  id: ID,
  polloption_id: PollOptionId,
  user_id: UserId
}
```

### GET `/api/vote/:_id`

Given the poll `_id`, Get the poll option `id` that the logged in user voted for.

```js
// req.params
{
  id: ID
}

// req.header
Authorization: Bearer ${token}

// res.body
[
  id: PollOptionId
]
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Create local

1. pg_ctl start if not started yet
2. createdb -U user_name editordb
3. npm run migrate

## Tear Down

1. npm run migrate -- 0
2. dropdb db_name
3. pg_ctl stop

## Heroku

1. heroku create
2. heroku addons:create heroku-postgresql:hobby-dev
3. heroku config:set JWT_SECRET=paste-your-token-here

## Technology Stack

### Backend

- **Express** for handling API requests
- **Node** for interacting with the file system
- **Knex.js** for interfacing with the **PostgreSQL** database
- **Postgrator** for database migration
- **Mocha**, **Chai**, **Supertest** for endpoints testing
- **JSON Web Token**, **bcryptjs** for user authentication / authorization
- **Xss** for cross-site scripting protection
- **Winston**, **Morgan** for logging and errors
