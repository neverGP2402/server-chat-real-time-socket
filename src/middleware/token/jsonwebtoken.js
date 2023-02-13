import  Jwt  from "jsonwebtoken";

const enCodeToken = (id) => {
    return Jwt.sign({
        iss: 'server chat realtime socket',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 5),
    }, process.env.SECRET_KEY)
}
export default  {
    enCodeToken,
}