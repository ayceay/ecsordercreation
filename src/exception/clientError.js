const CustomError = require("./customError");

class ClientError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
}

module.exports = ClientError;