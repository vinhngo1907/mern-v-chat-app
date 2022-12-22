class APIFeautres {
    constructor(query, queryStr) {
        this.quer = query;
        this.queryStr = queryStr;
    }
    pagination() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    filtering() {
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|search|text)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sorting() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    searching() {
        const keyword = this.querystr.search ? {
            name: {
                $regex: this.querystr.search,
                $options: "i"
            }
        } : {}

        this.query = this.query.find({ ...keyword });
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }

        return this;
    }
}

module.exports = APIFeautres;