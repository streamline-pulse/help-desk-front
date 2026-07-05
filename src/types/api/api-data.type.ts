export type ApiPagedResponse<T> = {
  data?: T[]
  total?: number
  page?: number
  perPage?: number
  pages?: number
}

export type ApiTimestamp = string | number

export type ApiEntityResponse<T> = {
  data?: T | null
  message?: string | null
}

export type ApiMutationResult<T> = {
  data: T | null
  message?: string
}

export type ApiListParamValue =
  string | number | boolean | readonly string[] | readonly number[]

export type ApiListParams<TFilters = Record<string, never>> = {
  page: number
  perPage: number
  search?: string
  filters?: Partial<
    Record<
      Extract<keyof TFilters, string>,
      ApiListParamValue | null | undefined
    >
  >
}

export type PageResult<T> = {
  rows: T[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export type ApiRequestOptions = {
  signal?: AbortSignal
}

export type ResourceDataSource<
  TEntity,
  TFilters = Record<string, never>,
  TCreateInput = never,
  TUpdateInput = never,
> = {
  list: (
    request: ApiListParams<TFilters>,
    options?: ApiRequestOptions
  ) => Promise<PageResult<TEntity>>
  get?: (id: string, options?: ApiRequestOptions) => Promise<TEntity | null>
  create?: (input: TCreateInput) => Promise<TEntity>
  update?: (id: string, input: TUpdateInput) => Promise<TEntity>
  remove?: (id: string) => Promise<TEntity | null>
}
