import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { RestoreUserUseCase } from '../../restore-user.usecase'

describe('RestoreUserUseCase unit tests', () => {
  let sut: RestoreUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new RestoreUserUseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found using id fakeId'),
    )
  })

  it('Should restore a soft deleted user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    entity.softDelete() // Soft delete the entity first
    repository.items = [entity]

    expect(entity.isDeleted()).toBe(true)

    await sut.execute({ id: entity._id })

    expect(entity.isDeleted()).toBe(false)
    expect(entity.deletedAt).toBeNull()
  })
})
