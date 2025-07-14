
docker run --name postgresql \
  --privileged \
  -e POSTGRES_PASSWORD=666666 \
  -p 5432:5432 \
  -v /data/postgres:/var/lib/postgresql/data \
  -d postgres



# 启动redis

## 配置文件在 mydata/redis下


docker run --name my-redis \
-p 6379:6379 \
-v /mydata/redis/data:/data \
--restart always \
-d redis --protected-mode no



# AI接口

## 阿里云千问大模型（兼容OpenAI风格）

POST /ai/qwen-chat

请求体示例：
```
{
  "model": "qwen-vl-max",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "image_url", "image_url": { "url": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/dog_and_girl.jpeg" } },
        { "type": "text", "text": "这是什么？" }
      ]
    }
  ]
}
```

可选参数：
- apiKey: 覆盖服务端环境变量的API Key
- baseURL: 覆盖默认API地址

返回：
- 详见阿里云千问API文档，结构与OpenAI兼容




