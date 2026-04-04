const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title:       Joi.string().required(),
        description: Joi.string().required(),
        location:    Joi.string().required(),
        country:     Joi.string().required(),
        price:       Joi.number().required().min(0),

        image: Joi.object({
            url: Joi.string().allow("", null, Joi.any().empty())   // allow empty string / null
        })
        .optional()          // ← key change: not .required()
        .default({ url: "" }) // optional: provide empty default if missing

    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});