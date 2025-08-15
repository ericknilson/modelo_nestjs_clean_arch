export class StringUtils {
  /**
   * Remove acentos e caracteres especiais de uma string
   * @param str String para normalizar
   * @returns String sem acentos
   */
  static removeAccents(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  }

  /**
   * Verifica se uma string contém outra ignorando acentos e case
   * @param haystack String onde buscar
   * @param needle String a buscar
   * @returns Boolean indicando se encontrou
   */
  static includesIgnoreAccents(haystack: string, needle: string): boolean {
    return this.removeAccents(haystack).includes(this.removeAccents(needle))
  }
}
