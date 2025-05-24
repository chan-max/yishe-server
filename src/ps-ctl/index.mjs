/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-23 21:08:32
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-25 00:21:03
 * @FilePath: /design-server/src/ps-ctl/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { readPsd, initializeCanvas } from 'ag-psd'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { createCanvas } from 'canvas'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 初始化 Canvas
initializeCanvas(createCanvas)

export class PsdParser {
  /**
   * 解析PSD文件
   * @param filePath PSD文件路径
   * @returns 解析后的PSD数据
   */
  static async parsePsd (filePath) {
    try {
      // 读取PSD文件
      const buffer = await fs.promises.readFile(filePath)

      // 解析PSD文件
      const psd = readPsd(buffer)

      // 返回解析结果
      return {
        width: psd.width,
        height: psd.height,
        layers: psd.children?.map(layer => ({
          name: layer.name,
          visible: layer.visible,
          opacity: layer.opacity,
          blendMode: layer.blendMode,
          width: layer.width,
          height: layer.height,
          left: layer.left,
          top: layer.top
        }))
      }
    } catch (error) {
      console.error('解析PSD文件失败:', error)
      throw error
    }
  }

  /**
   * 示例：解析PSD文件并保存图层信息
   * @param psdPath PSD文件路径
   * @param outputPath 输出JSON文件路径
   */
  static async parseAndSave (psdPath, outputPath) {
    try {
      const result = await this.parsePsd(psdPath)

      // 将结果保存为JSON文件
      await fs.promises.writeFile(
        outputPath,
        JSON.stringify(result, null, 2),
        'utf-8'
      )

      console.log('PSD解析完成，结果已保存到:', outputPath)
      return result
    } catch (error) {
      console.error('处理PSD文件失败:', error)
      throw error
    }
  }

  /**
   * 将PSD文件导出为图片
   * @param psdPath PSD文件路径
   * @param outputPath 输出图片路径
   * @param options 导出选项
   * @param options.layerIndex 要导出的图层索引，如果不指定则导出整个PSD
   * @param options.format 输出图片格式，支持 'png' 或 'jpg'，默认为 'png'
   * @param options.quality 图片质量（仅对jpg格式有效），范围0-1，默认为0.8
   */
  static async exportToImage(psdPath, outputPath, options = {}) {
    try {
      const buffer = await fs.promises.readFile(psdPath)
      const psd = readPsd(buffer, {
        skipLayerImageData: false,
        skipCompositeImageData: false,
        skipThumbnail: true
      })

      let canvas
      if (options.layerIndex !== undefined) {
        // 导出指定图层
        const layer = psd.children[options.layerIndex]
        if (!layer) {
          throw new Error(`图层索引 ${options.layerIndex} 不存在`)
        }
        canvas = layer.canvas
      } else {
        // 导出整个PSD
        canvas = psd.canvas
      }

      // 确保输出目录存在
      const outputDir = path.dirname(outputPath)
      await fs.promises.mkdir(outputDir, { recursive: true })

      // 根据格式导出图片
      const format = options.format || 'png'
      const quality = options.quality || 0.8

      if (format === 'jpg') {
        await fs.promises.writeFile(
          outputPath,
          canvas.toBuffer('image/jpeg', { quality })
        )
      } else {
        await fs.promises.writeFile(
          outputPath,
          canvas.toBuffer('image/png')
        )
      }

      console.log('图片导出完成:', outputPath)
      return outputPath
    } catch (error) {
      console.error('导出图片失败:', error)
      throw error
    }
  }
}

// 使用示例
async function main () {
  const psdPath = path.join(__dirname, './assets/t.psd')
  const outputPath = path.join(__dirname, './output/psd-info.json')
  const imageOutputPath = path.join(__dirname, './output/exported.png')

  try {
    // 导出整个PSD为PNG
    await PsdParser.exportToImage(psdPath, imageOutputPath)
    
    // 导出第一个图层为JPG
    const layerImagePath = path.join(__dirname, './output/layer-1.jpg')
    await PsdParser.exportToImage(psdPath, layerImagePath, {
      layerIndex: 0,
      format: 'jpg',
      quality: 0.9
    })

    const buffer = fs.readFileSync(psdPath)
    const psd1 = readPsd(buffer, {
      skipLayerImageData: true,
      skipCompositeImageData: true,
      skipThumbnail: true
    })
    console.log(psd1)
  } catch (error) {
    console.error('程序执行失败:', error)
  }
}

main()
