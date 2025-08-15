# Funcionalidades de Soft Delete e Restore para Usuários

Este documento descreve as novas funcionalidades de soft delete e restore implementadas no sistema de usuários.

## Campos Adicionados

Foram adicionados os seguintes campos à entidade User:

- `updatedAt`: DateTime - Atualizado automaticamente quando o usuário é modificado
- `deletedAt`: DateTime? - Null quando o usuário está ativo, com data quando foi deletado

## Funcionalidades Implementadas

### 1. Soft Delete
O soft delete marca um usuário como deletado sem removê-lo fisicamente do banco de dados.

**Endpoint**: `PATCH /users/:id/soft-delete`

**Comportamento**:
- Define `deletedAt` com a data/hora atual
- Atualiza `updatedAt`
- Usuário não aparece mais nas consultas normais
- Preserva todos os dados para possível recuperação

### 2. Restore (Restaurar)
Restaura um usuário que foi deletado via soft delete.

**Endpoint**: `PATCH /users/:id/restore`

**Comportamento**:
- Define `deletedAt` como `null`
- Atualiza `updatedAt`
- Usuário volta a aparecer nas consultas normais

### 3. Hard Delete
Remove permanentemente o usuário do banco de dados.

**Endpoint**: `DELETE /users/:id`

**Comportamento**:
- Remove completamente o registro do banco
- Ação irreversível

## Filtros Automáticos

Todas as consultas normais foram atualizadas para filtrar automaticamente usuários deletados:

- `findAll()` - Retorna apenas usuários ativos
- `findById()` - Busca apenas entre usuários ativos
- `findByEmail()` - Busca apenas entre usuários ativos
- `search()` - Pesquisa apenas entre usuários ativos

## Métodos Especiais

Para acessar usuários deletados, use os métodos especiais:

- `findAllIncludingDeleted()` - Retorna todos os usuários (ativos e deletados)
- `findByIdIncludingDeleted()` - Busca usuário por ID incluindo deletados

## Métodos da Entidade

A entidade UserEntity agora possui:

- `softDelete()` - Marca como deletado
- `restore()` - Remove a marca de deletado
- `isDeleted()` - Verifica se está deletado
- `touch()` - Atualiza o updatedAt (método privado)

## Exemplo de Uso

```typescript
// Criar usuário
const user = new UserEntity({
  name: 'João Silva',
  email: 'joao@email.com',
  password: 'senha123'
});

// Soft delete
user.softDelete();
console.log(user.isDeleted()); // true

// Restore
user.restore();
console.log(user.isDeleted()); // false

// Via use cases
await softDeleteUserUseCase.execute({ id: userId });
await restoreUserUseCase.execute({ id: userId });
```

## Migração de Banco

Foi executada a migração `add-updated-at-and-deleted-at-fields` que:
- Adiciona campo `updatedAt` (obrigatório, com valor padrão de atualização automática)
- Adiciona campo `deletedAt` (opcional, null por padrão)

## Benefícios

1. **Segurança**: Dados não são perdidos permanentemente
2. **Auditoria**: Histórico completo de mudanças
3. **Recuperação**: Possibilidade de desfazer exclusões
4. **Performance**: Consultas normais continuam rápidas (usuários ativos)
5. **Flexibilidade**: Escolha entre soft e hard delete conforme necessário
