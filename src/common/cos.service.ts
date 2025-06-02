import { Injectable } from '@nestjs/common';
import * as COS from 'cos-nodejs-sdk-v5';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CosService {
  private cos: COS;
  private readonly config = {
    SecretId: 'AKIDMdmaMD0uiNwkVH0gTJFKXaXJyV4hHmAL',
    SecretKey: 'HPdigqyzpgTNICCQnK0ZF6zrrpkbL4un',
    Bucket: '1s-1257307499',
    Region: 'ap-beijing'
  };

  constructor() {
    this.cos = new COS({
      SecretId: this.config.SecretId,
      SecretKey: this.config.SecretKey,
    });
  }

  /**
   * 上传文件到 COS
   * @param file 文件对象
   * @param key 文件在 COS 中的存储路径
   */
  async uploadFile(file: Express.Multer.File, key?: string): Promise<{ url: string; key: string }> {
    const fileKey = key || `${new Date().getTime()}_1s_${file.originalname}`;
    
    try {
      const result = await this.cos.putObject({
        Bucket: this.config.Bucket,
        Region: this.config.Region,
        Key: fileKey,
        Body: file.buffer,
      });

      return {
        url: `https://${result.Location}`,
        key: fileKey,
      };
    } catch (error) {
      throw new Error(`上传文件失败: ${error.message}`);
    }
  }

  /**
   * 删除 COS 中的文件
   * @param key 文件在 COS 中的存储路径
   */
  async deleteFile(key: string): Promise<void> {
    if (key.startsWith('http')) {
      // 从 URL 中提取相对路径
      const url = new URL(key);
      key = url.pathname.substring(1); // 移除开头的斜杠
    }

    try {
      await this.cos.deleteObject({
        Bucket: this.config.Bucket,
        Region: this.config.Region,
        Key: key,
      });
    } catch (error) {
      throw new Error(`删除文件失败: ${error.message}`);
    }
  }

  /**
   * 下载 COS 中的文件
   * @param key 文件在 COS 中的存储路径
   * @param localPath 本地保存路径
   */
  async downloadFile(key: string, localPath: string): Promise<void> {
    try {
      const result = await this.cos.getObject({
        Bucket: this.config.Bucket,
        Region: this.config.Region,
        Key: key,
      });

      // 确保目录存在
      const dir = path.dirname(localPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 将 Buffer 写入文件
      fs.writeFileSync(localPath, result.Body);
    } catch (error) {
      throw new Error(`下载文件失败: ${error.message}`);
    }
  }

  /**
   * 获取文件的临时访问链接
   * @param key 文件在 COS 中的存储路径
   * @param expires 链接有效期（秒）
   */
  async getTempUrl(key: string, expires = 3600): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        this.cos.getObjectUrl({
          Bucket: this.config.Bucket,
          Region: this.config.Region,
          Key: key,
          Expires: expires,
          Sign: true,
        }, (err, data) => {
          if (err) {
            reject(new Error(`获取临时访问链接失败: ${err.message}`));
          } else {
            resolve(data.Url);
          }
        });
      });
    } catch (error) {
      throw new Error(`获取临时访问链接失败: ${error.message}`);
    }
  }
} 