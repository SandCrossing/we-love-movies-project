const knex = require("../db/connection");

function list() {
    return knex("movies").select("*");
}

function listShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("m.*")
        .where({ "mt.is_showing": true })
        .groupBy("m.movie_id");
}

function listMovieReviews(movie_id) {
    return knex("movies as m")
        .join("reviews as r", "m.movie_id", "r.movie_id")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({ "m.movie_id": movie_id });
}

function listTheaters(movie_id) {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("t.*")
        .where({ "m.movie_id": movie_id });
}

function read(movieId) {
    return knex("movies").select("*").where({ movie_id: movieId }).first();
}

module.exports = {
    list,
    listShowing,
    listMovieReviews,
    listTheaters,
    read,
};