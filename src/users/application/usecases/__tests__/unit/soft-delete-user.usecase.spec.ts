import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { SoftDeleteUserUseCase } from '../../soft-delete-user.usecase'

describe('SoftDeleteUserUseCase unit tests', () => {
  let sut: SoftDeleteUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new SoftDeleteUserUseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found using id fakeId'),
    )
  })

  it('Should soft delete an user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]

    expect(entity.isDeleted()).toBe(false)

    await sut.execute({ id: entity._id })

    expect(entity.isDeleted()).toBe(true)
    expect(entity.deletedAt).toBeInstanceOf(Date)
  })
})
