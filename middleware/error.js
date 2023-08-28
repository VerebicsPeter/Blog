exports.errorHandler = (err, req, res, next) => {
    const {status = 500, message = 'Something went wrong.'} = err
    res.status(status).send(message); console.error(message)
}