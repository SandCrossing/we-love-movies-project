const service = require("./reviews.service");
const reduceProperties = require("../utils/reduce-properties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const review = await service.read(req.params.reviewId);
    if(review) {
        res.locals.review = review;
        return next();
    };
    next({ status: 404, message: 'Review cannot be found.' });
}

const reduceCritic = reduceProperties("critic_id", {
    preferred_name: ["critic", "preferred_name"],
    surname: ["critic", "surname"],
    organization_name: ["critic", "organization_name"],
});

async function update(req, res, next) {
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    service
        .update(updatedReview)
        .then((data) => {
            res.json({ data: reduceCritic([data])[0] })
        })
        .catch(next);
}

async function destroy(req, res, next) {
    service
        .delete(req.params.reviewId)
        .then(() => res.sendStatus(204))
        .catch(next);
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}