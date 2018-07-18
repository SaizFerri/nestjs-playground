export interface JwtPayload {
  id: Number,
  email: string,
  verified: Boolean,
  roles: string[]
}