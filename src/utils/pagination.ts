import { PaginationArgs, PaginationResult } from '../types/interfaces';

export const paginate = async <T>({
    skip = 0,
    take = 10,
    count,
    findMany
}: {
    skip?: number,
    take?: number,
    count: () => Promise<number>,
    findMany: (args: PaginationArgs) => Promise<T[]>
}): Promise<PaginationResult<T>> => {
    const total = await count();
    const data = await findMany({ skip, take });
    const totalPages = Math.ceil(+total / take);
    const currentPage = (skip / take) + 1;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
        data,
        total,
        totalPages,
        currentPage,
        nextPage
    };
}
  