import {Position} from "../../types/positions"
import {APIPosition, WritableAPIPosition} from "../../types/api"
import {
  convertAPIPositionDataToPositionDataNullable,
  convertPositionDataNullableToAPIPositionData,
  createPositionDataNullableOnBackend,
} from "./positionData"
import {Failure, postWritable, SuccessWithData} from "./api"
import {format} from "date-fns"

export const convertAPIPositionToPosition = (apiPosition: APIPosition): Position => {
  return {
    ...apiPosition,
    data: convertAPIPositionDataToPositionDataNullable(apiPosition.data),
    date: new Date(apiPosition.date),
    isSaved: true
  }
}

export const convertPositionToAPIPosition = (position: Position): APIPosition => {
  return {
    ...position,
    date: format(position.date, "yyyy-MM-dd"),
    data: convertPositionDataNullableToAPIPositionData(position.data)
  }
}

// make sure apiPosition.data is saved (isSaved: true) before calling this function.
// otherwise improper uuid which represents nothing in the server will be set, resulting in no object set in the field.
export const convertAPIPositionToWritableAPIPosition = (apiPosition: APIPosition): WritableAPIPosition => {
  return {
    ...apiPosition,
    data_uuid: apiPosition.data.uuid
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