import {Event, PositionGroup} from "../types/positions"
import {v4} from "uuid"

export const createDefaultEvent = (): Event => ({
  title: "title",
  datetimeAdded: new Date(),
  datetimeLastModified: new Date(),
  uuid: v4(),
  isSaved: false,
  positionGroups: [] as PositionGroup[]
})