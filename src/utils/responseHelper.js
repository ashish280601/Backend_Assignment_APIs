const sendResponse = (res, statusCode, message, status, response = null) => {
    return res.status(statusCode).json({
        data: {
            message,
            code: statusCode,
            status,
            response
        }
    });
}

export default sendResponse;