export interface AuthService {
  verifyToken(token: string): Promise<void>
}
