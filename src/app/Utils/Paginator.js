const url = require('url')

class Paginator {

    constructor(data, page = 1, per_page = 50, total = undefined, req = undefined) {
        var countPerPage = 0
        if (data) {
            countPerPage = data.length
        }
        var result = {
            data,
            meta: {
                page: page,
                per_page: per_page,
                total: total,
                count: countPerPage
            }
        }

        // if (req) {
        //     var {query} = req.query
        //     var nextQuery = query
        //     var prevQuery = query
        //
        //     var fullNextURL = url.format({
        //         protocol: req.protocol,
        //         host: req.get('host'),
        //         pathname: req
        //     })
        //
        //     result.links = {
        //         nextPage: fullURL,
        //         prevPage: '...'
        //     }
        // }

        return result
    }
}

module.exports = Paginator;

