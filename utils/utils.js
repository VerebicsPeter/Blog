exports.catchAsync = (controller) => {
    return (req, res, next) => {
        controller(req, res, next).catch(e => next(e))
    }
}

exports.paginate = (controller) => {
    return async (req, res, next) => {
    	let page  = parseInt(req.query.page)  || 1
    	let limit = parseInt(req.query.limit) || 5

    	req.pagination = { page, limit }
  
    	await controller(req, res, next)
    }
}

exports.getPaginationPrevNext = (page, limit, count) => {
    const prev = page > 1             ? page - 1 : NaN
    const next = page * limit < count ? page + 1 : NaN
    return { prev, next }
}

exports.isAuthorizedUser = (session, username) => {
    if (!session.user) return false
    return session.user.username === username
}