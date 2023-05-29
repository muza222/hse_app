const fs = require('fs');
const { exec } = require("child_process");
const { promisify } = require('util');
const packages = require('./package');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const execPromisified = promisify(exec);

const RELEASE_NOTES_PATH = './RELEASE_NOTES.md';
const OLD_VERSION = packages.version;
let newVersion = null;

run();

async function run() {
  await fetchBranches();
  await upVersion();
  await addDiff();
  await add();
  await commit();
  await pushMaster();
  await pushProd();
}

/**
 * Затянуть ветки с сервера
 */
async function fetchBranches() {
  try {
    const {stdout, stderr} = await execPromisified(`git fetch origin`);

    console.log('\x1b[32m%s\x1b[0m', 'git fetch succeeded');
    console.log(stderr);
    console.log(stdout);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/**
 * Поднять версию в package.json
 */
async function upVersion() {
  const versionArray = packages.version.split('.');
  const patch = versionArray.pop();
  const upPatch = parseInt(patch, 10) + 1;
  newVersion = versionArray.concat(upPatch).join('.');
  packages.version = newVersion;

  await writeFile('./package.json', JSON.stringify(packages, null, '  ') + '\n');
}

/**
 * Добавить инфу в RELEASE_NOTES
 */
async function addDiff() {
  try {
    const releaseTitle = `## ${newVersion} ##\n`;

    const {stdout, stderr} = await execPromisified(
      `git log origin/prod-${OLD_VERSION}..HEAD --pretty=format:%s --no-merges`
    );

    if (stderr) {
      console.error(e);
      process.exit(1);
    }

    const releaseNotes = stdout
      .split('\n')
      .filter((commit) => commit.indexOf('version') < 0)
      .map((commit) => `* ${commit}`)
      .join('\n');

    const release = releaseTitle + releaseNotes + '\n\n\n';

    const releaseNotesSource = await readFile(RELEASE_NOTES_PATH, 'utf8');
    await writeFile(RELEASE_NOTES_PATH, release + releaseNotesSource);

    console.log('\x1b[32m%s\x1b[0m', 'Release notes:');
    console.log(release);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}


/**
 * Добавить изменения в индекс
 */
async function add() {
  try {
    const {stdout, stderr} = await execPromisified('git add .');

    if (stderr) {
      console.error(stderr);
      process.exit(1);
    }

    console.log('\x1b[32m%s\x1b[0m', 'git add succeeded');
    console.log(stdout);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/**
 * Закоммитить изменения
 */
async function commit() {
  try {
    const {stdout, stderr} = await execPromisified(`git commit -m "version ${newVersion}"`);

    if (stderr) {
      console.error(stderr);
      process.exit(1);
    }

    console.log('\x1b[32m%s\x1b[0m', 'git commit succeeded');
    console.log(stdout);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}


/**
 * Запушить изменения в мастер
 */
async function pushMaster() {
  try {
    // вывод от push почему-то передан в stderr даже, если команда выполнена успешна
    const {stdout, stderr} = await execPromisified(`git push -o ci.skip`);

    console.log('\x1b[32m%s\x1b[0m', 'git push to master succeeded');
    console.log(stderr);
    console.log(stdout);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/**
 * Запушить в релизную ветку с новым номером
 */
async function pushProd() {
  try {
    const {stdout, stderr} = await execPromisified(`git push origin HEAD:prod-${newVersion}`);

    console.log('\x1b[32m%s\x1b[0m', `git push to prod-${newVersion} succeeded`);
    console.log(stderr);
    console.log(stdout);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
