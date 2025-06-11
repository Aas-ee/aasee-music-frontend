<template>
  <div class="api-example-container">
    <div class="header">
      <h1>🎵 Music API 示例</h1>
      <p>演示如何使用生成的 OpenAPI 客户端</p>
    </div>

    <!-- API 配置 -->
    <el-card class="config-card">
      <template #header>
        <h3>⚙️ API 配置</h3>
      </template>

      <el-form :model="config" label-width="120px">
        <el-form-item label="API 基础 URL">
          <el-input
            v-model="config.baseUrl"
            placeholder="http://localhost:8000"
            @change="updateBaseUrl"
          />
        </el-form-item>

        <el-form-item label="Cookie">
          <el-input
            v-model="config.cookie"
            type="textarea"
            :rows="3"
            placeholder="musickey=Q_H_L_63k3NzTTeUKiufC194izjxXhXo5x7hEfdFhKDGwVDReV_hh_MsCoQsKHboUDX0bDt2I6p95X04icXtl5RjUvxzblCRHYhg96xl1WVlSRTyITGb8lu83du1SZ7vqjLRE-3o4PVv5nYpEMHOzR3PNx1EA; euin=41234312432; ..."
            @change="updateAuth"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 搜索示例 -->
    <el-card class="example-card">
      <template #header>
        <h3>🔍 搜索功能示例</h3>
      </template>

      <el-form :model="searchForm" @submit.prevent="handleSearch">
        <el-form-item label="搜索关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="输入歌曲、歌手或专辑名称"
            @input="handleSearchComplete"
          />
        </el-form-item>

        <el-form-item label="搜索类型">
          <el-select v-model="searchForm.type">
            <el-option label="歌曲" :value="0" />
            <el-option label="专辑" :value="2" />
            <el-option label="歌手" :value="1" />
            <el-option label="歌单" :value="3" />
            <el-option label="MV" :value="4" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
            :loading="searchLoading"
          >
            搜索
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 搜索建议 -->
      <div v-if="suggestions && suggestions.data?.items?.length" class="suggestions">
        <h4>搜索建议：</h4>
        <el-tag
          v-for="(item, index) in suggestions.data.items.slice(0, 5)"
          :key="index"
          class="suggestion-tag"
          @click="selectSuggestion(item.hint || '')"
        >
          {{ item.hint }}
        </el-tag>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchResults" class="search-results">
        <h4>搜索结果：</h4>
        <div v-if="searchResults.data?.length" class="results-list">
          <div
            v-for="(item, index) in searchResults.data.slice(0, 10)"
            :key="index"
            class="result-item"
          >
            <div class="song-info">
              <h5>{{ item.title || item.name || '未知' }}</h5>
              <p v-if="item.singer">
                歌手: {{ Array.isArray(item.singer) ? item.singer.map(s => s.name).join(', ') : item.singer.name }}
              </p>
              <p v-if="item.album">专辑: {{ item.album.name }}</p>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无搜索结果" />
      </div>
    </el-card>

    <!-- 排行榜示例 -->
    <el-card class="example-card">
      <template #header>
        <h3>📊 排行榜功能示例</h3>
      </template>

      <el-button
        type="primary"
        @click="loadTopCategories"
        :loading="categoriesLoading"
      >
        加载排行榜分类
      </el-button>

      <div v-if="categories" class="top-categories">
        <h4>排行榜分类：</h4>
        <div class="categories-grid">
          <el-card
            v-for="(category, index) in categories.data?.slice(0, 6)"
            :key="index"
            class="category-card"
            shadow="hover"
            @click="loadTopDetail(category.toplist?.[0]?.topId)"
          >
            <h5>{{ category.title }}</h5>
            <div v-if="category.toplist?.length" class="toplist-preview">
              <p v-for="(top, idx) in category.toplist.slice(0, 3)" :key="idx">
                {{ top.title }}
              </p>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>

    <!-- 评论示例 -->
    <el-card class="example-card">
      <template #header>
        <h3>💬 评论功能示例</h3>
      </template>

      <el-form :model="commentForm" @submit.prevent="loadComments">
        <el-form-item label="歌曲 ID">
          <el-input
            v-model="commentForm.bizId"
            placeholder="输入歌曲 ID (例如: 1531817)"
          />
          <div class="form-tip">
            💡 提示: 可以尝试这些歌曲ID: 1531817, 5308, 4830342
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="loadComments"
            :loading="loading"
          >
            加载评论
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="comments" class="comments-list">
        <h4>热门评论 ({{ comments.data?.length || 0 }} 条)：</h4>

        <el-empty
          v-if="!comments.data || comments.data.length === 0"
          description="暂无评论数据"
          :image-size="80"
        />

        <div v-else class="comments-container">
        <div
          v-for="(comment, index) in comments.data?.slice(0, 5)"
          :key="index"
          class="comment-item"
        >
          <div class="comment-header">
            <img :src="comment.Avatar" alt="avatar" class="avatar" />
            <span class="nickname">{{ comment.Nick }}</span>
            <span class="praise">👍 {{ comment.PraiseNum }}</span>
          </div>
          <p class="comment-content">{{ comment.Content }}</p>

          <!-- 子评论 -->
          <div v-if="comment.SubComments && comment.SubComments.length > 0" class="sub-comments">
            <div class="sub-comments-header" @click="toggleSubComments(index)">
              <span class="sub-comments-title">
                💬 回复 ({{ comment.SubComments.length }})
                <span class="toggle-icon">
                  {{ expandedComments.has(index) ? '▼' : '▶' }}
                </span>
              </span>
            </div>

            <!-- 展开时显示所有子评论，收起时显示前2条 -->
            <div
              v-for="(subComment, subIndex) in expandedComments.has(index)
                ? comment.SubComments
                : comment.SubComments.slice(0, 2)"
              :key="subIndex"
              class="sub-comment-item"
            >
              <div class="sub-comment-header">
                <img
                  v-if="subComment.Avatar"
                  :src="subComment.Avatar"
                  alt="avatar"
                  class="sub-avatar"
                />
                <div v-else class="sub-avatar-placeholder">👤</div>
                <span class="sub-nickname">{{ subComment.Nick }}</span>
                <span class="sub-praise">👍 {{ subComment.PraiseNum }}</span>
              </div>
              <p class="sub-comment-content">{{ subComment.Content }}</p>
            </div>

            <!-- 显示更多子评论的提示 -->
            <div
              v-if="comment.SubComments.length > 2 && !expandedComments.has(index)"
              class="more-sub-comments"
              @click="toggleSubComments(index)"
            >
              <span class="more-text">
                点击查看全部 {{ comment.SubComments.length }} 条回复 ▼
              </span>
            </div>

            <!-- 收起提示 -->
            <div
              v-if="expandedComments.has(index) && comment.SubComments.length > 2"
              class="collapse-sub-comments"
              @click="toggleSubComments(index)"
            >
              <span class="collapse-text">收起回复 ▲</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  useMusicApiConfig,
  useSearchApi,
  useToplistApi,
  useCommentApi
} from '@/composables/useMusicApi'
import { ElMessage } from 'element-plus'

