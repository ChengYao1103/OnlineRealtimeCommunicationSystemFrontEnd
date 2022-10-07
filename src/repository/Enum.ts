export enum RoleTypes {
  Teacher = 0,
  TA = 1,
  Student = 2,
}

export enum ErrorMessages {
  "record not found" = "您所輸入的使用者不存在",
  "required" = "不可空白",
}

export type ErrorMessagesKey = keyof typeof ErrorMessages;
