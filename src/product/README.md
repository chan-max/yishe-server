# 商品管理模块

## 新增功能：商品发布状态管理

### isPublish 字段说明

- **字段类型**: `boolean`
- **默认值**: `false` (未发布)
- **说明**: 控制商品是否发布，用于区分草稿和正式发布的商品

### API 接口

#### 1. 更新商品发布状态
```
POST /product/updatePublish
Content-Type: application/json

{
  "id": "商品ID",
  "isPublish": true
}
```

#### 2. 分页查询商品（支持发布状态过滤）
```
POST /product/page
Content-Type: application/json

{
  "page": 1,
  "pageSize": 10,
  "isPublish": true  // 可选：true-只查询已发布，false-只查询未发布，不传-查询全部
}
```

#### 3. 更新商品（包含发布状态）
```
POST /product/update
Content-Type: application/json

{
  "id": "商品ID",
  "isPublish": true,
  // ... 其他字段
}
```

### 使用场景

1. **草稿管理**: 创建商品时默认为未发布状态，可以保存为草稿
2. **发布控制**: 只有发布状态的商品才会在前端展示
3. **批量操作**: 可以批量更新商品的发布状态
4. **状态过滤**: 在管理后台可以分别查看已发布和未发布的商品

### 数据库变更

新增字段会自动同步到数据库，无需手动执行 SQL 语句。 