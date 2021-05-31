import {PositionDataNullable} from "./positions"
import {RegisteredStaff} from "./staffs"

declare type Position = {
  date: Date,
  data: PositionDataNullable,
  assignedStaffs: RegisteredStaff[]
} & ObjectInfo