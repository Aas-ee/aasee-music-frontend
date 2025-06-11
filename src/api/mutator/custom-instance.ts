import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import Axios from 'axios'

// 创建 axios 实例
export const AXIOS_INSTANCE = Axios.create({
  baseURL: '', // 将在运行时设置
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    // 在这里可以添加认证 token、cookie 等
    console.log('🎵 Music API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('🚫 Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    console.log('✅ Music API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('🚫 Response Error:', error.response?.status, error.config?.url)

    // 处理常见的音乐 API 错误
    if (error.response?.status === 401) {
      console.warn('🔐 Authentication required for music API')
    } else if (error.response?.status === 429) {
      console.warn('⏰ Rate limit exceeded for music API')
    }

    return Promise.reject(error)
  }
)

// 自定义实例函数，用于 orval 生成的代码
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source()
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }: AxiosResponse<T>) => data)

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}

// 设置基础 URL 的辅助函数
export const setMusicApiBaseUrl = (baseUrl: string) => {
  AXIOS_INSTANCE.defaults.baseURL = baseUrl
}

// 设置认证信息的辅助函数
export const setMusicApiAuth = (cookie?: string, token?: string) => {
  if (cookie) {
    AXIOS_INSTANCE.defaults.headers.common['Cookie'] = cookie
  }
  if (token) {
    AXIOS_INSTANCE.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

export default customInstance
