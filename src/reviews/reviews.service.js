const knex = require("../db/connection");

function update(updatedReview) {
    return knex("reviews")
        .select("*")
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview)
        .then(() => read(updatedReview.review_id));
}

function destroy(review_id) {
    return knex("reviews").where({ review_id }).del();
}

function read(review_id = 0) {
    return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ review_id })
    .first();
}

module.exports = {
    read,
    update,
    delete: destroy,
}