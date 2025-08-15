import { StringUtils } from '../../string.utils'

describe('StringUtils unit tests', () => {
  describe('removeAccents', () => {
    it('should remove accents from string', () => {
      const testCases = [
        { input: 'Érick', expected: 'erick' },
        { input: 'José', expected: 'jose' },
        { input: 'André', expected: 'andre' },
        { input: 'Ação', expected: 'acao' },
        { input: 'Coração', expected: 'coracao' },
        { input: 'Normal', expected: 'normal' },
        { input: 'ÉRICK', expected: 'erick' },
      ]

      testCases.forEach(({ input, expected }) => {
        expect(StringUtils.removeAccents(input)).toBe(expected)
      })
    })
  })

  describe('includesIgnoreAccents', () => {
    it('should find strings ignoring accents and case', () => {
      const testCases = [
        { haystack: 'Érick Nilson', needle: 'erick', expected: true },
        { haystack: 'Érick Nilson', needle: 'ERICK', expected: true },
        { haystack: 'José Silva', needle: 'jose', expected: true },
        { haystack: 'André Costa', needle: 'andre', expected: true },
        { haystack: 'Normal Name', needle: 'normal', expected: true },
        { haystack: 'Érick Nilson', needle: 'carlos', expected: false },
        { haystack: 'José Silva', needle: 'joão', expected: false },
      ]

      testCases.forEach(({ haystack, needle, expected }) => {
        expect(StringUtils.includesIgnoreAccents(haystack, needle)).toBe(
          expected,
        )
      })
    })

    it('should find partial matches ignoring accents', () => {
      expect(
        StringUtils.includesIgnoreAccents('Érick Nilson Souza', 'erick'),
      ).toBe(true)
      expect(
        StringUtils.includesIgnoreAccents('Érick Nilson Souza', 'nilson'),
      ).toBe(true)
      expect(
        StringUtils.includesIgnoreAccents('Érick Nilson Souza', 'souza'),
      ).toBe(true)
      expect(StringUtils.includesIgnoreAccents('João Paulo', 'joao')).toBe(true)
      expect(StringUtils.includesIgnoreAccents('João Paulo', 'paulo')).toBe(
        true,
      )
    })
  })
})
