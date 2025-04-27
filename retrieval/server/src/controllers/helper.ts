import { FilterQuery, QueryOrderMap, EntityManager, EntityName } from "@mikro-orm/postgresql"

export function httpSuccess(data: object) {
  return { result: "success", msg: "", data }
}

export type SearchCondition<T> = {
  where?: FilterQuery<T> // 默认 {}
  // paging为undefined时不分页。
  paging?: {
    page?: number // 默认1
    perPage?: number // 默认30
  }
  orderBy?: QueryOrderMap<T>
}

export async function findEntities<Entity extends object>(
  em: EntityManager,
  model: EntityName<Entity>,
  condition: SearchCondition<Entity>,
) {
  const where = condition.where || {}

  if (!condition.paging) {
    const items = await em.find(model, where as FilterQuery<Entity>, { orderBy: condition.orderBy })
    return {
      items,
      total: items.length,
    }
  } else {
    const { page = 1, perPage = 30 } = condition.paging ?? {}
    const options = {
      orderBy: condition.orderBy,
      limit: perPage,
      offset: (page - 1) * perPage,
    }
    const [items, total] = await em.findAndCount(model, where as FilterQuery<Entity>, options)
    return {
      items,
      total,
      page,
      perPage,
    }
  }
}
