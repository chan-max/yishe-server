/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-26 07:09:36
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-26 08:31:08
 * @FilePath: /design-server/src/svg/text-to-png.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createCanvas, registerFont } from 'canvas';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { CosService } from '../common/cos.service';

// 默认配置
const defaultConfig = {
  // 文字内容
  text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  
  // 字体配置
  font: {
    url: 'https://1s-1257307499.cos.ap-beijing.myqcloud.com/1748215622119_1s_Heart%20Breaking%20Bad.otf',
    name: 'HeartBreakingBad',
    size: 144
  },
  
  // 画布配置
  canvas: {
    width: 2400,
    height: 800,
    background: 'transparent'
  },
  
  // 文字样式
  textStyle: {
    color: '#000000',
    align: 'center' as CanvasTextAlign,
    baseline: 'middle' as CanvasTextBaseline
  },
  
  // 输出配置
  output: {
    filename: 'output.png',
    directory: __dirname
  }
};

// 生成图片的函数
export async function generateImage(config = defaultConfig) {
  const fontFile = path.join(config.output.directory, `${config.font.name}.otf`);
  const outputFile = path.join(config.output.directory, config.output.filename);

  // 实例化CosService
  const cosService = new CosService();

  try {
    // 1. 下载字体
    if (!fs.existsSync(fontFile)) {
      console.log('开始下载字体文件...');
      const res = await axios.get(config.font.url, { responseType: 'arraybuffer' });
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
    registerFont(fontFile, { family: config.font.name });
    console.log('字体注册成功');

    // 3. 创建画布
    const canvas = createCanvas(config.canvas.width, config.canvas.height);
    const ctx = canvas.getContext('2d');
    
    // 4. 背景
    if (config.canvas.background !== 'transparent') {
      ctx.fillStyle = config.canvas.background;
      ctx.fillRect(0, 0, config.canvas.width, config.canvas.height);
    }

    // 5. 设置字体
    ctx.font = `${config.font.size}px "${config.font.name}"`;
    ctx.fillStyle = config.textStyle.color;
    ctx.textAlign = config.textStyle.align;
    ctx.textBaseline = config.textStyle.baseline;

    // 6. 绘制文字
    ctx.fillText(config.text, config.canvas.width / 2, config.canvas.height / 2);

    // 7. 导出 PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputFile, buffer);

    console.log('PNG图片已生成:', outputFile);

    // 8. 使用CosService上传到COS
    const fileObj = {
      originalname: config.output.filename,
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
  // 使用默认配置（透明背景）
  await generateImage();
  
  // 使用自定义配置示例
  /*
  await generateImage({
    text: 'Hello World',
    font: {
      url: 'https://example.com/font.ttf',
      name: 'CustomFont',
      size: 72
    },
    canvas: {
      width: 1200,
      height: 400,
      background: '#f0f0f0' // 或 'transparent' 表示透明
    },
    textStyle: {
      color: '#333333',
      align: 'center',
      baseline: 'middle'
    },
    output: {
      filename: 'custom.png',
      directory: __dirname
    }
  });
  */
}

// main(); 