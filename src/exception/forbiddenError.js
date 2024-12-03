const CustomError = require("./customError");

class ForbiddenError extends CustomError {
    constructor(message) {
        super(message, 403)
    }
}

module.exports = ForbiddenError;