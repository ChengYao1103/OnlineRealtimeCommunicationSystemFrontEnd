export enum RoleTypes {
  "老師" = 0,
  "助教" = 1,
  "學生" = 2,
}

export type RoleTypesKey = keyof typeof RoleTypes;

export enum ErrorMessages {
  "record not found" = "您所輸入的使用者不存在",
  "required" = "不可空白",
  "email format wrong" = "請輸入正確email格式",
  "email exists" = "此email已被使用",
}

export type ErrorMessagesKey = keyof typeof ErrorMessages;
