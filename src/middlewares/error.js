import { generate } from "shortid";
import EErros from "../services/errors/dictionary.js";
import { generateErrorInfo } from "../services/errors/info.js";
import logger from "../logger.js";

export default(error, req, res, next) => {
    logger.error(error.cause)

    switch (error.code) {
        case EErros.LOGIN_ERROR:
            const message = generateErrorInfo(req.user)
            res.status(400).send({ status: 'error', error: error.name, message: message})
            break;
        default:
            res.send({ status: 'error', error: 'Unhandled error'})
            break;
    }
}