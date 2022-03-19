const service = require("./theaters.service");
const reduceProperties = require("../utils/reduce-properties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  rating: ["movies", null, "rating"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
});

async function list(req, res, next) {
    const data = await service.list();
    res.json({ data: reduceMovies(data) });
}


module.exports = {
    list: [asyncErrorBoundary(list)],
}