// API 配置
const { setBaseUrl, setAuth } = useMusicApiConfig()
const config = reactive({
  baseUrl: 'http://localhost:8000',
  cookie: 'musickey=Q_H_L_63k3NzTTeUKiufC194izjxXhXo5x7hEfdFhKDGwVDReV_hh_MsCoQsKHboUDX0bDt2I6p95X04icXtl5RjUvxzblCRHYhg96xl1WVlSRTyITGb8lu83du1SZ7vqjLRE-3o4PVv5nYpEMHOzR3PNx1EA; euin=41234312432;'
})

// 搜索相关
const {
  searchResults,
  searchLoading,
  suggestions,
  searchByType,
  searchComplete
} = useSearchApi()

const searchForm = reactive({
  keyword: '',
  type: 1
})

// 排行榜相关
const {
  categories,
  categoriesLoading,
  topDetail,
  getTopCategories,
  getTopDetail
} = useToplistApi()

// 评论相关
const {
  comments,
  loading,
  getHotComments
} = useCommentApi()

const commentForm = reactive({
  bizId: '97773'
})

// 展开/收起子评论的状态
const expandedComments = ref<Set<number>>(new Set())

// 方法
const updateBaseUrl = () => {
  setBaseUrl(config.baseUrl)
  ElMessage.success('API 基础 URL 已更新')
}

const updateAuth = () => {
  setAuth(config.cookie)
  ElMessage.success('认证信息已更新')
}

