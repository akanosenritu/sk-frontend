import {detectNumberOfPeopleDiscrepancies} from "./assign"

test("detectNumberOfPeopleDiscrepancies", () => {
  expect(detectNumberOfPeopleDiscrepancies({
      male: 3,
      female: 0,
      unspecified: 0
    }, {
      male: 0,
      female: 0,
    })).toStrictEqual({
      male: 3,
      female: 0,
      unspecified: 0
    })

  expect(detectNumberOfPeopleDiscrepancies({
    male: 3,
    female: 3,
    unspecified: 0
  }, {
    male: 3,
    female: 3,
  })).toStrictEqual({
    male: 0,
    female: 0,
    unspecified: 0
  })

  expect(detectNumberOfPeopleDiscrepancies({
    male: 0,
    female: 0,
    unspecified: 5
  }, {
    male: 2,
    female: 3,
  })).toStrictEqual({
    male: 0,
    female: 0,
    unspecified: 0
  })

  expect(detectNumberOfPeopleDiscrepancies({
    male: 3,
    female: 0,
    unspecified: 0
  }, {
    male: 4,
    female: 0,
  })).toStrictEqual({
    male: -1,
    female: 0,
    unspecified: 0
  })

  expect(detectNumberOfPeopleDiscrepancies({
    male: 3,
    female: 2,
    unspecified: 1
  }, {
    male: 4,
    female: 2
  })).toStrictEqual({
    male: 0,
    female: 0,
    unspecified: 0
  })

  expect(detectNumberOfPeopleDiscrepancies({
    male: 3,
    female: 3,
    unspecified: 0
  }, {
    male: 4,
    female: 2,
  })).toStrictEqual({
    male: -1,
    female: 1,
    unspecified: 0
  })

  expect(detectNumberOfPeopleDiscrepancies({
    male: 3,
    female: 3,
    unspecified: 3
  }, {
    male: 5,
    female: 2,
  })).toStrictEqual({
    male: 0,
    female: 1,
    unspecified: 1
  })
})
