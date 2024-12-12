// class CustomError extends Error {
//     constructor(message, status = 500, additionalInfo = undefined) {
//         super(message)
//         this.message = message
//         this.status = status
//         this.additionalInfo = additionalInfo
//     }
// }

const CustomError = require("../customError");

function errorHandler(err, req, res, next) {
    if (!(err instanceof CustomError)) {
        res.status(500).send(
            JSON.stringify({
                message: "Server error, please try again later"
            })
        )
    } else {
        const customError = err
        let response = {
            message: customError.message
        }
        // Check if there is more info to return.
        if (customError.additionalInfo)
            response.additionalInfo = customError.additionalInfo
        res
            .status(customError.status)
            .type("json")
            .send(JSON.stringify(response))
    }
}

module.exports = {errorHandler};