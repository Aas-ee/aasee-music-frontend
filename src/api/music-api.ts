/**
 * Music API Service - 整合生成的 API 客户端
 * 这个文件提供了一个统一的接口来访问所有音乐相关的 API
 */

import { getMusic } from './generated/music'
import { setMusicApiBaseUrl, setMusicApiAuth } from './mutator/custom-instance'
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
} from '../types/generated'

// 创建 API 实例
const musicApi = getMusic()

/**
 * 音乐 API 服务类
 * 提供了对所有音乐相关 API 的访问方法
 */
export class MusicApiService {
  /**
   * 设置 API 基础 URL
   * @param baseUrl API 基础 URL
   */
  static setBaseUrl(baseUrl: string) {
    setMusicApiBaseUrl(baseUrl)
  }

  /**
   * 设置认证信息
   * @param cookie 用户 cookie
   * @param token 认证 token (可选)
   */
  static setAuth(cookie?: string, token?: string) {
    setMusicApiAuth(cookie, token)
  }

  // ==================== 评论相关 API ====================
  
  /**
   * 获取热门评论
   * @param params 请求参数
   */
  static async getHotComments(params: GetCommentGetHotCommentsParams) {
    return musicApi.getCommentGetHotComments(params)
  }

  // ==================== 搜索相关 API ====================
  
  /**
   * 搜索补全建议
   * @param params 请求参数
   */
  static async searchComplete(params: GetSearchCompleteParams) {
    return musicApi.getSearchComplete(params)
  }

  /**
   * 根据关键词搜索
   * @param params 请求参数
   */
  static async searchByType(params: GetSearchSearchByTypeParams) {
    return musicApi.getSearchSearchByType(params)
  }

  // ==================== 歌曲相关 API ====================
  
  /**
   * 获取歌曲播放 URL
   * @param params 请求参数
   */
  static async getSongUrls(params: GetSongGetSongUrlsParams) {
    return musicApi.getSongGetSongUrls(params)
  }

  /**
   * 获取歌词
   * @param params 请求参数
   */
  static async getLyric(params: GetLyricGetLyricParams) {
    return musicApi.getLyricGetLyric(params)
  }

  // ==================== 歌单相关 API ====================
  
  /**
   * 获取用户创建的歌单
   * @param params 请求参数
   */
  static async getUserCreatedSonglist(params: GetUserGetCreatedSonglistParams) {
    return musicApi.getUserGetCreatedSonglist(params)
  }

  /**
   * 获取歌单中的歌曲列表
   * @param params 请求参数
   */
  static async getSonglist(params: GetSonglistGetSonglistParams) {
    return musicApi.getSonglistGetSonglist(params)
  }

  // ==================== MV 相关 API ====================
  
  /**
   * 获取 MV 详细信息
   * @param params 请求参数
   */
  static async getMvDetail(params: GetMvGetDetailParams) {
    return musicApi.getMvGetDetail(params)
  }

  /**
   * 获取 MV 播放 URL
   * @param params 请求参数
   */
  static async getMvUrls(params: GetMvGetMvUrlsParams) {
    return musicApi.getMvGetMvUrls(params)
  }

  // ==================== 排行榜相关 API ====================
  
  /**
   * 获取所有排行榜分类
   */
  static async getTopCategories() {
    return musicApi.getTopGetTopCategory()
  }

  /**
   * 获取排行榜详情
   * @param params 请求参数
   */
  static async getTopDetail(params: GetTopGetDetailParams) {
    return musicApi.getTopGetDetail(params)
  }

  // ==================== 登录相关 API ====================
  
  /**
   * 建立二维码登录 SSE 连接
   */
  static async subscribeQrcode() {
    return musicApi.getApiQrcodeSubscribe1()
  }

  /**
   * 发起二维码登录请求
   */
  static async startQrcodeLogin() {
    return musicApi.getApiQrcodeStart1()
  }
}

// 导出便捷的 API 方法
export const {
  getCommentGetHotComments,
  getSearchComplete,
  getSearchSearchByType,
  getSongGetSongUrls,
  getLyricGetLyric,
  getUserGetCreatedSonglist,
  getSonglistGetSonglist,
  getMvGetDetail,
  getMvGetMvUrls,
  getTopGetTopCategory,
  getTopGetDetail,
  getApiQrcodeSubscribe1,
  getApiQrcodeStart1,
} = musicApi

// 默认导出服务类
export default MusicApiService
