import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'
import { StringUtils } from '@/shared/utils/string.utils'

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository.Repository
{
  sortableFields: string[] = ['name', 'createdAt', 'updatedAt']

  async search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    // Filter out deleted items first
    const activeItems = this.items.filter(item => !item.isDeleted())
    const tempItems = this.items
    this.items = activeItems
    const result = await super.search(props)
    this.items = tempItems
    return result
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find(
      item => item.email === email && !item.isDeleted(),
    )
    if (!entity) {
      throw new NotFoundError(`Entity not found using email ${email}`)
    }
    return entity
  }

  async emailExists(email: string): Promise<void> {
    const entity = this.items.find(
      item => item.email === email && !item.isDeleted(),
    )
    if (entity) {
      throw new ConflictError('Email address already used')
    }
  }

  async findById(id: string): Promise<UserEntity> {
    const entity = this.items.find(item => item.id === id && !item.isDeleted())
    if (!entity) {
      throw new NotFoundError(`Entity not found using id ${id}`)
    }
    return entity
  }

  async findAll(): Promise<UserEntity[]> {
    return this.items.filter(item => !item.isDeleted())
  }

  async findAllIncludingDeleted(): Promise<UserEntity[]> {
    return this.items
  }

  async findByIdIncludingDeleted(id: string): Promise<UserEntity> {
    const entity = this.items.find(item => item.id === id)
    if (!entity) {
      throw new NotFoundError(`Entity not found using id ${id}`)
    }
    return entity
  }

  async softDelete(id: string): Promise<void> {
    const entity = await this.findById(id)
    entity.softDelete()
  }

  async restore(id: string): Promise<void> {
    const entity = await this.findByIdIncludingDeleted(id)
    entity.restore()
  }

  protected async applyFilter(
    items: UserEntity[],
    filter: UserRepository.Filter,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return items
    }
    return items.filter(item => {
      return StringUtils.includesIgnoreAccents(item.props.name, filter)
    })
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir)
  }
}