const handleSearch = async () => {
  if (!searchForm.keyword.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  try {
    await searchByType({
      keyword: searchForm.keyword,
      search_type: searchForm.type,
      page_num: '1',
      page_size: '20'
    })
    ElMessage.success('搜索完成')
  } catch (error) {
    ElMessage.error('搜索失败')
  }
}

const handleSearchComplete = async () => {
  if (searchForm.keyword.trim().length > 1) {
    try {
      await searchComplete({
        keyword: searchForm.keyword,
        cookie: config.cookie
      })
    } catch (error) {
      console.warn('搜索建议获取失败')
    }
  }
}

const selectSuggestion = (suggestion: string) => {
  searchForm.keyword = suggestion
  handleSearch()
}

const loadTopCategories = async () => {
  try {
    await getTopCategories()
    ElMessage.success('排行榜分类加载完成')
  } catch (error) {
    ElMessage.error('排行榜分类加载失败')
  }
}

const loadTopDetail = async (topId?: string) => {
  if (!topId) return

  try {
    await getTopDetail({ top_id: topId })
    ElMessage.success('排行榜详情加载完成')
  } catch (error) {
    ElMessage.error('排行榜详情加载失败')
  }
}

const loadComments = async () => {
  if (!commentForm.bizId.trim()) {
    ElMessage.warning('请输入歌曲 ID')
    return
  }

  try {
    await getHotComments({
      biz_id: commentForm.bizId,
      page_num: '1',
      page_size: '10',
      cookie: config.cookie
    })
    ElMessage.success('评论加载完成')
    // 重置展开状态
    expandedComments.value.clear()
  } catch (error) {
    ElMessage.error('评论加载失败')
  }
}

// 切换子评论展开状态
const toggleSubComments = (commentIndex: number) => {
  if (expandedComments.value.has(commentIndex)) {
    expandedComments.value.delete(commentIndex)
  } else {
    expandedComments.value.add(commentIndex)
  }
}

// 初始化
updateBaseUrl()
</script>

<style lang="scss" scoped>
.api-example-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;

  h1 {
    color: #409eff;
    margin-bottom: 10px;
  }
}

.form-tip {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.config-card,
.example-card {
  margin-bottom: 20px;
}

.suggestions {
  margin: 15px 0;

  .suggestion-tag {
    margin-right: 8px;
    margin-bottom: 8px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}

.search-results {
  margin-top: 20px;

  .results-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .result-item {
    padding: 10px;
    border-bottom: 1px solid #eee;

    .song-info {
      h5 {
        margin: 0 0 5px 0;
        color: #333;
      }

      p {
        margin: 2px 0;
        color: #666;
        font-size: 12px;
      }
    }
  }
}

.top-categories {
  margin-top: 20px;

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }

  .category-card {
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    h5 {
      margin: 0 0 10px 0;
      color: #409eff;
    }

    .toplist-preview p {
      margin: 2px 0;
      font-size: 12px;
      color: #666;
    }
  }
}

.comments-list {
  margin-top: 20px;

  .comment-item {
    padding: 15px;
    border-bottom: 1px solid #eee;

    .comment-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
      }

      .nickname {
        font-weight: bold;
        margin-right: 10px;
        color: #333;
      }

      .praise {
        color: #f56c6c;
        font-size: 12px;
      }
    }

    .comment-content {
      margin: 0 0 10px 0;
      line-height: 1.5;
      color: #333;
    }

    // 子评论样式
    .sub-comments {
      margin-top: 12px;
      padding-left: 20px;
      border-left: 3px solid #e6f7ff;
      background-color: #fafafa;
      border-radius: 4px;
      padding: 10px 15px;

      .sub-comments-header {
        margin-bottom: 8px;
        cursor: pointer;
        user-select: none;

        &:hover {
          opacity: 0.8;
        }

        .sub-comments-title {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .toggle-icon {
            font-size: 10px;
            margin-left: 5px;
            transition: transform 0.2s ease;
          }
        }
      }

      .sub-comment-item {
        margin-bottom: 8px;
        padding-bottom: 8px;

        &:not(:last-child) {
          border-bottom: 1px solid #e8e8e8;
        }

        .sub-comment-header {
          display: flex;
          align-items: center;
          margin-bottom: 4px;

          .sub-avatar {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 6px;
            object-fit: cover;
          }

          .sub-avatar-placeholder {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 6px;
            background-color: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #999;
          }

          .sub-nickname {
            font-weight: 500;
            margin-right: 8px;
            color: #555;
            font-size: 13px;
          }

          .sub-praise {
            color: #f56c6c;
            font-size: 11px;
          }
        }

        .sub-comment-content {
          margin: 0;
          line-height: 1.4;
          color: #555;
          font-size: 13px;
          padding-left: 26px;
        }
      }

      .more-sub-comments,
      .collapse-sub-comments {
        margin-top: 8px;
        text-align: center;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #e6f7ff;
        }

        .more-text,
        .collapse-text {
          color: #409eff;
          font-size: 12px;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .collapse-sub-comments {
        .collapse-text {
          color: #999;
        }
      }
    }
  }
}
</style>
