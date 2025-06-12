/**
 * MV 相关的动态类型定义
 * 解决 OpenAPI 生成的类型中字段名写死的问题
 */

// 导入生成的基础类型
import type { 
  GetMvGetDetail200DataW0011j2cefa,
  GetMvGetMvUrls200DataW0011j2cefa 
} from './generated'

/**
 * MV 详情响应 - 动态字段版本
 * 字段名对应请求参数中的 vids 值
 */
export interface MvDetailResponse {
  code: number
  message: string
  data: Record<string, GetMvGetDetail200DataW0011j2cefa>
  timestamp: number
}

/**
 * MV URL 响应 - 动态字段版本
 * 字段名对应请求参数中的 vids 值
 */
export interface MvUrlsResponse {
  code: number
  message: string
  data: Record<string, GetMvGetMvUrls200DataW0011j2cefa>
  timestamp: number
}

/**
 * MV 详情数据类型 (重新导出以便使用)
 */
export type MvDetailData = GetMvGetDetail200DataW0011j2cefa

/**
 * MV URL 数据类型 (重新导出以便使用)
 */
export type MvUrlsData = GetMvGetMvUrls200DataW0011j2cefa

/**
 * MV 请求参数
 */
export interface MvRequestParams {
  vids: string
  cookie?: string
}

/**
 * 辅助函数：从动态响应中提取 MV 数据
 */
export function extractMvDetailData(response: MvDetailResponse, vids: string): MvDetailData | null {
  return response.data[vids] || null
}

/**
 * 辅助函数：从动态响应中提取 MV URL 数据
 */
export function extractMvUrlsData(response: MvUrlsResponse, vids: string): MvUrlsData | null {
  return response.data[vids] || null
}

/**
 * 辅助函数：获取响应中的第一个 MV 数据（当不确定 vids 值时）
 */
export function getFirstMvDetailData(response: MvDetailResponse): { vids: string; data: MvDetailData } | null {
  const keys = Object.keys(response.data)
  if (keys.length === 0) return null
  
  const firstKey = keys[0]
  return {
    vids: firstKey,
    data: response.data[firstKey]
  }
}

/**
 * 辅助函数：获取响应中的第一个 MV URL 数据（当不确定 vids 值时）
 */
export function getFirstMvUrlsData(response: MvUrlsResponse): { vids: string; data: MvUrlsData } | null {
  const keys = Object.keys(response.data)
  if (keys.length === 0) return null
  
  const firstKey = keys[0]
  return {
    vids: firstKey,
    data: response.data[firstKey]
  }
}

/**
 * MV 质量选项
 */
export type MvQuality = '10' | '20' | '30' | '40'

/**
 * MV 格式类型
 */
export type MvFormat = 'mp4' | 'hls'

/**
 * 辅助函数：从 MV URL 数据中获取指定质量和格式的 URL
 */
export function getMvUrl(
  mvUrlsData: MvUrlsData, 
  format: MvFormat = 'mp4', 
  quality: MvQuality = '30'
): string | null {
  return mvUrlsData[format]?.[quality] || null
}

/**
 * 辅助函数：获取 MV 的所有可用质量选项
 */
export function getAvailableQualities(mvUrlsData: MvUrlsData, format: MvFormat = 'mp4'): MvQuality[] {
  const formatData = mvUrlsData[format]
  if (!formatData) return []
  
  return Object.keys(formatData).filter(key => formatData[key]) as MvQuality[]
}

/**
 * 辅助函数：获取最佳质量的 MV URL
 */
export function getBestQualityMvUrl(mvUrlsData: MvUrlsData, format: MvFormat = 'mp4'): string | null {
  const qualities: MvQuality[] = ['40', '30', '20', '10'] // 从高到低
  
  for (const quality of qualities) {
    const url = getMvUrl(mvUrlsData, format, quality)
    if (url) return url
  }
  
  return null
}
