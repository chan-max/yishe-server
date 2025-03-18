import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

interface SseEvent {
  type: string;
  data: any;
}

@Injectable()
export class SseService {
  private events$ = new Subject<SseEvent>();
  private onlineUsers = new Set<string>();

  // 订阅 SSE 数据流
  get events(): Observable<SseEvent> {
    return this.events$.asObservable();
  }

  // 推送消息
  sendMessage(type: string, data: any) {
    this.events$.next({ type, data });
  }

  // 处理用户上线
  userOnline(userId: string) {
    this.onlineUsers.add(userId);
    this.sendMessage('onlineCount', { onlineCount: this.onlineUsers.size });
  }

  // 处理用户下线
  userOffline(userId: string) {
    this.onlineUsers.delete(userId);
    this.sendMessage('onlineCount', { onlineCount: this.onlineUsers.size });
  }

  // 获取当前在线用户数
  getOnlineCount() {
    return this.onlineUsers.size;
  }
}
