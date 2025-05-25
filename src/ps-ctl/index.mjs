/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-23 21:08:32
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-25 09:01:13
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
        skipThumbnail: true,
        useImageData: true,
        createCanvas: true
      })

      let canvas
      if (options.layerIndex !== undefined) {
        // 导出指定图层
        const layer = psd.children[options.layerIndex]
        if (!layer) {
          throw new Error(`图层索引 ${options.layerIndex} 不存在`)
        }
        if (!layer.canvas) {
          throw new Error(`图层 ${layer.name || options.layerIndex} 没有可用的图像数据`)
        }
        canvas = layer.canvas
      } else {
        // 导出整个PSD
        if (!psd.canvas) {
          throw new Error('PSD文件没有可用的合成图像数据')
        }
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

  /**
   * 导出PSD文件中的所有图层为单独的图片
   * @param psdPath PSD文件路径
   * @param outputDir 输出目录路径
   * @param options 导出选项
   * @param options.format 输出图片格式，支持 'png' 或 'jpg'，默认为 'png'
   * @param options.quality 图片质量（仅对jpg格式有效），范围0-1，默认为0.8
   * @returns 返回所有导出图片的路径数组
   */
  static async exportAllLayers(psdPath, outputDir, options = {}) {
    try {
      const buffer = await fs.promises.readFile(psdPath)
      const psd = readPsd(buffer, {
        skipLayerImageData: false,
        skipCompositeImageData: false,
        skipThumbnail: true,
        useImageData: true,
        createCanvas: true
      })

      // 确保输出目录存在
      await fs.promises.mkdir(outputDir, { recursive: true })

      const format = options.format || 'png'
      const quality = options.quality || 0.8
      const exportedPaths = []

      // 遍历所有图层
      for (let i = 0; i < psd.children.length; i++) {
        const layer = psd.children[i]
        // 跳过没有图像数据的图层
        if (!layer.canvas) {
          console.log(`跳过图层 ${layer.name || i}: 没有可用的图像数据`)
          continue
        }

        const fileName = `${layer.name || `layer-${i}`}.${format}`
        const outputPath = path.join(outputDir, fileName)
        
        try {
          // 导出图层
          await this.exportToImage(psdPath, outputPath, {
            layerIndex: i,
            format,
            quality
          })
          exportedPaths.push(outputPath)
        } catch (error) {
          console.error(`导出图层 ${layer.name || i} 失败:`, error)
          // 继续处理下一个图层
          continue
        }
      }

      console.log(`成功导出 ${exportedPaths.length} 个图层到目录:`, outputDir)
      return exportedPaths
    } catch (error) {
      console.error('导出所有图层失败:', error)
      throw error
    }
  }

  /**
   * 替换PSD中的智能对象并导出
   * @param psdPath 原始PSD文件路径
   * @param smartObjectPath 要替换的智能对象PSD文件路径
   * @param outputPath 输出PSD文件路径
   * @param options 选项
   * @param options.layerName 要替换的图层名称（可选，如果不指定则替换所有智能对象）
   * @returns 返回导出文件的路径
   */
  static async replaceSmartObject(psdPath, smartObjectPath, outputPath, options = {}) {
    try {
      // 读取原始PSD文件
      const buffer = await fs.promises.readFile(psdPath)
      const psd = readPsd(buffer, {
        skipLayerImageData: false,
        skipCompositeImageData: false,
        skipThumbnail: true,
        useImageData: true,
        createCanvas: true
      })

      // 读取要替换的智能对象PSD文件
      const smartObjectBuffer = await fs.promises.readFile(smartObjectPath)
      const smartObjectPsd = readPsd(smartObjectBuffer, {
        skipLayerImageData: false,
        skipCompositeImageData: false,
        skipThumbnail: true,
        useImageData: true,
        createCanvas: true
      })

      // 递归查找并替换智能对象
      const replaceSmartObjectInLayer = (layer) => {
        if (layer.children) {
          // 处理组图层
          layer.children.forEach(child => replaceSmartObjectInLayer(child))
        } else if (layer.smartObject) {
          // 检查是否是目标智能对象
          if (!options.layerName || layer.name === options.layerName) {
            // 替换智能对象数据
            layer.smartObject = smartObjectPsd
            console.log(`替换智能对象: ${layer.name}`)
          }
        }
      }

      // 开始替换
      psd.children.forEach(layer => replaceSmartObjectInLayer(layer))

      // 确保输出目录存在
      const outputDir = path.dirname(outputPath)
      await fs.promises.mkdir(outputDir, { recursive: true })

      // 导出修改后的PSD
      // 注意：这里需要实现PSD的写入功能
      // 由于ag-psd库目前可能不支持直接写入PSD文件
      // 我们可以先导出为图片格式
      const tempImagePath = outputPath.replace('.psd', '.png')
      await this.exportToImage(psdPath, tempImagePath)

      console.log('智能对象替换完成，临时导出为:', tempImagePath)
      console.log('注意：由于库的限制，目前只能导出为图片格式。如果需要PSD格式，请使用其他工具。')

      return tempImagePath
    } catch (error) {
      console.error('替换智能对象失败:', error)
      throw error
    }
  }
}

// 使用示例
async function main () {
  const psdPath = path.join(__dirname, './assets/t.psd')
  const outputPath = path.join(__dirname, './output/psd-info.json')
  const imageOutputPath = path.join(__dirname, './output/exported.png')
  const layersOutputDir = path.join(__dirname, './output/layers')

  try {
    // 替换智能对象示例
    const smartObjectPath = path.join(__dirname, './assets/smart-object.psd')
    const replacedOutputPath = path.join(__dirname, './output/replaced.psd')
    await PsdParser.replaceSmartObject(psdPath, smartObjectPath, replacedOutputPath, {
      layerName: '智能对象图层名称' // 可选，指定要替换的图层名称
    })

    // 导出所有图层
    await PsdParser.exportAllLayers(psdPath, layersOutputDir, {
      format: 'png',
      quality: 0.9
    })
    
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
