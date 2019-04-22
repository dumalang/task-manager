class Paginator {
    constructor(data, page = 1, per_page = 5, total = undefined) {
        return {
            data,
            meta: {
                page: 1,
                per_page: 50,
                total: 10,
                count: data.length
            },
            links: {
                nextPage: '...',
                prevPage: '...'
            }
        }
    }
}

module.exports = Paginator;

