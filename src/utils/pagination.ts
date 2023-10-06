import { IPaginationArgs, IPaginationResult } from '../types/interfaces';

export const paginate = async <T>({
    skip = 0,
    take = 10,
    count,
    findMany
}: {
    skip?: number,
    take?: number,
    count: () => Promise<number>,
    findMany: (args: IPaginationArgs) => Promise<T[]>
}): Promise<IPaginationResult<T>> => {
    const total = await count();
    const items = await findMany({ skip, take });
    const totalPages = Math.ceil(+total / take);
    const currentPage = (skip / take) + 1;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
        items,
        total,
        totalPages,
        currentPage,
        nextPage
    };
}
  