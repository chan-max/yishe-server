/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-23 21:08:32
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-25 19:29:58
 * @FilePath: /design-server/src/ps-ctl/index.ts
 * @Description: PSD文件导出工具
 */
import { readPsd, initializeCanvas } from 'ag-psd'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { createCanvas, loadImage } from 'canvas'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 初始化 Canvas
initializeCanvas(createCanvas)

export class PsdParser {
  /**
   * 将PSD文件导出为图片
   * @param psdPath PSD文件路径
   * @param outputPath 输出图片路径
   * @param options 导出选项
   * @param options.format 输出图片格式，支持 'png' 或 'jpg'，默认为 'png'
   * @param options.quality 图片质量（仅对jpg格式有效），范围0-1，默认为0.8
   */
  static async exportToImage(psdPath, outputPath, options = {}) {
    try {
      const buffer = await fs.promises.readFile(psdPath)
      const psd = readPsd(buffer, {
        skipLayerImageData: false,
        skipCompositeImageData: false,
        skipThumbnail: true,
        useImageData: true,
        createCanvas: true,
        generateComposite: true
      })

      // 新建合成画布
      const canvas = createCanvas(psd.width, psd.height)
      const ctx = canvas.getContext('2d')

      // 递归遍历所有图层，合成到画布
      function drawLayers(layers) {
        if (!layers) return
        for (const layer of layers) {
          console.log('[图层]', {
            name: layer.name,
            visible: layer.visible,
            opacity: layer.opacity,
            left: layer.left,
            top: layer.top,
            width: layer.width,
            height: layer.height,
            hasCanvas: !!layer.canvas
          })
          if (layer.canvas && layer.visible !== false && (layer.opacity === undefined || layer.opacity > 0)) {
            ctx.globalAlpha = layer.opacity !== undefined ? layer.opacity : 1
            ctx.drawImage(layer.canvas, layer.left || 0, layer.top || 0)
          }
          if (layer.children) {
            drawLayers(layer.children)
          }
        }
      }
      drawLayers(psd.children)

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
async function main() {
  const psdPath = path.join(__dirname, './assets/t.psd')
  const imageOutputPath = path.join(__dirname, './output/exported.png')

  try {
    // 导出整个PSD为PNG
    await PsdParser.exportToImage(psdPath, imageOutputPath)
  } catch (error) {
    console.error('程序执行失败:', error)
  }
}

main()
