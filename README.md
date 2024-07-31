
docker run --name postgresql \
  --privileged \
  -e POSTGRES_PASSWORD=666666 \
  -p 5432:5432 \
  -v /data/postgres:/var/lib/postgresql/data \
  -d postgres