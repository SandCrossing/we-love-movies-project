const service = require("./movies.service");
const reduceProperties = require("../utils/reduce-properties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
    service
        .read(req.params.movieId)
        .then((movie) => {
            if(movie) {
                res.locals.movie = movie;
                return next();
            }
            next({ status: 404, message: 'Movie cannot be found.' });
        })
        .catch(next);
}

async function list(req, res, next) {
    const isShowing = req.query.is_showing;
    if(isShowing) {
        res.json({ data: await service.listShowing() });
    }
    res.json({ data: await service.list() });
}

const reduceCritic = reduceProperties("critic_id", {
    preferred_name: ["critic", "preferred_name"],
    surname: ["critic", "surname"],
    organization_name: ["critic", "organization_name"],
});

async function listMovieReviews(req, res, next) {
    const data = await service.listMovieReviews(res.locals.movie.movie_id);
    res.json({ data: reduceCritic(data) });
}

async function read(req, res) {
    const { movie: data } = res.locals;
    res.json({ data });
}

async function listTheaters(req, res, next) {
    const data = await service.listTheaters(res.locals.movie.movie_id);
    res.json({ data });
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    listMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    readTheater: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters)],
    listMovieReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listMovieReviews)],
}