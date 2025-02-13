import admin from 'firebase-admin'

import { env } from '../../env'

import { Firestore } from 'firebase-admin/firestore'
import { Auth } from 'firebase-admin/auth'

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: env.CLIENT_EMAIL,
    privateKey: env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    projectId: env.PROJECT_ID,
  }),
})

export const db: Firestore = admin.firestore()

export const auth: Auth = admin.auth()
