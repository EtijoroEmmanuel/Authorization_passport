// Import Joi Dependency
const Joi = require('joi');

exports.registerValidation = (req, res, next)=>{
    const schema = Joi.object({
        fullName: Joi.string().min(3).trim().pattern(/^[A-Za-z ]+$/).required().messages({
           "any.required":'Fullname is required',
            'string.empty': 'Fullname cannot be empty',
            'string.pattern.base':"FullName should only contain alphabets",
            'string.min': "FullName should not be less tha 3 letters"
        }),
        email: Joi.string().email().required().messages({
            "string.email": "Invalid email format",
            'string.empty': 'email cannot be empty',
            "any.required": "email is required"
        }),

        password: Joi.string().min(6).required().messages({
            "string.min":"Password must be at least 6 characters",
            'string.empty': 'password cannot be empty',
            "any.required":"Password is required"
        })
    });

    const {error} = schema.validate(req.body, {abortEarly: false});

    if(error){
        return res.status(400).json({
            // message: error.details.map(err => err.message) // Send all validation errors
            message: error.message
        });
    }
    next();
};
