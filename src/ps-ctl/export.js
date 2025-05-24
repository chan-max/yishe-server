/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 09:11:36
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-24 12:11:42
 * @FilePath: /design-server/src/ps-ctl/export.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as fs from 'fs';
import 'ag-psd/initialize-canvas'; // only needed for reading image data and thumbnails
import { readPsd } from 'ag-psd';

const buffer = fs.readFileSync('./assets/t.psd');

// read only document structure
const psd1 = readPsd(buffer, { skipLayerImageData: true, skipCompositeImageData: true, skipThumbnail: true });
console.log(psd1);

// read document structure and image data
const psd2 = readPsd(buffer);
console.log(psd2);
// by defaults `canvas` field type is HTMLCanvasElement, so it needs to be cast to `any`
// or node-canvas `Canvas` type, in order to call `toBuffer` method
fs.writeFileSync('layer-1.png', (psd2.children[0].canvas).toBuffer());