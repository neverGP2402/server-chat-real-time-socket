import passport from  'passport';
import passportJwt from 'passport-jwt'
// const JwtStrategy =  passportJwt.Strategy
import { Strategy } from 'passport-local';

import {ExtractJwt} from 'passport-jwt'


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.SECRET_KEY
};
passport.use(new Strategy(jwtOptions,(payload,done) => {
    try {
        console.log(payload)
    } catch (error) {
        console.error(error)
        done(error, false)
    }
}))

export default passport