const path = require("path");
const express = require("express");
const xss = require("xss");
const { requireAuth } = require("../middleware/jwt-auth");
const PollService = require("./polls-service");

const pollsRouter = express.Router();
const jsonParser = express.json();

const serializePoll = poll => ({
  id: poll.id,
  name: xss(poll.name),
  description: xss(poll.description),
  user_id: poll.user_id
});

const serializePollOptions = polloption => ({
  id: polloption.id,
  name: xss(polloption.name),
  poll_id: polloption.poll_id
});

pollsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    PollService.getAllPolls(knexInstance)
      .then(polls => {
        res.json(polls.map(serializePoll));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { name, description, options } = req.body;
    const newPoll = { name, description };

    for (const [key, value] of Object.entries(newPoll))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
    newPoll.user_id = req.user.id;

    PollService.insertPoll(req.app.get("db"), newPoll)
      .then(poll => {
        res.poll = serializePoll(poll);
        res.poll.options = [];
        return res.poll;
      })
      .then(poll => {
        Promise.all(
          options.map(option => {
            return PollService.insertPollOption(req.app.get("db"), {
              name: option,
              poll_id: poll.id
            })
              .then(option => {
                res.poll.options.push(serializePollOptions(option));
                return res.poll;
              })
              .catch(next);
          })
        ).then(poll => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${poll.id}`))
            .json(res.poll);
        });
      })
      .catch(next);
  });

pollsRouter
  .route("/:_id")
  .all((req, res, next) => {
    PollService.getById(req.app.get("db"), req.params._id)
      .then(poll => {
        if (!poll) {
          return res.status(404).json({
            error: { message: `Poll doesn't exist` }
          });
        }
        res.poll = serializePoll(poll);
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    PollService.getPollOptions(req.app.get("db"), req.params._id)
      .then(polloptions => {
        if (!polloptions) {
          return res.status(404).json({
            error: { message: `Poll Options don't exist` }
          });
        }
        Promise.all(
          polloptions.map(serializePollOptions).map(option => {
            return PollService.getVoteCount(req.app.get("db"), option.id)
              .then(count => {
                option.votes = count.count;
                return option;
              })
              .catch(next);
          })
        ).then(polloptions => {
          res.poll.polloptions = polloptions;
          res.json(res.poll);
        });
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    if (res.poll.user_id != req.user.id) {
      return res.status(404).json({
        error: { message: `Unauthorized delete` }
      });
    }
    PollService.deletePoll(req.app.get("db"), req.params._id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = pollsRouter;
