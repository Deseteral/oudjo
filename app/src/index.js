import { Settings } from './src/settings';

let settings;

document.addEventListener('DOMContentLoaded', () => {
  console.info('[CORE] UI loaded');

  settings = new Settings();
  settings.load();
});

console.log(`%coudjo v${require('../package.json').version}`,
  'font-size: 48px; background: ' +
    '-webkit-linear-gradient(top, #CDDC39 0%,#8BC34A 100%);' +
    '-webkit-background-clip: text;' +
    '-webkit-text-fill-color: transparent;');
