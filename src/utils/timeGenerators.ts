import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

// yyyy-MM-dd 形式で返す
export const getTodaysDate = () => {
  return format(utcToZonedTime(new Date(), 'Asia/Tokyo'), 'yyyy-MM-dd')
}

// yyyy-MM-dd HH:mm:ss形式の日時を返す
export const getNowDatetime = () => {
  return format(utcToZonedTime(new Date(), 'Asia/Tokyo'), 'yyyy-MM-dd HH:mm:ss')
}
