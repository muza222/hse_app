const ruRu = require('./src/assets/i18n/ru-RU.json');
const enUs = require('./src/assets/i18n/en-US.json');

let diffs = {};
const ruValues = {};

/**
 * Ключи (полный путь через точку), которые не нужно учитывать при проверке.
 * Если нужно пропустить целый блок, достаточно указать только его ключ,
 * без перечисления всех внутренних ключей
 *
 * Если указано, например, пропустить ключ до 3 уровня,
 * но при этом в других файлах перводов нет второго уровня, будет ошибка.
 *
 * Т.к. идет сравнение ru-RU переводов со всеми остальными,
 * то наличие переводов в другом файле и его отсутствие в ru-RU, ошибки не вызовет.
 * Можно и не добавлять ключ в массив skipKeys.
 */
const skipKeys = [
];

run();

function run() {
  let error = false;

  diff(ruRu, enUs);
  error = error || Object.entries(diffs).length > 0;
  writeDiff('ru-RU', 'en-US', diffs);

  // todo НЕ УДАЛЯТЬ!!!!
  findRu(enUs);

  console.log('====================================================================');
  console.log('en.json ru values');
  console.log(ruValues);

  if (error) {
    console.log();
    console.error('\x1b[31m%s\x1b[0m', 'Fix translations!');
    process.exit(1);
  }
}

function writeDiff(lang1, lang2, diff) {
  console.log('====================================================================');
  console.log(`Diffs between ${lang1} & ${lang2}`);
  console.log(diff);
  console.log();
}

/**
 * Поиск потерянных ключей
 */
function diff(ob1, ob2) {
  for (const key in ob1) {
    if (ob1.hasOwnProperty(key)) {
      compare(ob1[key], ob2[key], key, null);
    }
  }
}

function compare(x, y, key, parentKey) {
  const pkey = parentKey ? `${parentKey}.${key}` : key;

  if (skipKeys.includes(pkey)) {
    return;
  }

  if (y === undefined) {
    diffs[pkey] = null;

    return;
  }

  if (typeof x === 'string') {
    return;
  }

  const keys = Object.keys(x);
  if (keys.length === 0) {
    return;
  }

  if (Array.isArray(x)) {
    if (!arraysMatch(x, y)) {
      diffs[pkey] = y;
    }

    return;
  }

  for (const k of keys) {
    compare(x[k], y[k], k, pkey);
  }
}

/**
 * Поиск русских переводов
 */
function findRu(ob) {
  for (const key in ob) {
    if (ob.hasOwnProperty(key)) {
      checkTranslations(ob[key], key, null);
    }
  }
}

function checkTranslations(x, key, parentKey) {
  const pkey = parentKey ? `${parentKey}.${key}` : key;

  if (typeof x === 'string') {
    const res = /[а-яА-Я]+/.test(x);

    if (res) {
      ruValues[pkey] = x;
    }

    return;
  }

  const keys = Object.keys(x);
  if (keys.length === 0) {
    return;
  }

  for (const k of keys) {
    checkTranslations(x[k], k, pkey);
  }
}


function arraysMatch(x, y) {
  if (x.length !== y.length) {
    return false;
  }

  // for (let i = 0; i < x.length; i++) {
  //   if (x[i] !== y[i]) {
  //     return false;
  //   }
  // }

  return true;
}

