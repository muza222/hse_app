const fs = require('fs');
const {promisify} = require('util');
const packages = require('./package');
const process = require('child_process');
const luxon = require('luxon');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const executeCommand = promisify(process.exec);

const EOL = '\n';
const TAB = '\t';
const splitToken = /\s*<!-- BUILD_INFO_CONTAINER -->\s*/i;
const indexHtmlPath = `${__dirname}/dist/epp-frontend-new/index.html`;


// RUN
addBuildInfo();


/**
 * Добавить в index.html информацию о сборке
 */
async function addBuildInfo() {
  try {
    const indexHTML = await readFile(indexHtmlPath, 'utf8');
    const hash = await getHashOfLastCommit();
    const [head, tail] = indexHTML.split(splitToken);
    const versionTEXT = getVersionText(packages.version, hash);

    await writeFile(indexHtmlPath, head + versionTEXT + tail);
    console.log('=== Информация о сборке успешно добавлена ===' + EOL);
    console.log(versionTEXT);
  } catch (err) {
    console.error('=== Произошла ошибка при записи информации о сборке ===' + EOL);
    console.error(err);
  }
}

/**
 * Получить хэш последнего коммита
 */
async function getHashOfLastCommit() {
  let res = '';

  try {
    const {stdout, stderr} = await executeCommand('git rev-parse HEAD', {cwd: __dirname});

    if (!Boolean(stderr)) {
      res += stdout.split(EOL)[0];
    }
  } catch (err) {
    console.error('=== Произошла ошибка при запросе последнего коммита ===' + EOL);
    console.error(err);
  }

  return res;
}

/**
 * Получить текст версии по номеру сборки и хэшу коммита
 */
function getVersionText(build, hash) {
  return (!Boolean(build) && !Boolean(hash))
    ? `${EOL}${TAB}<!-- BUILD_INFO_CONTAINER -->${EOL}`
    : [
      `${EOL}${TAB}${createCommentString('', '=', 48)}`,
      Boolean(build) ? `${TAB}${createCommentString(` BUILD: ${build}`, ' ', 48)}` : '',
      Boolean(hash) ? `${TAB}${createCommentString(` HASH: ${hash}`, ' ', 48)}` : '',
      `${TAB}${createCommentString(` DATE: ${luxon.DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss Z')}`, ' ', 48)}`,
      `${TAB}${createCommentString('', '=', 48)}${EOL}`
    ].filter(Boolean).join(EOL);
}

/**
 * Создать строку комментария
 */
function createCommentString(content, placeholder, length) {
  let comment = '<!-- ===' + content;

  for (let i = content.length; i < length; ++i) {
    comment += placeholder;
  }

  return comment += '=== -->';
}
