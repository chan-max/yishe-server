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

    if (where) {
      qb.where(where)
    }

    if (queryBuilderHook) {
      queryBuilderHook(qb)
    }

    qb.skip(page).take(limit)

    if (post.random) {
      qb.orderBy('RAND()')
    }

    const result = await pagination.findByPage(qb);
    return result;
  }
}
