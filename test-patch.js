import fs from 'fs';
import { patchCss } from './vite-plugin-layout-save.ts';
const css = `
.custom_text_4948a9a2 {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  z-index: 20;
}
`;
console.log(patchCss(css, 'custom_text_4948a9a2', { left: '20%', top: '30%' }));
