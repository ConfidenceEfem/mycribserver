
import { EnvironmentalVariables } from "./environmentalVariables"
const SibApiV3Sdk : any = require('sib-api-v3-sdk')






// sending mail using brevo
export const sendOTP = async (toEmail: string, otpCode: string) => {

    console.log(EnvironmentalVariables.API_KEY)

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = EnvironmentalVariables.API_KEY

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = {
    email: 'confidenceefem1@gmail.com',
    name: 'myCrib Team',
  };

  const receivers = [{ email: toEmail }];

  try {
    const response = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Your OTP Code',
      textContent: `Your OTP is: ${otpCode}`,
    });

    console.log('Email sent:', response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
