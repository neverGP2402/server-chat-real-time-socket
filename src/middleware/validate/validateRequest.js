import joi from 'joi';


const validateParam = (schema, name) => {
    return (req, res, next) => {
        console.log('validateParam')
        const validateResult = schema.validate({
            param: req.params[name]
        })
        if(validateResult.error){
            return res.status(400).json(validateResult.error)
        }
        else{
            if(!req.value) req.value = {}
            if(req.value['params']) req.value.params = {}
            req.value.params =req.value[name]
            req.value.params[name] = req.param[name]
            next()
        }
    }
}


const validateBody = (schema) => {
    return (req,res, next) => {
        const result = schema.validate(req.body)

        if(result.error){
            return res.status(400).json(result.error)
        }else{
            if(!req.value) req.value = {}
            if(!req.value['body']) req.value.body = {}
            req.value.body = result.value
            next()
        }
    }
}

const schemas = {
    idSchema: joi.object().keys({
        param: joi.string().regex(/^[09a-fA-F]{24}$/) .required()
    }),
    userSchema: joi.object().keys({
        name: joi.string().min(2).required(),
        username: joi.string().min(6).required(),
        password: joi.string().min(6).required(),
        email: joi.string().email().required(),
    })
}

export default {
    validateParam,
    validateBody,
    schemas
}