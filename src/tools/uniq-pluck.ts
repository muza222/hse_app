import { compact as _compact, flow as _flow, map as _map, uniq as _uniq } from 'lodash/fp';

/**
 * Выдергиваем значения необходимых полей, выкидываем falsely значения и повторы
 * Применяется для выдергивания полей примитивного типа
 * @param request {string} Имя поля, допускается нотация через точку для доступа ко вложенным полям
 * @returns {Function}
 */
export default (request) => _flow([
  _map(request), _compact, _uniq
]);
