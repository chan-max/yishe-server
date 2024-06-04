import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';


export class BasicService {
    async getPageFn({
      post,repo,where,entity,queryBuilderName,
      queryBuilderHook
    }:any) {
        const page = (post.currentPage - 1) * post.pageSize;
        const limit = page + post.pageSize;
        const pagination = new Pagination(
          { current: post.currentPage, size: post.pageSize },
          entity,
        );

        var qb =  (repo).createQueryBuilder()
 

        var db = qb
          .skip(page)
          .take(limit)
          .where(where || createQueryCondition(post, []))     
          
          if(queryBuilderHook){
            queryBuilderHook(db)
          }

        console.log(db.getSql())

        const result =  await pagination.findByPage(db);
        return result;
      }
}
