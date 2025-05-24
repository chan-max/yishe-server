/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-23 21:08:32
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-24 23:31:06
 * @FilePath: /design-server/src/ps-ctl/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { readPsd, initializeCanvas } from 'ag-psd';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 初始化 Canvas
initializeCanvas(createCanvas);

export class PsdParser {
  /**
   * 解析PSD文件
   * @param filePath PSD文件路径
   * @returns 解析后的PSD数据
   */
  static async parsePsd(filePath) {
    try {
      // 读取PSD文件
      const buffer = await fs.promises.readFile(filePath);
      
      // 解析PSD文件
      const psd = readPsd(buffer);
      
      // 返回解析结果
      return {
        width: psd.width,
        height: psd.height,
        layers: psd.children?.map((layer) => ({
          name: layer.name,
          visible: layer.visible,
          opacity: layer.opacity,
          blendMode: layer.blendMode,
          width: layer.width,
          height: layer.height,
          left: layer.left,
          top: layer.top,
        })),
      };
    } catch (error) {
      console.error('解析PSD文件失败:', error);
      throw error;
    }
  }

  /**
   * 示例：解析PSD文件并保存图层信息
   * @param psdPath PSD文件路径
   * @param outputPath 输出JSON文件路径
   */
  static async parseAndSave(psdPath, outputPath) {
    try {
      const result = await this.parsePsd(psdPath);
      
      // 将结果保存为JSON文件
      await fs.promises.writeFile(
        outputPath,
        JSON.stringify(result, null, 2),
        'utf-8'
      );
      
      console.log('PSD解析完成，结果已保存到:', outputPath);
      return result;
    } catch (error) {
      console.error('处理PSD文件失败:', error);
      throw error;
    }
  }
}

// 使用示例
async function main() {
  const psdPath = path.join(__dirname, './assets/t.psd');
  const outputPath = path.join(__dirname, './output/psd-info.json');
  
  try {
    await PsdParser.parseAndSave(psdPath, outputPath);
  } catch (error) {
    console.error('程序执行失败:', error);
  }
}

main();