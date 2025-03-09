import { Injectable } from '@nestjs/common'
import { Md } from './entities/md.entity'

@Injectable()
export class MdService {
  private mds: Md[] = []
  private idCounter = 1 // ID自增计数器

  // 创建新的记录
  createMd (content: string, type: string): Md {
    const newMd: any = {
      content,
      type,
    }
    this.mds.push(newMd)
    return newMd
  }

  // 获取所有记录
  getAllMds (): Md[] {
    return this.mds
  }

  // 根据ID获取指定记录
  getMdById (id: number): Md {
    return this.mds.find(md => md.id === id)
  }

  // 根据类型获取记录
  getMdsByType (type: string): Md[] {
    return this.mds.filter(md => md.type === type)
  }

  // 更新记录
  updateMd (id: number, content: string, type: string): Md {
    const md = this.getMdById(id)
    if (md) {
      md.content = content
      md.type = type
      md.updateTime = new Date()
      return md
    }
    return null
  }
}
