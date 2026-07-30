import fs from 'node:fs';
import path from 'node:path';


const root = path.resolve(import.meta.dirname, '..');
const expoPath = path.join(root, 'expo.html');
const originalBundlePath = path.join(root, 'assets/index-9aNYj2SZ.js');
const heroBundlePath = path.join(root, 'assets/index-hero-only.js');
const expoCssPath = path.join(root, 'assets/expo-body.css');
const expoJsPath = path.join(root, 'assets/expo-body.js');
const indexPath = path.join(root, 'index.html');


const between = (source, start, end) => {
  const left = source.indexOf(start);
  const right = source.indexOf(end, left + start.length);
  if (left < 0 || right < 0) {
    throw new Error(`Missing build boundary: ${start} … ${end}`);
  }
  return source.slice(left + start.length, right);
};


const expo = fs.readFileSync(expoPath, 'utf8');
const originalBundle = fs.readFileSync(originalBundlePath, 'utf8');

const appMarker = originalBundle.lastIndexOf('function b(){return');
const createRootMarker = originalBundle.indexOf('createRoot', appMarker);
if (appMarker < 0 || createRootMarker < 0) {
  throw new Error('React application render boundary not found');
}

const appSegment = originalBundle.slice(appMarker, createRootMarker);
const componentCalls = [
  ...appSegment.matchAll(
    /\(0,([A-Za-z_$][\w$]*)\.jsx\)\(([A-Za-z_$][\w$]*),\{\}\)/g,
  ),
];
if (componentCalls.length !== 3) {
  throw new Error(`Expected Navigation, Hero, and Body render calls; found ${componentCalls.length}`);
}

const bodyCall = componentCalls[2][0];
const heroOnlySegment = appSegment.replace(`,${bodyCall}`, '');
if (heroOnlySegment === appSegment) {
  throw new Error('Could not remove the React Body render call');
}
const heroOnlyBundle = originalBundle.replace(appSegment, heroOnlySegment);

const expoBody = between(expo, '</header>', '<script>');
const expoScript = between(expo, '<script>', '</script>').trim();
const expoStyles = between(expo, '<style>', '</style>')
  .replace(/^(\s*):root\s*\{/m, '$1:scope {')
  .replace(/^(\s*)html\s*\{/gm, '$1:scope {')
  .replace(/^(\s*)body\s*\{/gm, '$1:scope {');
const scopedStyles = `@scope (#expo-content) {\n${expoStyles}\n}\n`;

const index = `<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/smarty-msm/img/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SMARTY — ระบบบริหารนิติบุคคลอาคารชุด by msm</title>
    <meta name="description" content="SMARTY ระบบบริหารนิติบุคคลอาคารชุดโดย msm — จ่ายค่าส่วนกลาง รับใบเสร็จออนไลน์ แจ้งเตือนพัสดุ จองงานช่าง ครบ จบ ในแอปเดียว" />
    <meta property="og:title" content="SMARTY — ระบบบริหารนิติบุคคลอาคารชุด" />
    <meta property="og:description" content="ยกระดับการอยู่อาศัยสู่ความสมาร์ทที่สมบูรณ์แบบ — งานนิติบุคคล การเงิน และบริการลูกบ้าน ครบ จบ ในแอปเดียว" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
    <script type="module" crossorigin src="/smarty-msm/assets/index-hero-only.js"></script>
    <link rel="stylesheet" crossorigin href="/smarty-msm/assets/index-CQp2J6RA.css">
    <link rel="stylesheet" href="./assets/expo-body.css">
  </head>
  <body>
    <div id="root"></div>
    <div id="expo-content">${expoBody}</div><!-- /expo-content -->
    <script src="./assets/expo-body.js"></script>
  </body>
</html>
`;

fs.writeFileSync(heroBundlePath, heroOnlyBundle);
fs.writeFileSync(expoCssPath, scopedStyles);
fs.writeFileSync(expoJsPath, `${expoScript}\n`);
fs.writeFileSync(indexPath, index);

console.log('Built React Hero + scoped Expo body');
