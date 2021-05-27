import {Failure, get, postWritable, SuccessWithData} from "./api"
import {APIEvent, WritableAPIEvent} from "../../types/api"
import {Event, PositionGroup} from "../../types/positions"
import {
  convertAPIPositionGroupToPositionGroup,
  convertPositionGroupToAPIPositionGroup,
  createPositionGrouponBackend
} from "./positionGroup"

export const convertAPIEventToEvent = (apiEvent: APIEvent): Event => {
  return {
    ...apiEvent,
    datetimeAdded: new Date(apiEvent.datetime_added),
    datetimeLastModified: new Date(apiEvent.datetime_last_modified),
    positionGroups: apiEvent.position_groups.map(convertAPIPositionGroupToPositionGroup),
    isSaved: true
  }
}

export const convertEventToAPIEvent = (event: Event): APIEvent => {
  return {
    ...event,
    datetime_added: event.datetimeAdded.toISOString(),
    datetime_last_modified: event.datetimeLastModified.toISOString(),
    position_groups: event.positionGroups.map(convertPositionGroupToAPIPositionGroup)
  }
}

// make sure apiEvent.position_groups is saved (isSaved: true) before calling this function.
// otherwise improper uuids which represent nothing in the server are set, resulting in no objects set in the field.
export const convertAPIEventToWritableAPIEvent = (apiEvent: APIEvent): WritableAPIEvent => {
  return {
    ...apiEvent,
    position_group_uuids: apiEvent.position_groups.map(group => group.uuid)
  }
}

export const getEvents = async (): Promise<SuccessWithData<Event[]>|Failure> => {
  const result = await get<APIEvent[]>("events/")
  if (result.ok) {
    return {
      ...result,
      data: result.data.map(convertAPIEventToEvent)
    }
  }
  return result
}

export const createEventOnBackend = async (event: Event): Promise<SuccessWithData<Event>|Failure> => {
  const newEvent = {...event}
  const positionGroups: PositionGroup[] = []
  for (const positionGroup of event.positionGroups) {
    if (!positionGroup.isSaved) {
      const positionGroupCreationResult = await createPositionGrouponBackend(positionGroup)
      if (positionGroupCreationResult.ok) {
        positionGroups.push(positionGroupCreationResult.data)
      } else {
        return {
          ok: false,
          description: "Failed to create a new PositionGroup while trying to create an Event."
        }
      }
    } else {
      positionGroups.push(positionGroup)
    }
  }
  newEvent.positionGroups = positionGroups
  const result = await postWritable<WritableAPIEvent, APIEvent>("events/", convertAPIEventToWritableAPIEvent(
    convertEventToAPIEvent(newEvent)
  ))
  if (result.ok) {
    return {
      ...result,
      data: convertAPIEventToEvent(result.data)
    }
  }
  return result
}