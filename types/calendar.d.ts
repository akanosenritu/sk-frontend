type CalendarEvent<T> = {
  title: string,
  start: Date,
  end: Date,
  allDay: boolean,
  backgroundColor: string,
  data: T,
}