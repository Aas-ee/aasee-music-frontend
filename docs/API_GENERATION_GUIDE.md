# 🎵 Music Frontend API 代码生成指南

本指南详细介绍了如何在 Vue.js 音乐前端项目中使用 OpenAPI 代码生成工具 Orval。

## 📋 目录

- [概述](#概述)
- [安装和配置](#安装和配置)
- [使用方法](#使用方法)
- [项目结构](#项目结构)
- [API 使用示例](#api-使用示例)
- [最佳实践](#最佳实践)
- [故障排除](#故障排除)

## 🎯 概述

我们选择了 **Orval** 作为 OpenAPI 代码生成工具，原因如下：

- ✅ **Vue.js 友好**: 完美支持 Vue 3 组合式 API
- ✅ **TypeScript 优先**: 生成完全类型化的代码
- ✅ **灵活配置**: 高度可定制的生成选项
- ✅ **多客户端支持**: 支持 Axios、Fetch、Vue Query 等
- ✅ **活跃维护**: 定期更新，社区活跃

## 🛠 安装和配置

### 1. 已安装的依赖

```bash
# 核心依赖
npm install orval axios --save-dev
npm install prettier rimraf --save-dev
```

### 2. 配置文件

#### `orval.config.ts`
```typescript
import { defineConfig } from 'orval'

export default defineConfig({
  music: {
    input: {
      target: './music.openapi.json',
    },
    output: {
      mode: 'split',
      target: './src/api/generated',
      schemas: './src/types/generated',
      client: 'axios',
      httpClient: 'axios',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
```

### 3. 自定义 Axios 实例

位置: `src/api/mutator/custom-instance.ts`

这个文件提供了：
- 统一的请求/响应拦截器
- 音乐 API 特定的错误处理
- 认证信息管理
- 请求日志记录

## 📁 项目结构

```
src/
├── api/
│   ├── generated/           # 🤖 自动生成的 API 客户端
│   │   └── music.ts
│   ├── mutator/            # 🔧 自定义 HTTP 客户端
│   │   └── custom-instance.ts
│   └── music-api.ts        # 🎵 音乐 API 服务封装
├── types/generated/        # 🤖 自动生成的 TypeScript 类型
│   ├── index.ts
│   └── *.ts
├── composables/           # 🎭 Vue 组合式 API
│   └── useMusicApi.ts
└── views/api/            # 📄 API 示例页面
    └── ApiExample.vue
```

## 🚀 使用方法

### 1. NPM 脚本

```bash
# 生成 API 代码
npm run api:generate

# 监听 OpenAPI 文件变化并自动生成
npm run api:watch

# 清理生成的文件
npm run api:clean
```

### 2. 在 Vue 组件中使用

#### 方式一：使用组合式 API (推荐)

```vue
<script setup lang="ts">
import { useSearchApi, useMusicApiConfig } from '@/composables/useMusicApi'

// 配置 API
const { setBaseUrl, setAuth } = useMusicApiConfig()
setBaseUrl('http://localhost:3000')
setAuth('your-cookie-here')

// 使用搜索 API
const { searchResults, searchLoading, searchByType } = useSearchApi()

const handleSearch = async () => {
  await searchByType({
    keyword: '周杰伦',
    type: 1,
    page_num: '1',
    page_size: '20'
  })
}
</script>
```

#### 方式二：直接使用 API 服务

```vue
<script setup lang="ts">
import MusicApiService from '@/api/music-api'

// 配置
MusicApiService.setBaseUrl('http://localhost:3000')
MusicApiService.setAuth('your-cookie-here')

// 调用 API
const searchResults = await MusicApiService.searchByType({
  keyword: '周杰伦',
  type: 1,
  page_num: '1',
  page_size: '20'
})
</script>
```

### 3. 可用的 API 方法

#### 🔍 搜索相关
- `searchByType()` - 根据关键词搜索
- `searchComplete()` - 搜索建议补全

#### 🎵 歌曲相关
- `getSongUrls()` - 获取歌曲播放 URL
- `getLyric()` - 获取歌词

#### 📋 歌单相关
- `getUserCreatedSonglist()` - 获取用户创建的歌单
- `getSonglist()` - 获取歌单中的歌曲

#### 📊 排行榜相关
- `getTopCategories()` - 获取所有排行榜分类
- `getTopDetail()` - 获取排行榜详情

#### 🎬 MV 相关
- `getMvDetail()` - 获取 MV 详细信息
- `getMvUrls()` - 获取 MV 播放 URL

#### 💬 评论相关
- `getHotComments()` - 获取热门评论

## 🎨 最佳实践

### 1. 类型安全

```typescript
// ✅ 好的做法：使用生成的类型
import type { GetSearchSearchByTypeParams } from '@/types/generated'

const searchParams: GetSearchSearchByTypeParams = {
  keyword: '周杰伦',
  type: 1,
  page_num: '1',
  page_size: '20'
}
```

### 2. 错误处理

```typescript
// ✅ 好的做法：统一错误处理
const { searchResults, searchError, searchByType } = useSearchApi()

try {
  await searchByType(params)
} catch (error) {
  console.error('搜索失败:', error)
  // 显示用户友好的错误信息
}
```

### 3. 响应式状态管理

```vue
<template>
  <div>
    <el-button :loading="searchLoading" @click="handleSearch">
      搜索
    </el-button>
    
    <div v-if="searchResults">
      <!-- 显示搜索结果 -->
    </div>
    
    <div v-if="searchError">
      搜索失败: {{ searchError.message }}
    </div>
  </div>
</template>
```

### 4. 配置管理

```typescript
// ✅ 在应用启动时配置
// main.ts 或 App.vue
import { useMusicApiConfig } from '@/composables/useMusicApi'

const { setBaseUrl, setAuth } = useMusicApiConfig()

// 从环境变量或配置文件读取
setBaseUrl(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000')

// 从本地存储或用户登录状态获取
const userCookie = localStorage.getItem('musicCookie')
if (userCookie) {
  setAuth(userCookie)
}
```

## 🔄 更新 API 代码

### 1. 当 OpenAPI 规范更新时

```bash
# 1. 更新 music.openapi.json 文件
# 2. 重新生成代码
npm run api:generate

# 3. 检查生成的代码
# 4. 更新相关的业务代码（如果有破坏性变更）
```

### 2. 自动化工作流

可以设置 Git hooks 或 CI/CD 流水线来自动生成代码：

```bash
# .husky/pre-commit
npm run api:generate
git add src/api/generated src/types/generated
```

## 🐛 故障排除

### 1. 常见问题

#### Q: 生成失败，提示 OpenAPI 规范验证错误
A: 检查 `music.openapi.json` 文件格式，确保符合 OpenAPI 3.0 规范。

#### Q: 生成的代码中类型错误
A: 运行 `npm run api:clean && npm run api:generate` 重新生成。

#### Q: API 调用失败，网络错误
A: 检查 API 基础 URL 配置和网络连接。

### 2. 调试技巧

```typescript
// 启用详细日志
import { AXIOS_INSTANCE } from '@/api/mutator/custom-instance'

// 查看请求详情
AXIOS_INSTANCE.interceptors.request.use(config => {
  console.log('Request:', config)
  return config
})

// 查看响应详情
AXIOS_INSTANCE.interceptors.response.use(response => {
  console.log('Response:', response)
  return response
})
```

## 📚 相关资源

- [Orval 官方文档](https://orval.dev/)
- [OpenAPI 规范](https://swagger.io/specification/)
- [Vue 3 组合式 API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Axios 文档](https://axios-http.com/)

## 🤝 贡献

如果你发现问题或有改进建议，请：

1. 查看现有的 issues
2. 创建新的 issue 描述问题
3. 提交 Pull Request

---

**注意**: 生成的代码位于 `src/api/generated/` 和 `src/types/generated/` 目录中，请不要手动修改这些文件，因为它们会在下次生成时被覆盖。
