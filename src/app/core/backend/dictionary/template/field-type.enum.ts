export enum FieldType {
  INPUT = 'INPUT', // обычный селект
  BOOLEAN = 'BOOLEAN', // slide toggle
  REFERENCE = 'REFERENCE', // мульти селект с поиском и чипсами
  ENUM = 'ENUM', // мульти селект с поиском и чипсами, но значения берутся из сущности филда
  TEXTAREA = 'TEXTAREA', // обычная текстареа
  FILE = 'FILE',
  HIDDEN = 'HIDDEN',
  DATE = 'DATE'
}
