/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-24 09:11:36
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-25 00:17:37
 * @FilePath: /design-server/src/ps-ctl/export.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as fs from 'fs';
import 'ag-psd/initialize-canvas.js'; // only needed for reading image data and thumbnails
import { readPsd } from 'ag-psd';