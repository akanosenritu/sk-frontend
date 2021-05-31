export const sampleGenders = [
  {
    "uuid": "ca63ec7c-1ffd-4d9e-9ac5-adc34b5ca877",
    "text": "男"
  },
  {
    "uuid": "707dd85b-3018-46fb-a94a-1c4ae6c15eb0",
    "text": "女"
  },
  {
    "uuid": "0fe86d0d-c1f9-41a4-82cc-00f1d1e1f2d9",
    "text": "未指定"
  }
]


export const getGenderColor = (gender: Gender) => {
  switch (gender) {
    case "male":
      return "#92a8d1"
    case "female":
      return "#f7786b"
    case "unspecified":
      return "#b5e7a0"
    default:
      return "white"
  }
}
