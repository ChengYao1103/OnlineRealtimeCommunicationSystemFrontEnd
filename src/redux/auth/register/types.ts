export enum AuthRegisterActionTypes {
  API_RESPONSE_SUCCESS = "@@auth/register/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@auth/register/API_RESPONSE_ERROR",

  REGISTER_USER = "@@auth/register/REGISTER_USER",
}

export interface AuthRegisterState {
  registrationError: string | null;
  loading: boolean;
  user: object | null;
}
