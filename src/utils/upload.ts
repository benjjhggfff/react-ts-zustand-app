import { supabase } from '../service/supabase'
import imageCompression from 'browser-image-compression'
import { sha256 } from 'js-sha256'

const BUCKET_NAME = 'school'
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

// 压缩 + 转 WebP
async function compressAndConvertToWebP(file: File): Promise<File> {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebp: true,
      fileType: 'image/webp',
    }
    return await imageCompression(file, options)
  } catch (err) {
    console.error('压缩失败', err)
    return file
  }
}

// 生成文件唯一哈希名（相同文件永远同名）
function getFileHashKey(file: File, suffix = 'webp'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 6)
  const hash = sha256(file.name + file.size + file.lastModified + timestamp + random)
  return `${hash}.${suffix}`
}

// 验证文件
function validateFile(file: File): string | null {
  if (!file) return '未选择文件'
  if (!ALLOWED_TYPES.includes(file.type)) return '不支持的格式'
  if (file.size > MAX_FILE_SIZE) return '文件不能超过 2MB'
  return null
}

// 【通用上传】任何图片都能用
export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    const invalid = validateFile(file)
    if (invalid) return { success: false, error: invalid }

    const processedFile = await compressAndConvertToWebP(file)
    const fileKey = getFileHashKey(processedFile, 'webp')

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileKey, processedFile, { upsert: true, cacheControl: '31536000' })

    if (error) throw error

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileKey)

    return {
      success: true,
      url: data.publicUrl,
      key: fileKey,
    }
  } catch (error: any) {
    console.error('上传失败', error)
    return {
      success: false,
      error: error.message || '上传失败',
    }
  }
}

// 快捷方法：给头像上传用
export async function uploadAvatar(file: File): Promise<UploadResult> {
  return uploadImage(file)
}

// 给表单上传用
export async function chooseAndUploadWebImage(file: File): Promise<UploadResult> {
  return uploadImage(file)
}

// 获取图片地址
export function getImageUrl(key: string | null | undefined): string {
  if (!key) return ''
  if (key.startsWith('http')) return key
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(key)
  return data.publicUrl
}
