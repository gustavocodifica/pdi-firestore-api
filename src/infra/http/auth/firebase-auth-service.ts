import { Auth } from 'firebase-admin/auth'
import { AuthService } from './auth-service'

export class FirebaseAuthService implements AuthService {
  constructor(private auth: Auth) {}

  async verifyToken(token: string) {
    await this.auth.verifyIdToken(token)
  }
}
