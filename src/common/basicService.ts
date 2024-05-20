import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';


export class BasicService {
    async getPageFn({
      post,repo,where,entity
    }:any) {
        const page = (post.currentPage - 1) * post.pageSize;
        const limit = page + post.pageSize;
        const pagination = new Pagination(
          { current: post.currentPage, size: post.pageSize },
          entity,
        );
        const db = (repo).createQueryBuilder()
          .skip(page)
          .take(limit)
          .where(where || createQueryCondition(post, []))
          .orderBy('create_time', 'DESC');

        const result =  await pagination.findByPage(db);
        return result;
      }
}
