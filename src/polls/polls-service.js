// Replace t with actual table name.
const PollService = {
  getAllPolls(knex) {
    return knex.select("*").from("polls");
  },

  insertPoll(knex, newData) {
    return knex
      .insert(newData)
      .into("polls")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  insertPollOption(knex, newData) {
    return knex
      .insert(newData)
      .into("polloptions")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from("polls")
      .select("*")
      .where("id", id)
      .first();
  },

  getPollOptions(knex, id) {
    return knex
      .from("polloptions")
      .select("*")
      .where("poll_id", id);
  },

  deletePoll(knex, id) {
    return knex("polls")
      .where({ id })
      .delete();
  },

  getVoteCount(knex, id) {
    return knex
      .from("votes")
      .where("polloption_id", id)
      .count("id")
      .first();
  }
};

module.exports = PollService;
