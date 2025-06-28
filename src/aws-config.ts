import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_bKl8shmd3', // Replace with your User Pool ID
      userPoolClientId: '7jpi11ra353h1nadammqhm2jtd', // Replace with your App Client ID
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
