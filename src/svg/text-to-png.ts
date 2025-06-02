/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-26 07:09:36
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-30 06:35:18
 * @FilePath: /design-server/src/svg/text-to-png.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createCanvas, registerFont } from 'canvas';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { CosService } from '../common/cos.service';

// 生成图片的函数
export async function generateImage({
  text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  fontUrl = 'https://1s-1257307499.cos.ap-beijing.myqcloud.com/1748215622119_1s_Heart%20Breaking%20Bad.otf',
  fontName = 'HeartBreakingBad',
  fontSize = 144,
  canvasWidth = 2400,
  canvasHeight = 800,
  canvasBackground = 'transparent',
  textColor = '#000000',
  textAlign = 'center' as CanvasTextAlign,
  textBaseline = 'middle' as CanvasTextBaseline,
  outputFilename = 'output.png',
  outputDirectory = __dirname
}) {
  const fontFile = path.join(outputDirectory, `${fontName}.otf`);
  const outputFile = path.join(outputDirectory, outputFilename);

  // 实例化CosService
  const cosService = new CosService();

  try {
    // 1. 下载字体
    if (!fs.existsSync(fontFile)) {
      console.log('开始下载字体文件...');
      const res = await axios.get(fontUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(fontFile, res.data);
      console.log('字体文件下载完成:', fontFile);
    } else {
      console.log('字体文件已存在:', fontFile);
    }
    
    // 检查字体文件是否存在
    if (!fs.existsSync(fontFile)) {
      throw new Error('字体文件下载失败');
    }
    console.log('字体文件大小:', fs.statSync(fontFile).size, '字节');

    // 2. 注册字体
    console.log('开始注册字体...');
    registerFont(fontFile, { family: fontName });
    console.log('字体注册成功');

    // 3. 创建画布
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    
    // 4. 背景
    if (canvasBackground !== 'transparent') {
      ctx.fillStyle = canvasBackground;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // 5. 设置字体
    ctx.font = `${fontSize}px "${fontName}"`;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;

    // 6. 绘制文字
    ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

    // 7. 导出 PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputFile, buffer);

    console.log('PNG图片已生成:', outputFile);

    // 8. 使用CosService上传到COS
    const fileObj = {
      originalname: outputFilename,
      buffer: buffer
    };
    const uploadResult = await cosService.uploadFile(fileObj as any);
    console.log('已上传到COS:', uploadResult.url);
    return uploadResult.url;
  } catch (error) {
    console.error('发生错误:', error);
    throw error;
  }
}

// 使用示例
async function main() {
  // 使用默认参数
//   await generateImage({});
  
  // 使用自定义参数示例
  /*
  await generateImage({
    text: 'Hello World',
    fontUrl: 'https://example.com/font.ttf',
    fontName: 'CustomFont',
    fontSize: 72,
    canvasWidth: 1200,
    canvasHeight: 400,
    canvasBackground: '#f0f0f0',
    textColor: '#333333',
    textAlign: 'center',
    textBaseline: 'middle',
    outputFilename: 'custom.png',
    outputDirectory: __dirname
  });
  */
}

main();