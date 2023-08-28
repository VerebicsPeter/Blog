exports.paginate = (controller) => {
    return async (req, res, next) => {
    	const page  = parseInt(req.query.page)  || 1
    	const limit = parseInt(req.query.limit) || 5
  
    	req.pagination = { page, limit }
  
    	await controller(req, res, next)
    }
}

exports.catchAsync = (controller) => {
    return (req, res, next) => {
        controller(req, res, next).catch(e => next(e))
    }
}