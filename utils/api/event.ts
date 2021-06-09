import {get, getWithParams, postWritable, putWritable} from "./api"
import {APIEvent, WritableAPIEvent} from "../../types/api"
import {Event, PositionGroup} from "../../types/positions"
import {
  convertAPIPositionGroupToPositionGroup,
  convertPositionGroupToAPIPositionGroup,
  createPositionGrouponBackend
} from "./positionGroup"
import {getSuccessWithData} from "../result"

export const convertAPIEventToEvent = (apiEvent: APIEvent): Event => {
  return {
    ...apiEvent,
    datetimeAdded: new Date(apiEvent.datetime_added),
    datetimeLastModified: new Date(apiEvent.datetime_last_modified),
    positionGroups: apiEvent.position_groups.map(convertAPIPositionGroupToPositionGroup),
    isEdited: false,
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

type GetEventsParams = {
  within_week?: string, // must be ISO formatted like YYYY-MM-DD
}

export const getEvents = async (params: GetEventsParams): Promise<Event[]> => {
  const result = await getWithParams<APIEvent[]>("events/", params)
  if (result.ok) {
    return result.data.map(event => convertAPIEventToEvent(event))
  } else {
    throw new Error("Failed to retrieve events data.")
  }
}

const createEventOnBackend = async (event: Event): Promise<SuccessWithData<APIEvent>|Failure> => {
  return await postWritable<WritableAPIEvent, APIEvent>("events/", convertAPIEventToWritableAPIEvent(
    convertEventToAPIEvent(event)
  ))
}

const updateEventOnBackend = async (event: Event): Promise<SuccessWithData<APIEvent>|Failure> => {
  return await putWritable<WritableAPIEvent, APIEvent>(`events/${event.uuid}`, convertAPIEventToWritableAPIEvent(
    convertEventToAPIEvent(event)
  ))
}

export const saveEventOnBackend = async (event: Event): Promise<SuccessWithData<Event>|Failure> => {
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
  let result: SuccessWithData<APIEvent> | Failure
  if (!newEvent.isSaved) result = await createEventOnBackend(newEvent)
  else {
    if (newEvent.isEdited) result = await updateEventOnBackend(newEvent)
    else result = getSuccessWithData(convertEventToAPIEvent(newEvent))
  }
  if (result.ok) {
    return {
      ...result,
      data: convertAPIEventToEvent(result.data)
    }
  }
  return result
}

export const getEventByUUID = async (uuid: string): Promise<Event> => {
  const result = await get<APIEvent>(`events/${uuid}/`)
  if (result.ok) {
    return convertAPIEventToEvent(result.data)
  } else {
    throw new Error("failed to retrieve the event.")
  }
}