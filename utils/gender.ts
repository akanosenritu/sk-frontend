export const getNextGender = (currentGender: Gender) => {
  switch (currentGender) {
    case "male":
      return "female"
    case "female":
      return "unspecified"
    case "unspecified":
      return "male"
  }
}

export const getJapaneseTranslationForGender = (gender: Gender) => {
  switch (gender) {
    case "male":
      return "男"
    case "female":
      return "女"
    case "unspecified":
      return "男/女"
  }
}

export const getGenderColor = (gender: Gender) => {
  switch (gender) {
    case "male":
      return "#92a8d1"
    case "female":
      return "#f7786b"
    case "unspecified":
      return "#b5e7a0"
  }
}