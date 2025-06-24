class APIFeautres {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    paginating() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
module.exports = APIFeautres;