const ExpressError = require('./utils/ExpressError'); // Custom error handler
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

// Campground validation middleware
module.exports.validationCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required().messages({
                'string.empty': 'Campground title cannot be empty.',
                'any.required': 'Campground title is required.'
            }),
            image: Joi.string().uri().required().messages({
                'string.uri': 'Image must be a valid URL.',
                'string.empty': 'Image URL cannot be empty.',
                'any.required': 'Image URL is required.'
            }),
            price: Joi.number().required().min(0).messages({
                'number.base': 'Price must be a number.',
                'number.min': 'Price cannot be negative.',
                'any.required': 'Price is required.'
            }),
            description: Joi.string().required().messages({
                'string.empty': 'Description cannot be empty.',
                'any.required': 'Description is required.'
            })
        }).required()
    });

    const { error } = campgroundSchema.validate(req.body.campground);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


// Review validation middleware
module.exports.validationReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        Review: Joi.object({
            body: Joi.string().required().messages({
                'string.empty': 'Review comment cannot be empty.',
                'any.required': 'Review comment is required.'
            }),
            rating: Joi.number().required().min(1).max(5).messages({
                'number.base': 'Rating must be a number.',
                'number.min': 'Rating must be at least 1.',
                'number.max': 'Rating cannot exceed 5.',
                'any.required': 'Rating is required.'
            })
        }).required()
    });


    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
