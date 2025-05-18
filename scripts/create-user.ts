/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-19 07:01:14
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-05-19 07:03:22
 * @FilePath: /design-server/scripts/create-user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';

async function createUser() {
  try {
    // 创建应用实例
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // 获取 UserService 实例
    const userService = app.get(UserService);
    
    // 创建用户
    const user = await userService.signup({
      username: 'jackie',
      password: '666666'
    });

    console.log('用户创建成功！', user);
    
    // 关闭应用
    await app.close();
  } catch (error) {
    console.error('创建用户失败：', error);
  }
}

createUser(); 