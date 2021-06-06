import {Position} from "../../types/position"
import {APIPosition, WritableAPIPosition} from "../../types/api"
import {
  convertAPIPositionDataToPositionDataNullable,
  convertPositionDataNullableToAPIPositionData,
  createPositionDataNullableOnBackend,
} from "./positionData"
import {Failure, patchWritable, postWritable, putWritable, SuccessWithData} from "./api"
import {format} from "date-fns"
import {convertAPIRegisteredStaffToRegisteredStaff, convertRegisteredStaffToAPIRegisteredStaff} from "./staff"

export const convertAPIPositionToPosition = (apiPosition: APIPosition): Position => {
  return {
    ...apiPosition,
    data: convertAPIPositionDataToPositionDataNullable(apiPosition.data),
    date: new Date(apiPosition.date),
    isEdited: false,
    isSaved: true,
    assignedStaffs: apiPosition.assigned_staffs.map(staff => convertAPIRegisteredStaffToRegisteredStaff(staff))
  }
}

export const convertPositionToAPIPosition = (position: Position): APIPosition => {
  return {
    ...position,
    date: format(position.date, "yyyy-MM-dd"),
    data: convertPositionDataNullableToAPIPositionData(position.data),
    assigned_staffs: position.assignedStaffs.map(staff => convertRegisteredStaffToAPIRegisteredStaff(staff))
  }
}

// make sure apiPosition.data is saved (isSaved: true) before calling this function.
// otherwise improper uuid which represents nothing in the server will be set, resulting in no object set in the field.
export const convertAPIPositionToWritableAPIPosition = (apiPosition: APIPosition): WritableAPIPosition => {
  return {
    ...apiPosition,
    data_uuid: apiPosition.data.uuid,
    assigned_staff_uuids: apiPosition.assigned_staffs.map(staff => staff.uuid)
  }
}

export const createPositionOnBackend = async (position: Position): Promise<SuccessWithData<Position>|Failure> => {
  const newPosition: Position = {...position}
  if (!position.data.isSaved) {
    const positionDataCreationResult = await createPositionDataNullableOnBackend(position.data)
    if (positionDataCreationResult.ok) {
      newPosition.data = positionDataCreationResult.data
    } else {
      return {
        ok: false,
        description: "Failed to create a new PositionData while trying to create a Position."
      }
    }
  }
  const writable = convertAPIPositionToWritableAPIPosition(convertPositionToAPIPosition(newPosition))
  const result = await postWritable<WritableAPIPosition, APIPosition>("positions/", writable)
  if (result.ok) {
    return {
      ...result,
      data: convertAPIPositionToPosition(result.data)
    }
  }
  return result
}

export const updatePositionOnBackend = async (position: Position): Promise<SuccessWithData<Position>|Failure> => {
  const updatedPosition: Position = {...position}
  if (!updatedPosition.data.isSaved) {
    return {
      ok: false,
      description: "Cannot update a Position without firstly creating it."
    }
  }
  if (!updatedPosition.uuid) {
    return {
      ok: false,
      description: "Cannot update a Position without uuid."
    }
  }
  console.log(updatedPosition)
  const writable = convertAPIPositionToWritableAPIPosition(convertPositionToAPIPosition(updatedPosition))
  const result = await putWritable<WritableAPIPosition, APIPosition>(`positions/${updatedPosition.uuid}/`, writable)
  if (result.ok) {
    return {
      ...result,
      data: convertAPIPositionToPosition(result.data)
    }
  }
  return result
}

export const updatePositionStaffAssignments = (positionUUID: string, assignedStaffUUIDs: string[]): Promise<Success|Failure> => {
  const patchingData: Partial<WritableAPIPosition> = {assigned_staff_uuids: assignedStaffUUIDs}
  return patchWritable(`positions/${positionUUID}/`, patchingData)
}