export interface UserMetaData {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
  name?: string;
  [key: string]: unknown;
}
