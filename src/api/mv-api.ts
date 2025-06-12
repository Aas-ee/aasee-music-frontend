/**
 * MV API 服务
 * 专门处理 MV 相关的 API 调用，解决动态字段问题
 */

import MusicApiService from './music-api'
import type {
  MvDetailResponse,
  MvUrlsResponse,
  MvDetailData,
  MvUrlsData,
  MvRequestParams,
  MvQuality,
  MvFormat
} from '@/types/mv-types'
import {
  extractMvDetailData,
  extractMvUrlsData,
  getFirstMvDetailData,
  getFirstMvUrlsData,
  getMvUrl,
  getBestQualityMvUrl,
  getAvailableQualities
} from '@/types/mv-types'

/**
 * MV API 服务类
 */
export class MvApiService {
  /**
   * 获取 MV 详细信息
   * @param vids MV ID
   * @param cookie 用户 cookie
   * @returns MV 详细信息
   */
  static async getMvDetail(vids: string, cookie?: string): Promise<MvDetailData | null> {
    try {
      const response = await MusicApiService.getMvDetail({ vids, cookie }) as MvDetailResponse
      
      // 首先尝试用 vids 提取数据
      let mvData = extractMvDetailData(response, vids)
      
      // 如果没有找到，尝试获取第一个可用的数据
      if (!mvData) {
        const firstData = getFirstMvDetailData(response)
        mvData = firstData?.data || null
        
        if (firstData) {
          console.warn(`MV Detail: 请求的 vids "${vids}" 未找到，使用 "${firstData.vids}" 的数据`)
        }
      }
      
      return mvData
    } catch (error) {
      console.error('获取 MV 详情失败:', error)
      throw error
    }
  }

  /**
   * 获取 MV 播放 URL
   * @param vids MV ID
   * @param cookie 用户 cookie
   * @returns MV URL 信息
   */
  static async getMvUrls(vids: string, cookie?: string): Promise<MvUrlsData | null> {
    try {
      const response = await MusicApiService.getMvUrls({ vids, cookie }) as MvUrlsResponse
      
      // 首先尝试用 vids 提取数据
      let mvUrlsData = extractMvUrlsData(response, vids)
      
      // 如果没有找到，尝试获取第一个可用的数据
      if (!mvUrlsData) {
        const firstData = getFirstMvUrlsData(response)
        mvUrlsData = firstData?.data || null
        
        if (firstData) {
          console.warn(`MV URLs: 请求的 vids "${vids}" 未找到，使用 "${firstData.vids}" 的数据`)
        }
      }
      
      return mvUrlsData
    } catch (error) {
      console.error('获取 MV URL 失败:', error)
      throw error
    }
  }

  /**
   * 获取指定质量和格式的 MV 播放 URL
   * @param vids MV ID
   * @param format 格式 (mp4/hls)
   * @param quality 质量 (10/20/30/40)
   * @param cookie 用户 cookie
   * @returns 播放 URL
   */
  static async getMvPlayUrl(
    vids: string,
    format: MvFormat = 'mp4',
    quality: MvQuality = '30',
    cookie?: string
  ): Promise<string | null> {
    const mvUrlsData = await this.getMvUrls(vids, cookie)
    if (!mvUrlsData) return null
    
    return getMvUrl(mvUrlsData, format, quality)
  }

  /**
   * 获取最佳质量的 MV 播放 URL
   * @param vids MV ID
   * @param format 格式 (mp4/hls)
   * @param cookie 用户 cookie
   * @returns 最佳质量的播放 URL
   */
  static async getBestMvPlayUrl(
    vids: string,
    format: MvFormat = 'mp4',
    cookie?: string
  ): Promise<string | null> {
    const mvUrlsData = await this.getMvUrls(vids, cookie)
    if (!mvUrlsData) return null
    
    return getBestQualityMvUrl(mvUrlsData, format)
  }

  /**
   * 获取 MV 的所有可用质量选项
   * @param vids MV ID
   * @param format 格式 (mp4/hls)
   * @param cookie 用户 cookie
   * @returns 可用质量列表
   */
  static async getAvailableMvQualities(
    vids: string,
    format: MvFormat = 'mp4',
    cookie?: string
  ): Promise<MvQuality[]> {
    const mvUrlsData = await this.getMvUrls(vids, cookie)
    if (!mvUrlsData) return []
    
    return getAvailableQualities(mvUrlsData, format)
  }

  /**
   * 获取 MV 完整信息（详情 + URL）
   * @param vids MV ID
   * @param cookie 用户 cookie
   * @returns MV 完整信息
   */
  static async getMvFullInfo(vids: string, cookie?: string) {
    try {
      const [detail, urls] = await Promise.all([
        this.getMvDetail(vids, cookie),
        this.getMvUrls(vids, cookie)
      ])

      if (!detail) {
        throw new Error('无法获取 MV 详情')
      }

      return {
        detail,
        urls,
        // 便捷方法
        getBestUrl: (format: MvFormat = 'mp4') => 
          urls ? getBestQualityMvUrl(urls, format) : null,
        getUrl: (format: MvFormat = 'mp4', quality: MvQuality = '30') => 
          urls ? getMvUrl(urls, format, quality) : null,
        getAvailableQualities: (format: MvFormat = 'mp4') => 
          urls ? getAvailableQualities(urls, format) : []
      }
    } catch (error) {
      console.error('获取 MV 完整信息失败:', error)
      throw error
    }
  }

  /**
   * 批量获取 MV 详情
   * @param vidsList MV ID 列表
   * @param cookie 用户 cookie
   * @returns MV 详情列表
   */
  static async getBatchMvDetails(vidsList: string[], cookie?: string): Promise<Array<{vids: string, data: MvDetailData | null}>> {
    const promises = vidsList.map(async (vids) => {
      try {
        const data = await this.getMvDetail(vids, cookie)
        return { vids, data }
      } catch (error) {
        console.error(`获取 MV ${vids} 详情失败:`, error)
        return { vids, data: null }
      }
    })

    return Promise.all(promises)
  }

  /**
   * 验证 MV ID 是否有效
   * @param vids MV ID
   * @param cookie 用户 cookie
   * @returns 是否有效
   */
  static async validateMvId(vids: string, cookie?: string): Promise<boolean> {
    try {
      const detail = await this.getMvDetail(vids, cookie)
      return detail !== null
    } catch (error) {
      return false
    }
  }
}

export default MvApiService
