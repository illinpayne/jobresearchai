import { PaginatedResult, PaginationOptions } from './pagination.types'

export type PaginateFunction = <T, K>(
	model: any,
	args?: K,
	options?: PaginationOptions
) => Promise<PaginatedResult<T>>

export const createPaginator = (
	defaultOptions: PaginationOptions
): PaginateFunction => {
	return async (model, args: any = { where: {} }, options) => {
		const page = Number(options?.page || defaultOptions.page || 1)
		const limit = Number(options?.limit || defaultOptions.limit || 10)
		const skip = (page - 1) * limit

		const [total, data] = await Promise.all([
			model.count({ where: args.where }),
			model.findMany({
				...args,
				take: limit,
				skip
			})
		])

		const lastPage = Math.ceil(total / limit)

		return {
			data,
			meta: {
				total,
				lastPage,
				currentPage: page,
				perPage: limit,
				prev: page > 1 ? page - 1 : null,
				next: page < lastPage ? page + 1 : null
			}
		}
	}
}
