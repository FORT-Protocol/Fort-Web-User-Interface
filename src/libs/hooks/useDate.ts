export const useDate = () => {
  const today_date = new Date(new Date().setHours(0, 0, 0, 0))
  const yesterday_date = new Date(new Date().setHours(0, 0, 0, 0) - 60 * 60 * 24 * 1000)
  const aWeekAgo_date = new Date(new Date().setHours(0, 0, 0, 0) - 60 * 60 * 24 * 1000 * 7)
  const aMonthAgo_date = new Date(new Date().setHours(0, 0, 0, 0) - 60 * 60 * 24 * 1000 * 30)
  const threeDayAgo_date = new Date(new Date().setHours(0, 0, 0, 0) - 60 * 60 * 24 * 1000 * 3)
  
  const format = (date: Date) => {
    return (
      date.getFullYear() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0')
    )
  }

  const format_read = (date: Date) => {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    )
  }

  const today = format(today_date)

  const yesterday = format(yesterday_date)

  const aWeekAgo = format(aWeekAgo_date)

  const aMonthAgo = format(aMonthAgo_date)

  const threeDayAgo = format(threeDayAgo_date)
  
  const today_read = format_read(today_date)

  const yesterday_read = format_read(yesterday_date)
  
  const threeDay_read = format_read(threeDayAgo_date)

  return {
    today,
    yesterday,
    threeDayAgo,
    threeDay_read,
    today_read,
    yesterday_read,
    aWeekAgo,
    aMonthAgo,
  }
}
