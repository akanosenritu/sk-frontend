import {getIntervals, isValidRawTimeString} from "./time"
import {differenceInCalendarDays, format} from "date-fns"

test("test getIntervals", () => {
  const toString = (date: {start: Date, end: Date}): [string, string] => {
    return [
      format(date.start, "yyyy/MM/dd"),
      format(date.end, "yyyy/MM/dd")
    ]
  }
  const dates = [
    new Date(2000, 1, 2),
    new Date(2000, 1, 3),
    new Date(2000, 1, 3),
    new Date(2000, 1, 5),
    new Date(2000, 1, 6),
    new Date(2000, 1, 7)
  ]

  expect(differenceInCalendarDays(dates[2], dates[3])).toBe(-2)
  expect(getIntervals(dates.slice(0, 2)).map(toString)).toStrictEqual([
   ["2000/02/02", "2000/02/03"]
  ])

  expect(getIntervals(dates.slice(0, 3)).map(toString)).toStrictEqual([
    ["2000/02/02", "2000/02/03"]
  ])

  expect(getIntervals(dates.slice(0, 4)).map(toString)).toStrictEqual([
    ["2000/02/02", "2000/02/03"],
    ["2000/02/05", "2000/02/05"]
  ])

  expect(getIntervals(dates.slice(0, 5)).map(toString)).toStrictEqual([
    ["2000/02/02", "2000/02/03"],
    ["2000/02/05", "2000/02/06"]
  ])

  expect(getIntervals(dates.slice(0, 6)).map(toString)).toStrictEqual([
    ["2000/02/02", "2000/02/03"],
    ["2000/02/05", "2000/02/07"]
  ])
})

test("test isValidRawTimeString", () => {
  expect(isValidRawTimeString("000")).toBe(true)
  expect(isValidRawTimeString("0:00")).toBe(true)
  expect(isValidRawTimeString("1200")).toBe(true)
  expect(isValidRawTimeString("12:00")).toBe(true)
  expect(isValidRawTimeString("12:0")).toBe(false)
  expect(isValidRawTimeString("25:00")).toBe(true)
  expect(isValidRawTimeString("12:66")).toBe(false)
  expect(isValidRawTimeString("2500")).toBe(true)
})