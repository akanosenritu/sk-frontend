export const detectNumberOfPeopleDiscrepancies = (
  required: {
    male: number,
    female: number,
    unspecified: number
  },
  current: {
    male: number,
    female: number
  }
) => {
  // positive number means there is a vacancy for the slot
  // negative number means the slot is overflowing.
  const result: {[gender in Gender]: number} = {
    male: 0,
    female: 0,
    unspecified: 0,
  }

  // calculate male
  // whether male slots are filled
  if (required.male > current.male) result.male = required.male - current.male
  let maleOverFlow = Math.max(0, current.male - required.male)

  // calculate female
  // whether female slots are filled
  if (required.female > current.female) result.female = required.female - current.female
  let femaleOverFlow = Math.max(0, current.female - required.female)

  // calculate unspecified
  // whether unspecified slots are filled
  if (required.unspecified >= maleOverFlow + femaleOverFlow) {
    result.unspecified = required.unspecified - (maleOverFlow + femaleOverFlow)
    return result
  }

  let remainingUnspecified = required.unspecified
  while (remainingUnspecified > 0) {
    if (maleOverFlow > 0) {
      maleOverFlow -= 1
      remainingUnspecified -= 1
    } else {
      break
    }
  }
  while (remainingUnspecified > 0) {
    if (femaleOverFlow > 0) {
      femaleOverFlow -= 1
      remainingUnspecified -= 1
    } else {
      break
    }
  }
  if (maleOverFlow) result.male = -1 * maleOverFlow
  if (femaleOverFlow) result.female = -1 * femaleOverFlow
  result.unspecified =
    (required.male + required.female + required.unspecified) -
    (current.male + current.female) -
    (result.male + result.female)
  return result
}