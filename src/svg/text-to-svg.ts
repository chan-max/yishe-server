/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-26 06:39:46
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-26 07:01:57
 * @FilePath: /design-server/src/svg/text-to-svg.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as TextToSVG from 'text-to-svg';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const text = '你好，世界！';

async function main() {
    // 下载字体文件
    const fontUrl = 'https://1s-1257307499.cos.ap-beijing.myqcloud.com/1748139249983_1s_ChillRoundM.otf';
    const fontPath = path.join(__dirname, 'ChillRoundM.otf');
    if (!fs.existsSync(fontPath)) {
        const res = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(fontPath, res.data);
    }

    // 使用 ChillRoundM 字体
    const textToSVG = TextToSVG.loadSync(fontPath);
    const svg = textToSVG.getSVG(text, {
        fontSize: 72,
        anchor: 'center',
        attributes: {
            fill: '#000000',
            stroke: '#000000',
            'stroke-width': '1'
        }
    });
    fs.writeFileSync(path.join(__dirname, 'output_default.svg'), svg);
    console.log('SVG已生成: output_default.svg');
}

main(); 