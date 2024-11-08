import { CODES } from "../interface/errorCodes.js"
import { logError } from "./logError.js"

export const sendResponse = (res, statusCode, data={}, req={}) => {
    if (statusCode==500 && req && data) {
        
        const errorData = {
            url: req.originalUrl,
            method: req.method,
            error: {
                message: data.message,
                stack: data.stack
            }
        }

        logError(errorData)
        res.status(500).json({response: {text: CODES.SERVER_ERROR.text, code: CODES.SERVER_ERROR.code}})
    }
    
    else if (statusCode==201) res.status(201).json({response: {text: CODES.PROCESS_COMPLETE.text, code: CODES.PROCESS_COMPLETE.code}})
        
    else if (statusCode==200 && data=={}) res.status(200).json({response: {text: CODES.PROCESS_COMPLETE.text, code: CODES.PROCESS_COMPLETE.code}})
    
    else if (statusCode==404) res.status(404).json({response: {text: CODES.NOT_FOUND.text, code: CODES.NOT_FOUND.code}}) 

    else if (statusCode==401) res.status(401).json({response: {text: CODES.UNAUTHORIZED.text, code: CODES.UNAUTHORIZED.code}})   

    else res.status(statusCode).json({response: data})
}
