import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '@/users/infrastructure/users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { INestApplication } from '@nestjs/common'
import { applyGlobalConfig } from '@/global-config'
import request from 'supertest'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { HashProvider } from '@/shared/application/providers/hash-provider'

describe('UsersController e2e tests - Search without accents', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let hashProvider: HashProvider
  let accessToken: string

  const prismaService = new PrismaClient()

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
    repository = module.get<UserRepository.Repository>('UserRepository')
    hashProvider = module.get<HashProvider>('HashProvider')
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()

    // Criar usuário para login
    const loginUser = new UserEntity(
      UserDataBuilder({
        email: 'login@test.com',
        password: await hashProvider.generateHash('123456'),
      }),
    )
    await repository.insert(loginUser)

    // Fazer login para obter token
    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'login@test.com', password: '123456' })
      .expect(200)

    accessToken = loginResponse.body.accessToken
  })

  afterAll(async () => {
    await module.close()
  })

  describe('GET /users - search without accents', () => {
    it('should find users with accents when searching without accents', async () => {
      // Criar usuários com acentos
      const users = [
        new UserEntity(
          UserDataBuilder({
            email: 'erick@test.com',
            name: 'Érick Nilson',
            password: await hashProvider.generateHash('123456'),
          }),
        ),
        new UserEntity(
          UserDataBuilder({
            email: 'jose@test.com',
            name: 'José Silva',
            password: await hashProvider.generateHash('123456'),
          }),
        ),
        new UserEntity(
          UserDataBuilder({
            email: 'andre@test.com',
            name: 'André Costa',
            password: await hashProvider.generateHash('123456'),
          }),
        ),
      ]

      await Promise.all(users.map(user => repository.insert(user)))

      // Buscar por "erick" (sem acento) deve encontrar "Érick Nilson"
      const response1 = await request(app.getHttpServer())
        .get('/users')
        .query({ filter: 'erick' })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response1.body.data).toHaveLength(1)
      expect(response1.body.data[0].name).toBe('Érick Nilson')

      // Buscar por "jose" (sem acento) deve encontrar "José Silva"
      const response2 = await request(app.getHttpServer())
        .get('/users')
        .query({ filter: 'jose' })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response2.body.data).toHaveLength(1)
      expect(response2.body.data[0].name).toBe('José Silva')

      // Buscar por "andre" (sem acento) deve encontrar "André Costa"
      const response3 = await request(app.getHttpServer())
        .get('/users')
        .query({ filter: 'andre' })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response3.body.data).toHaveLength(1)
      expect(response3.body.data[0].name).toBe('André Costa')
    })

    it('should find users regardless of case and accents', async () => {
      const user = new UserEntity(
        UserDataBuilder({
          email: 'test@example.com',
          name: 'ÉRICK NILSON',
          password: await hashProvider.generateHash('123456'),
        }),
      )

      await repository.insert(user)

      // Testar diferentes combinações de case e acentos
      const testCases = ['erick', 'ERICK', 'Erick', 'érick', 'ÉRICK']

      for (const searchTerm of testCases) {
        const response = await request(app.getHttpServer())
          .get('/users')
          .query({ filter: searchTerm })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)

        expect(response.body.data).toHaveLength(1)
        expect(response.body.data[0].name).toBe('ÉRICK NILSON')
      }
    })

    it('should find partial matches ignoring accents', async () => {
      const user = new UserEntity(
        UserDataBuilder({
          email: 'test@example.com',
          name: 'Érick Nilson Souza',
          password: await hashProvider.generateHash('123456'),
        }),
      )

      await repository.insert(user)

      // Testar busca por partes do nome
      const partialSearches = ['erick', 'nilson', 'souza']

      for (const searchTerm of partialSearches) {
        const response = await request(app.getHttpServer())
          .get('/users')
          .query({ filter: searchTerm })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)

        expect(response.body.data).toHaveLength(1)
        expect(response.body.data[0].name).toBe('Érick Nilson Souza')
      }
    })
  })
})
