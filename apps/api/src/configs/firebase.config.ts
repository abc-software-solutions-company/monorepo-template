/* eslint-disable no-console */
import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

const parseFirebaseConfig = (): IConfigs['firebase'] => {
  try {
    // Parse the JSON string from the environment variable
    const firebaseConfig = JSON.parse(process.env.AP_FIREBASE_CONFIG || '{}');

    // Ensure all required fields are present
    const requiredFields = [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
      'auth_uri',
      'token_uri',
      'auth_provider_x509_cert_url',
      'client_x509_cert_url',
      'universe_domain',
    ];

    for (const field of requiredFields) {
      if (!firebaseConfig[field]) {
        console.error(`Missing required field: ${field}`);
      }
    }

    return firebaseConfig as IConfigs['firebase'];
  } catch (error) {
    console.error('Error parsing Firebase config:', error);
  }
};

export default registerAs('firebase', parseFirebaseConfig);
