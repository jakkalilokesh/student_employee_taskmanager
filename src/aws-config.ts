import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: true,
      },
    },
  },
  API: {
    REST: {
      TaskManagerAPI: {
        endpoint: import.meta.env.VITE_API_GATEWAY_URL,
        region: import.meta.env.VITE_AWS_REGION,
      },
    },
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_S3_BUCKET_NAME,
      region: import.meta.env.VITE_AWS_REGION,
    },
  },
});
