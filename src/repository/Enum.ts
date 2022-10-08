export enum RoleTypes {
  Teacher = 0,
  TA = 1,
  Student = 2,
}

export enum ErrorMessages {
  "record not found" = "您所輸入的使用者不存在",
  "required" = "不可空白",
  "email format wrong" = "請輸入正確email格式",
  "email exists" = "此email已被使用",
}

export type ErrorMessagesKey = keyof typeof ErrorMessages;
