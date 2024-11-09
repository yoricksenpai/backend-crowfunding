import { HttpStatus } from "@nestjs/common";

export const extractPaginationData = (query: QueryOptions): QueryOptions => {
    setParam('offset', query);
    setParam('limit', query);

    return query
}

export const extractSortingData = (query: QueryOptions): QueryOptions => {
    setParam('sort', query);
    setParam('way', query);

    return query
}

export const extractProjectionData = (query: QueryOptions): QueryOptions => {
    setParam('projection', query);

    if (typeof query.projection == 'string')
        query.projection = setProjection(query.projection as unknown as string);

    return query;
}

function setParam(param: FilterParam, query: QueryOptions) {
    if (query.filter && `${param}` in query.filter) {
        query[`${param}` as string] = query.filter[param];
        delete query.filter[param];
    }
}

function setProjection(field: string) {
    return field.split(',').reduce((o, key) => ({ ...o, [key]: 1 }), {});
}

export const convertParams = (query: QueryOptions): QueryOptions => {
    if (query.filter) {
        for (const key in query.filter) {
            if (query.filter[key] === 'true') { query.filter[key] = true; }
            if (query.filter[key] === 'false') { query.filter[key] = false; }
            if (RegExp(/[a-z]/i).test(query.filter[key])) { continue; }
            query.filter[key] = !isNaN(query.filter[key]) ? +query.filter[key] : query.filter[key];
        }
    }

    if (query.limit) { query.limit = +query.limit; }
    if (query.offset) { query.limit = +query.offset; }

    return query;
}

export const response = (status: HttpStatus, message: string, data?: ObjectType<any>) => {
    return { status, message, data }
}