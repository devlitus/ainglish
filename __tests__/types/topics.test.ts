import { Topics, type Topic } from '@/types/topics'

describe('Topic Types', () => {
  // Extraer valores del enum Topics
  const TOPICS_VALUES = Object.values(Topics)

  test('debe validar los valores esperados del enum Topics', () => {
    expect(TOPICS_VALUES).toContain(Topics.SPORT)
    expect(TOPICS_VALUES).toContain(Topics.EDUCATION)
    expect(TOPICS_VALUES).toContain(Topics.ENTERTAINMENT)
    expect(TOPICS_VALUES).toContain(Topics.BUSINESS)
    expect(TOPICS_VALUES).toContain(Topics.FOOD)
    expect(TOPICS_VALUES).toContain(Topics.TECHNOLOGY)
    expect(TOPICS_VALUES).toContain(Topics.TRAVEL)
    expect(TOPICS_VALUES).toContain(Topics.HEALTH)
  })

  test('debe validar valores específicos del enum', () => {
    expect(Topics.SPORT).toBe('Sport')
    expect(Topics.EDUCATION).toBe('Education')
    expect(Topics.ENTERTAINMENT).toBe('Entertainment')
    expect(Topics.BUSINESS).toBe('Business')
    expect(Topics.FOOD).toBe('Food & Drink')
    expect(Topics.TECHNOLOGY).toBe('Technology')
    expect(Topics.TRAVEL).toBe('Travel')
    expect(Topics.HEALTH).toBe('Health')
  })

  test('debe tener exactamente 8 valores de topics definidos', () => {
    expect(TOPICS_VALUES).toHaveLength(8)
  })

  test('debe validar que los topics no estén vacíos', () => {
    TOPICS_VALUES.forEach(topic => {
      expect(topic).toBeTruthy()
      expect(typeof topic).toBe('string')
      expect(topic.length).toBeGreaterThan(0)
    })
  })

  test('debe permitir IDs con diferentes formatos', () => {
    const validIds = ['123', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'topic_abc123']
    
    validIds.forEach(id => {
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })
  })

  test('debe validar tipos de datos para propiedades de Topic', () => {
    const topic: Topic = {
      id: '1',
      title: Topics.SPORT,
      description: 'Deportes y actividades físicas',
      icon: 'sport-icon',
      colorSchema: 'blue'
    }

    expect(typeof topic.id).toBe('string')
    expect(typeof topic.title).toBe('string')
    expect(typeof topic.description).toBe('string')
    expect(typeof topic.icon).toBe('string')
    expect(typeof topic.colorSchema).toBe('string')

    expect(topic.id).toBeTruthy()
    expect(topic.title).toBeTruthy()
    expect(topic.description).toBeTruthy()
    expect(topic.title).toBe(Topics.SPORT)
  })

  test('debe permitir strings vacíos en propiedades opcionales', () => {
    const topicWithEmptyFields: Topic = {
      id: '1',
      title: Topics.EDUCATION,
      description: 'Test description',
      icon: '', // string vacío
      colorSchema: '' // string vacío
    }

    expect(topicWithEmptyFields.icon).toBe('')
    expect(topicWithEmptyFields.colorSchema).toBe('')
    expect(typeof topicWithEmptyFields.icon).toBe('string')
    expect(typeof topicWithEmptyFields.colorSchema).toBe('string')
  })

  test('debe validar diferentes esquemas de colores', () => {
    const validColorSchemas = ['blue', 'green', 'red', 'purple', 'orange', 'teal', 'gray', 'yellow']
    
    validColorSchemas.forEach(color => {
      expect(typeof color).toBe('string')
      expect(color.length).toBeGreaterThan(0)
      
      const topic: Topic = {
        id: '1',
        title: Topics.TECHNOLOGY,
        description: 'Test',
        icon: 'test-icon',
        colorSchema: color
      }
      
      expect(topic.colorSchema).toBe(color)
    })
  })

  test('debe validar iconos con diferentes formatos', () => {
    const validIcons = ['sport-icon', 'icon_education', 'tech.svg', 'health-v2', '']
    
    validIcons.forEach(icon => {
      expect(typeof icon).toBe('string')
      
      const topic: Topic = {
        id: '1',
        title: Topics.HEALTH,
        description: 'Test',
        icon: icon,
        colorSchema: 'blue'
      }
      
      expect(topic.icon).toBe(icon)
    })
  })

  test('debe crear topics con todos los valores del enum', () => {
    const allTopics: Topic[] = Object.values(Topics).map((topicTitle, index) => ({
      id: String(index + 1),
      title: topicTitle,
      description: `Descripción para ${topicTitle}`,
      icon: `${topicTitle.toLowerCase()}-icon`,
      colorSchema: 'blue'
    }))

    expect(allTopics).toHaveLength(8)
    allTopics.forEach((topic, index) => {
      expect(topic.title).toBe(Object.values(Topics)[index])
      expect(typeof topic.id).toBe('string')
      expect(typeof topic.description).toBe('string')
      expect(typeof topic.icon).toBe('string')
      expect(typeof topic.colorSchema).toBe('string')
    })
  })
})
