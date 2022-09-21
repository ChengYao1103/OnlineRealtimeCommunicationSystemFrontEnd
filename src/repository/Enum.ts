export enum RoleTypes {
  Teacher = 0,
  TA = 1,
  Student = 2,
}

export enum ErrorMessages {
  "record not found" = "The user with input doesn't exist",
}

export type ErrorMessagesKey = keyof typeof ErrorMessages;
