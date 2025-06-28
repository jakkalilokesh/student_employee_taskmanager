import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_XXXXXXXXX', // Replace with your User Pool ID
      userPoolClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your App Client ID
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
        endpoint: 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod',
        region: 'us-east-1',
      },
    },
  },
  Storage: {
    S3: {
      bucket: 'your-s3-bucket-name',
      region: 'us-east-1',
    },
  },
};

Amplify.configure(awsConfig);

export default awsConfig;