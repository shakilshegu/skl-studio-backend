import axios from "axios";

const sendOTPMessage = async (phoneNumber, otp) => {
  const text = `${otp}is the OTP for Mobile number verification - First House . Know us more on https://firsthouse.in/home`;
  const encodedMessage = encodeURIComponent(text);
  // Construct the JustSMS API URL
  const url = `http://text.justsms.co.in/api.php?username=${process.env.JUSTSMS_USERNAME}&apikey=${process.env.JUSTSMS_APIKEY}&senderid=${process.env.JUSTSMS_SENDERID}&templateid=${process.env.JUSTSMS_TEMPLATEID}&mobile=${phoneNumber}&message=${encodedMessage}`;


try {
  // Send the request to JustSMS API
  const response = await axios.get(url);
  if (response.data.campid) {
    return true;
  } else if (response.data.status === "SUCCESS") {
    return true;
  } else {
    console.error("Error from JustSMS:", response.data.message || "Unknown error");
    return false;
  }
} catch (error) {
  console.error("Error sending SMS:", error);
  throw new Error("Failed to send OTP");
}
};


export {
  sendOTPMessage
};