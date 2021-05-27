import {PositionData, PositionDataNullable} from "../../types/positions"
import {getDataOrDefaultDataFromPositionData} from "../positions"

export const getPositionStaffNumbers = (positionData: PositionDataNullable, defaultPositionData: PositionData): {[gender in Gender]: number} => {
  return {
    male: getDataOrDefaultDataFromPositionData("male", positionData, defaultPositionData),
    female: getDataOrDefaultDataFromPositionData("female", positionData, defaultPositionData),
    unspecified: getDataOrDefaultDataFromPositionData("unspecified", positionData, defaultPositionData)
  }
}