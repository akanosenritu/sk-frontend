import {compareAsc, differenceInCalendarDays, endOfDay, format} from "date-fns"
import {ja} from "date-fns/locale"

const rawTimeStringRegexPattern1 = /^([0-9]?[0-9]):?([0-9]{2})$/

export const checkRawTime = (rawTime: RawTime): InvalidRawTime | ValidRawTime => {
  const returned = {hour: rawTime.hour, minute: rawTime.minute, isValid: false}
  // check if both the hour and the minute are integers.
  if (!Number.isInteger(rawTime.hour) || !Number.isInteger(rawTime.minute)) return returned
  // check if the hour is equal or more than 0.
  if (rawTime.hour < 0) return returned
  // check if the minute is between 0 and 59.
  if (rawTime.minute < 0 || rawTime.minute >= 60) return returned

  return {...returned, isValid: true}
}

export const rawTimeToString = (rawTime: RawTime): string => {
  const hour = ("00" + rawTime.hour).slice(-2)
  const minute = ("00" + rawTime.minute).slice(-2)
  return `${hour}:${minute}`
}

export const isValidRawTimeString = (str: string): boolean => {
  const match1 = str.match(rawTimeStringRegexPattern1)
  if (match1) {
    const hour = parseInt(match1[1], 10)
    const minute = parseInt(match1[2], 10)
    return checkRawTime({hour, minute}).isValid
  }
  return false
}

export const stringToRawTime = (str: string): RawTime | null => {
  if (isValidRawTimeString(str)) {
    const match = str.match(rawTimeStringRegexPattern1)
    if (match) {
      const hour = parseInt(match[1], 10)
      const minute = parseInt(match[2], 10)
      return {hour, minute}
    }
  }
  return null
}

// if a < b return -1
// if a == b return 0
// if a > b return 1
export const compareRawTimes = (a: ValidRawTime, b: ValidRawTime): number => {
  if (a.hour < b.hour) return -1
  else if (a.hour === b.hour) {
    if (a.minute < b.minute) return -1
    else if (a.minute === b.minute) return 0
    return 1
  } else return 1
}

export const checkTimeRange = (timeRange: TimeRange): InvalidTimeRange | ValidTimeRange => {
  const returned = {start: timeRange.start, end: timeRange.end, isValid: false}
  // check if both the start and the end are valid raw time.
  const checkedStart = checkRawTime(timeRange.start)
  if (!checkedStart.isValid) return returned
  const checkedEnd = checkRawTime(timeRange.end)
  if (!checkedEnd.isValid) return returned

  const startAndEndChecked = {start: checkedStart, end: checkedEnd, isValid: false}

  // check if the start is before the end.
  const comparison = compareRawTimes(startAndEndChecked.start, startAndEndChecked.end)
  if (comparison !== -1) return startAndEndChecked
  return {...startAndEndChecked, isValid: true}
}

export const getJSTDate = (date: Date): Date => {
  const returnedDate = new Date(date.getTime())
  returnedDate.setTime(returnedDate.getTime() + 1000 * 60 * 60 * 9)
  return returnedDate
}

export const getDifferenceInCalendarDays = (date1: Date, date2: Date) => {
  return differenceInCalendarDays(getJSTDate(date1), getJSTDate(date2))
}

export const getIntervals = (dates: Date[]): {start: Date, end: Date}[] => {
  dates.sort(compareAsc)

  if (dates.length === 0) return []
  else if (dates.length === 1) return [{start: dates[0], end: dates[0]}]
  const intervals: {start: Date, end: Date}[] = []
  let currentStart: Date = dates[0]
  let dateBefore: Date = dates[0]
  let currentEnd: Date | null = null
  for (const date of dates.slice(1)) {
    if (differenceInCalendarDays(getJSTDate(dateBefore), getJSTDate(date)) >= -1) {
      currentEnd = date
      dateBefore = date
    } else {
      if (currentEnd) {
        intervals.push({start: currentStart, end: currentEnd})
      } else {
        intervals.push({start: currentStart, end: currentStart})
      }
      currentStart = date
      currentEnd = null
      dateBefore = date
    }
  }
  if (currentEnd) {
    intervals.push({start: currentStart, end: currentEnd})
  } else {
    intervals.push({start: currentStart, end: currentStart})
  }
  return intervals.map(interval => ({...interval, end: endOfDay(interval.end)}))
}

export const formatDateToYYYYMMDD = (date: Date): string => {
  return format(date, "yyyy-MM-dd")
}

export const formatDateToMDEEE = (date: Date): string => {
  return format(date, "M/d (eee)", {locale: ja})
}

export const getIntervalString = (interval: {start: Date, end: Date}): string => {
  const startString = formatDateToMDEEE(interval.start)
  const endString = formatDateToMDEEE(interval.end)
  if (startString === endString) return startString
  return `${startString}-${endString}`
}