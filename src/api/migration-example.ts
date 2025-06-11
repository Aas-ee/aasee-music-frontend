/**
 * 迁移示例：从旧的 API 调用方式迁移到新的生成代码
 * 
 * 这个文件展示了如何将现有的 API 调用替换为使用 Orval 生成的代码
 */

// ==================== 旧的 API 调用方式 ====================

// 旧方式：手动构建请求
/*
import { apiService } from '@/services/api'

// 获取热门评论 - 旧方式
const getHotCommentsOld = async (bizId: string, pageNum: string, pageSize: string, cookie?: string) => {
  return apiService.getHotComments({
    biz_id: bizId,
    page_num: pageNum,
    page_size: pageSize,
    cookie
  })
}

// 搜索补全 - 旧方式
const searchCompleteOld = async (keyword: string, cookie: string) => {
  return apiService.searchComplete({
    keyword,
    cookie
  })
}
*/

// ==================== 新的 API 调用方式 ====================

import MusicApiService from './music-api'
import { useCommentApi, useSearchApi } from '@/composables/useMusicApi'

// 新方式：使用生成的类型安全的 API

/**
 * 评论相关 API 迁移示例
 */
export class CommentApiMigration {
  // 新方式 1：直接使用 API 服务
  static async getHotComments(bizId: string, pageNum: string = '1', pageSize: string = '10', cookie?: string) {
    return MusicApiService.getHotComments({
      biz_id: bizId,
      page_num: pageNum,
      page_size: pageSize,
      cookie
    })
  }

  // 新方式 2：在 Vue 组件中使用组合式 API
  static useHotComments() {
    const { comments, loading, error, getHotComments, reset } = useCommentApi()
    
    const loadComments = async (bizId: string, pageNum: string = '1', pageSize: string = '10', cookie?: string) => {
      return getHotComments({
        biz_id: bizId,
        page_num: pageNum,
        page_size: pageSize,
        cookie
      })
    }

    return {
      comments,
      loading,
      error,
      loadComments,
      reset
    }
  }
}

/**
 * 搜索相关 API 迁移示例
 */
export class SearchApiMigration {
  // 新方式 1：搜索补全
  static async searchComplete(keyword: string, cookie: string) {
    return MusicApiService.searchComplete({
      keyword,
      cookie
    })
  }

  // 新方式 2：按类型搜索
  static async searchByType(
    keyword: string, 
    type: number = 1, 
    pageNum: string = '1', 
    pageSize: string = '20'
  ) {
    return MusicApiService.searchByType({
      keyword,
      type,
      page_num: pageNum,
      page_size: pageSize
    })
  }

  // 新方式 3：在 Vue 组件中使用
  static useSearch() {
    const {
      searchResults,
      searchLoading,
      suggestions,
      suggestionsLoading,
      searchByType,
      searchComplete,
      resetSearch,
      resetSuggestions
    } = useSearchApi()

    const performSearch = async (keyword: string, type: number = 1) => {
      return searchByType({
        keyword,
        type,
        page_num: '1',
        page_size: '20'
      })
    }

    const getSuggestions = async (keyword: string, cookie: string) => {
      return searchComplete({
        keyword,
        cookie
      })
    }

    return {
      // 状态
      searchResults,
      searchLoading,
      suggestions,
      suggestionsLoading,
      
      // 方法
      performSearch,
      getSuggestions,
      resetSearch,
      resetSuggestions
    }
  }
}

/**
 * 歌单相关 API 迁移示例
 */
export class PlaylistApiMigration {
  // 获取用户创建的歌单
  static async getUserPlaylists(uin: string, cookie: string) {
    return MusicApiService.getUserCreatedSonglist({
      uin,
      cookie
    })
  }

  // 获取歌单详情
  static async getPlaylistSongs(id: string, cookie: string) {
    return MusicApiService.getSonglist({
      id,
      cookie
    })
  }
}

/**
 * 歌曲相关 API 迁移示例
 */
export class SongApiMigration {
  // 获取歌曲播放 URL
  static async getSongUrls(songIds: string[], cookie: string) {
    return MusicApiService.getSongUrls({
      id: songIds.join(','),
      cookie
    })
  }

  // 获取歌词
  static async getLyric(songId: string, cookie: string) {
    return MusicApiService.getLyric({
      id: songId,
      cookie
    })
  }
}

/**
 * 排行榜相关 API 迁移示例
 */
export class ToplistApiMigration {
  // 获取所有排行榜分类
  static async getTopCategories() {
    return MusicApiService.getTopCategories()
  }

  // 获取排行榜详情
  static async getTopDetail(topId: string) {
    return MusicApiService.getTopDetail({
      top_id: topId
    })
  }
}

// ==================== 迁移指南 ====================

/**
 * 迁移步骤：
 * 
 * 1. 替换导入语句
 *    旧：import { apiService } from '@/services/api'
 *    新：import MusicApiService from '@/api/music-api'
 *    或：import { useCommentApi } from '@/composables/useMusicApi'
 * 
 * 2. 更新 API 调用
 *    旧：apiService.getHotComments(params)
 *    新：MusicApiService.getHotComments(params)
 * 
 * 3. 利用类型安全
 *    新的 API 提供完整的 TypeScript 类型支持
 * 
 * 4. 使用响应式状态（在 Vue 组件中）
 *    使用 useXxxApi() 组合式函数获得响应式状态管理
 * 
 * 5. 统一错误处理
 *    新的 API 提供统一的错误处理机制
 */

// ==================== 使用示例 ====================

// 在 Vue 组件中的使用示例
/*
<script setup lang="ts">
import { onMounted } from 'vue'
import { CommentApiMigration, SearchApiMigration } from '@/api/migration-example'

// 方式 1：直接调用 API
const loadComments = async () => {
  try {
    const comments = await CommentApiMigration.getHotComments('1531817', '1', '10')
    console.log('评论数据:', comments)
  } catch (error) {
    console.error('加载评论失败:', error)
  }
}

// 方式 2：使用组合式 API（推荐）
const { comments, loading, loadComments: loadCommentsReactive } = CommentApiMigration.useHotComments()
const { searchResults, performSearch } = SearchApiMigration.useSearch()

onMounted(() => {
  loadComments()
  loadCommentsReactive('1531817')
})
</script>
*/

export default {
  CommentApiMigration,
  SearchApiMigration,
  PlaylistApiMigration,
  SongApiMigration,
  ToplistApiMigration
}
