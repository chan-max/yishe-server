
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




