// src/gateways/events.gateway.ts

import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');
  private heartbeatInterval = 30000; // 30 seconds
  private heartbeatTimeout = 10000; // 10 seconds



  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }



  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Set up heartbeat
    let heartbeatTimer: NodeJS.Timeout;

    const heartbeat = () => {
      clearTimeout(heartbeatTimer);
      heartbeatTimer = setTimeout(() => {
        client.disconnect(true);
      }, this.heartbeatTimeout);
    };

    client.on('heartbeat', () => {
      heartbeat();
    });

    // Send initial heartbeat
    heartbeat();

    // Send periodic heartbeat
    const interval = setInterval(() => {
      client.emit('heartbeat');
    }, this.heartbeatInterval);

    client.on('disconnect', () => {
      this.logger.log(`Client disconnected: ${client.id}`);
      clearInterval(interval);
      clearTimeout(heartbeatTimer);
    });
  }

  
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
    this.logger.log(`Received message from ${client.id}: ${data}`);
    this.server.emit('message', `Server received: ${data}`);
  }
}