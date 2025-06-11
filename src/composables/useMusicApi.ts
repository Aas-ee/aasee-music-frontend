/**
 * Vue Composable for Music API
 * 提供响应式的音乐 API 调用方法，集成到 Vue 3 组合式 API 中
 */

import { ref, computed } from 'vue'
import MusicApiService from '@/api/music-api'
import type {
  GetCommentGetHotCommentsParams,
  GetSearchCompleteParams,
  GetSearchSearchByTypeParams,
  GetSongGetSongUrlsParams,
  GetLyricGetLyricParams,
  GetUserGetCreatedSonglistParams,
  GetSonglistGetSonglistParams,
  GetMvGetDetailParams,
  GetMvGetMvUrlsParams,
  GetTopGetDetailParams,
} from '@/types/generated'

/**
 * 通用的 API 调用状态管理
 */
export function useApiState<T>() {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async (apiCall: () => Promise<T>) => {
    try {
      loading.value = true
      error.value = null
      data.value = await apiCall()
      return data.value
    } catch (err) {
      error.value = err as Error
      console.error('API Error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    execute,
    reset,
  }
}

/**
 * 音乐 API 配置
 */
export function useMusicApiConfig() {
  const setBaseUrl = (url: string) => {
    MusicApiService.setBaseUrl(url)
  }

  const setAuth = (cookie?: string, token?: string) => {
    MusicApiService.setAuth(cookie, token)
  }

  return {
    setBaseUrl,
    setAuth,
  }
}

/**
 * 评论相关 API
 */
export function useCommentApi() {
  const { data, loading, error, execute, reset } = useApiState()

  const getHotComments = (params: GetCommentGetHotCommentsParams) => {
    return execute(() => MusicApiService.getHotComments(params))
  }

  return {
    comments: data,
    loading,
    error,
    getHotComments,
    reset,
  }
}

/**
 * 搜索相关 API
 */
export function useSearchApi() {
  const searchState = useApiState()
  const completeState = useApiState()

  const searchByType = (params: GetSearchSearchByTypeParams) => {
    return searchState.execute(() => MusicApiService.searchByType(params))
  }

  const searchComplete = (params: GetSearchCompleteParams) => {
    return completeState.execute(() => MusicApiService.searchComplete(params))
  }

  return {
    // 搜索结果
    searchResults: searchState.data,
    searchLoading: searchState.loading,
    searchError: searchState.error,
    searchByType,
    resetSearch: searchState.reset,

    // 搜索建议
    suggestions: completeState.data,
    suggestionsLoading: completeState.loading,
    suggestionsError: completeState.error,
    searchComplete,
    resetSuggestions: completeState.reset,
  }
}

/**
 * 歌曲相关 API
 */
export function useSongApi() {
  const urlsState = useApiState()
  const lyricState = useApiState()

  const getSongUrls = (params: GetSongGetSongUrlsParams) => {
    return urlsState.execute(() => MusicApiService.getSongUrls(params))
  }

  const getLyric = (params: GetLyricGetLyricParams) => {
    return lyricState.execute(() => MusicApiService.getLyric(params))
  }

  return {
    // 歌曲 URL
    songUrls: urlsState.data,
    urlsLoading: urlsState.loading,
    urlsError: urlsState.error,
    getSongUrls,
    resetUrls: urlsState.reset,

    // 歌词
    lyric: lyricState.data,
    lyricLoading: lyricState.loading,
    lyricError: lyricState.error,
    getLyric,
    resetLyric: lyricState.reset,
  }
}

/**
 * 歌单相关 API
 */
export function usePlaylistApi() {
  const userPlaylistsState = useApiState()
  const playlistSongsState = useApiState()

  const getUserCreatedSonglist = (params: GetUserGetCreatedSonglistParams) => {
    return userPlaylistsState.execute(() => MusicApiService.getUserCreatedSonglist(params))
  }

  const getSonglist = (params: GetSonglistGetSonglistParams) => {
    return playlistSongsState.execute(() => MusicApiService.getSonglist(params))
  }

  return {
    // 用户歌单
    userPlaylists: userPlaylistsState.data,
    userPlaylistsLoading: userPlaylistsState.loading,
    userPlaylistsError: userPlaylistsState.error,
    getUserCreatedSonglist,
    resetUserPlaylists: userPlaylistsState.reset,

    // 歌单歌曲
    playlistSongs: playlistSongsState.data,
    playlistSongsLoading: playlistSongsState.loading,
    playlistSongsError: playlistSongsState.error,
    getSonglist,
    resetPlaylistSongs: playlistSongsState.reset,
  }
}

/**
 * 排行榜相关 API
 */
export function useToplistApi() {
  const categoriesState = useApiState()
  const detailState = useApiState()

  const getTopCategories = () => {
    return categoriesState.execute(() => MusicApiService.getTopCategories())
  }

  const getTopDetail = (params: GetTopGetDetailParams) => {
    return detailState.execute(() => MusicApiService.getTopDetail(params))
  }

  return {
    // 排行榜分类
    categories: categoriesState.data,
    categoriesLoading: categoriesState.loading,
    categoriesError: categoriesState.error,
    getTopCategories,
    resetCategories: categoriesState.reset,

    // 排行榜详情
    topDetail: detailState.data,
    topDetailLoading: detailState.loading,
    topDetailError: detailState.error,
    getTopDetail,
    resetTopDetail: detailState.reset,
  }
}

/**
 * MV 相关 API
 */
export function useMvApi() {
  const detailState = useApiState()
  const urlsState = useApiState()

  const getMvDetail = (params: GetMvGetDetailParams) => {
    return detailState.execute(() => MusicApiService.getMvDetail(params))
  }

  const getMvUrls = (params: GetMvGetMvUrlsParams) => {
    return urlsState.execute(() => MusicApiService.getMvUrls(params))
  }

  return {
    // MV 详情
    mvDetail: detailState.data,
    mvDetailLoading: detailState.loading,
    mvDetailError: detailState.error,
    getMvDetail,
    resetMvDetail: detailState.reset,

    // MV URL
    mvUrls: urlsState.data,
    mvUrlsLoading: urlsState.loading,
    mvUrlsError: urlsState.error,
    getMvUrls,
    resetMvUrls: urlsState.reset,
  }
}
