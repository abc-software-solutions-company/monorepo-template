import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

import { IConfigs } from '@/common/interfaces/configs.interface';

import { FirebaseRepository } from './firebase.repository';
import { FirebaseService } from './firebase.service';

const FirebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService<IConfigs>) => {
    const firebaseConfig = configService.get<IConfigs['firebase']>('firebase');
    const logger = new Logger('FirebaseProvider');

    try {
      return await admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
        databaseURL: `https://${firebaseConfig.project_id}.firebaseio.com`,
      });
    } catch (error) {
      logger.error('Error initializing Firebase app:', error);
    }
  },
};

@Module({
  imports: [ConfigModule],
  providers: [FirebaseProvider, FirebaseRepository, FirebaseService],
  exports: [FirebaseRepository, FirebaseService],
})
export class FirebaseModule {}
