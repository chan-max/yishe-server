// import { JwtService } from '@nestjs/jwt';
import { IPageResult, Pagination, } from 'src/utils/pagination';
import { createQueryCondition } from 'src/utils/utils';

export class BasicService {


  // 获取分页内容
  async getPageFn({
    post,
    repo,
    where,
    entity,
    queryBuilderHook
  }: any) {

    const page = (post.currentPage - 1) * post.pageSize;
    const limit = post.pageSize;

    const pagination = new Pagination(
      { current: post.currentPage, size: post.pageSize },
      entity,
    );

    var qb = (repo).createQueryBuilder()

    var db = qb
      .skip(page)
      .take(limit)
      .where(where || createQueryCondition(post, []))

    if (queryBuilderHook) {
      queryBuilderHook(db)
    }

    if (post.random) {
      qb.orderBy('RAND()')
    }

    const result = await pagination.findByPage(db);
    return result;
  }
}
