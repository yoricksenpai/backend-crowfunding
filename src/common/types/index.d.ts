declare type ObjectType<T> = {
    [key: string]: T
}

declare type QueryFilter = ObjectType<any>

declare type QueryProjection = ObjectType<number>

declare type QueryOptions = {
    filter?: QueryFilter,
    projection?: QueryProjection,
    limit?: number,
    offset?: number,
    sort?: string,
    way?: 1 | -1,
}

declare type PaginationParam = 'offset' | 'limit';

declare type SortingParam = 'sort' | 'way';

declare type FilterParam = (PaginationParam & SortingParam & 'projection') extends keyof QueryOptions ? PaginationParam | SortingParam | 'projection' : never;