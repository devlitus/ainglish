import { Level } from '@/types/level'

describe('Level Type', () => {
  test('debe tener la estructura correcta para Level', () => {
    const level: Level = {
      id: '1',
      title: 'Principiante',
      description: 'Nivel básico para empezar',
      feature: 'Vocabulario básico',
      difficult: 'Fácil'
    }

    expect(level).toHaveProperty('id')
    expect(level).toHaveProperty('title')
    expect(level).toHaveProperty('description')
    expect(level).toHaveProperty('feature')
    expect(level).toHaveProperty('difficult')

    expect(typeof level.id).toBe('string')
    expect(typeof level.title).toBe('string')
    expect(typeof level.description).toBe('string')
    expect(typeof level.feature).toBe('string')
    expect(typeof level.difficult).toBe('string')
  })

  test('debe aceptar diferentes valores de dificultad', () => {
    const easyLevel: Level = {
      id: '1',
      title: 'Fácil',
      description: 'Descripción',
      feature: 'Feature',
      difficult: 'Fácil'
    }

    const mediumLevel: Level = {
      id: '2',
      title: 'Medio',
      description: 'Descripción',
      feature: 'Feature',
      difficult: 'Medio'
    }

    const hardLevel: Level = {
      id: '3',
      title: 'Difícil',
      description: 'Descripción',
      feature: 'Feature',
      difficult: 'Difícil'
    }

    expect(easyLevel.difficult).toBe('Fácil')
    expect(mediumLevel.difficult).toBe('Medio')
    expect(hardLevel.difficult).toBe('Difícil')
  })

  test('debe permitir strings vacíos en propiedades opcionales', () => {
    const levelWithEmptyFeature: Level = {
      id: '1',
      title: 'Test',
      description: 'Test description',
      feature: '', // string vacío
      difficult: 'Fácil'
    }

    expect(levelWithEmptyFeature.feature).toBe('')
    expect(typeof levelWithEmptyFeature.feature).toBe('string')
  })

  test('debe permitir IDs con diferentes formatos', () => {
    const numericStringId: Level = {
      id: '123',
      title: 'Test',
      description: 'Test',
      feature: 'Test',
      difficult: 'Fácil'
    }

    const uuidId: Level = {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      title: 'Test',
      description: 'Test',
      feature: 'Test',
      difficult: 'Fácil'
    }

    const alphanumericId: Level = {
      id: 'level_abc123',
      title: 'Test',
      description: 'Test',
      feature: 'Test',
      difficult: 'Fácil'
    }

    expect(typeof numericStringId.id).toBe('string')
    expect(typeof uuidId.id).toBe('string')
    expect(typeof alphanumericId.id).toBe('string')
  })
})
