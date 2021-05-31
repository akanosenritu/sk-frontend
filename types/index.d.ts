declare type RawTime = {
  hour: number,
  minute: number,
}

declare type InvalidRawTime = RawTime & {isValid: false}
declare type ValidRawTime = RawTime & {isValid: true}

declare type TimeRange = {
  start: RawTime,
  end: RawTime,
}

declare type InvalidTimeRange = TimeRange & {isValid: false}
declare type ValidTimeRange = TimeRange & {isValid: true}

declare type MySubEvent = {
  uuid: string|null,
  title: string,
  start: Date,
  end: Date,
  num: number|null
}

declare type MyEvent = {
  uuid: string|null, // null means the event is not saved yet.
  title: string,
  assignedTo: string,
  addedAt: Date,
  isPublished: boolean,
  events: MySubEvent[]
}

declare type NotCreatedData = {
  isSaved: false,
  uuid: string
}
declare type CreatedData = {
  isSaved: true,
  uuid: string
}
declare type ObjectInfo = NotCreatedData | CreatedData
