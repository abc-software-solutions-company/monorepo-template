import { Inject, Injectable, Logger } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
  db: FirebaseFirestore.Firestore;
  private logger: Logger;

  constructor(@Inject('FIREBASE_APP') private readonly firebaseApp: app.App) {
    this.logger = new Logger('FirebaseRepository');
    try {
      this.db = firebaseApp.firestore();
    } catch (error) {
      this.logger.error('Error initializing Firestore:', error);

      return null;
    }
  }
}
