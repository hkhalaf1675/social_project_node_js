
const pagination = async (Model,
    { page, perPage, dataLimit },
    query, _data, _count) => {
    let data, rows, totalItems, totalPages;
    if (Model) {
        const limit = perPage ? +perPage : 10;
        const offset = +page ? (page - 1) * limit : 0;

        data = await Model.findAndCountAll({
            ...query,
            offset,
            limit,
            distinct: true
        }).catch((error) => {
            console.log(error);
            return { success: false, "errors": ["something went wrong"] };
        });
        rows = data.rows;
        totalItems = data.count.length ? data.count.length : data.count || 0;
        totalPages = Math.ceil(totalItems / limit);

    }
    else if (_data) {
        rows = _data;
        totalItems = _count || 0;
        totalPages = Math.ceil(totalItems / dataLimit);
    }

    const currentPage = +page ? +page : 1;
    const pageInfo = { totalItems, totalPages, currentPage };
    const response = {};
    response['pageInfo'] = pageInfo;
    response['data'] = rows || [];
    response['success'] = true;
    return response;
};
module.exports = { pagination };