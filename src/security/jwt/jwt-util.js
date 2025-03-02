const userService = require('../../service/userService');
const jwt = require('jsonwebtoken');
const config = require("../../common/config");


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    let jwtPayload;

    // Validate the token and retrieve its data.
    try {
        // Verify the payload fields.
        jwtPayload = jwt.verify(token, config.jwt.secret, {
            complete: true,
            audience: config.jwt.audience,
            issuer: config.jwt.issuer,
            algorithms: ['HS256'],
            clockTolerance: 0,
            ignoreExpiration: false,
            ignoreNotBefore: false
        });
        // Add the payload to the request so controllers may access it.
        req.token = jwtPayload;
    } catch (error) {
        res.status(401)
            .type('json')
            .send(JSON.stringify({message: 'Missing or invalid token'}));
        return;
    }

    // Pass programmatic flow to the next middleware/controller.
    next();
}

 const checkRole = roles => {
    return async (req, res, next) => {
        // Find the user with the requested ID.
        const user = await userService.getUser(req.token.payload.username);
        console.log(user);
        console.log("id: " +  req.token.payload.username );
        // Ensure we found a user.
        if (!user) {
            res
                .status(404)
                .type("json")
                .send(JSON.stringify({ message: "User not found" }))
            return;
        }

        // Ensure the user's role is contained in the authorized roles.
        if (roles.indexOf(user.role) > -1) next()
        else {
            res
                .status(403)
                .type("json")
                .send(JSON.stringify({ message: "Not enough permissions" }))
            return;
        }
    }
}


module.exports = {authenticateToken, checkRole};