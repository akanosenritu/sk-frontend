import {APIPositionGroup, WritableAPIPositionGroup} from "../../types/api"
import {Position, PositionGroup} from "../../types/positions"
import {
  convertAPIPositionDataNotNullableToPositionData,
  convertPositionDataToAPIPositionData,
  createPositionDataOnBackend
} from "./positionData"
import {convertAPIPositionToPosition, convertPositionToAPIPosition, createPositionOnBackend} from "./position"
import {Failure, postWritable, SuccessWithData} from "./api"

export const convertAPIPositionGroupToPositionGroup = (apiPositionGroup: APIPositionGroup): PositionGroup => {
  return {
    ...apiPositionGroup,
    defaultPositionData: convertAPIPositionDataNotNullableToPositionData(apiPositionGroup.default_position_data),
    positions: apiPositionGroup.positions.map(convertAPIPositionToPosition),
    positionColor: apiPositionGroup.position_color,
    isSaved: true
  }
}

export const convertPositionGroupToAPIPositionGroup = (positionGroup: PositionGroup): APIPositionGroup => {
  return {
    ...positionGroup,
    default_position_data: convertPositionDataToAPIPositionData(positionGroup.defaultPositionData),
    positions: positionGroup.positions.map(convertPositionToAPIPosition),
    position_color: positionGroup.positionColor
  }
}

// make sure apiPositionGroup.default_position_data and apiPositionGroup.position are saved (isSaved: true) before calling this function.
// otherwise improper uuids which represent nothing in the server are set, resulting in no objects set in the fields.
export const convertAPIPositionGroupToWritableAPIPositionGroup = (apiPositionGroup: APIPositionGroup): WritableAPIPositionGroup => {
  return {
    ...apiPositionGroup,
    default_position_data_uuid: apiPositionGroup.default_position_data.uuid,
    position_uuids: apiPositionGroup.positions.map(pos => pos.uuid)
  }
}

export const createPositionGrouponBackend = async (positionGroup: PositionGroup): Promise<SuccessWithData<PositionGroup>|Failure> => {
  const newPositionGroup = {...positionGroup}
  if (!positionGroup.defaultPositionData.isSaved) {
    const defaultPositionDataCreationResult = await createPositionDataOnBackend(positionGroup.defaultPositionData)
    if (defaultPositionDataCreationResult.ok) {
      newPositionGroup.defaultPositionData = defaultPositionDataCreationResult.data
    } else {
      return {
        ok: false,
        description: "Failed to create a new PositionData while trying to create a PositionGroup."
      }
    }
  }
  const newPositions: Position[] = []
  for (const position of newPositionGroup.positions) {
    if (!position.isSaved) {
      const positionCreationResult = await createPositionOnBackend(position)
      if (positionCreationResult.ok) {
        newPositions.push(positionCreationResult.data)
      } else {
        return {
          ok: false,
          description: "Failed to create a new Position while trying to create a PositionGroup."
        }
      }
    } else {
      newPositions.push(position)
    }
  }
  newPositionGroup.positions = newPositions
  const writableData = convertAPIPositionGroupToWritableAPIPositionGroup(
    convertPositionGroupToAPIPositionGroup(newPositionGroup)
  )
  const result = await postWritable<WritableAPIPositionGroup, APIPositionGroup>("position-groups/", writableData)
  if (result.ok) {
    return {
      ...result,
      data: convertAPIPositionGroupToPositionGroup(result.data)
    }
  }
  return result
}