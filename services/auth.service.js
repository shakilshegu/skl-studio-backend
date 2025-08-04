import axios from "axios";
import nodemailer from "nodemailer";


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


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendOTPMessageEmail = async (toEmail, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Your SKL Studio OTP Code",
      text: `Hello,

Your SKL Photography verification code is: ${otp}

Please enter this code to continue. This code is valid for the next 5 minutes.

If you didn’t request this code, you can safely ignore this message.

— Team SKL Photography`,
      html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Hello,</p>
      <p>Your <strong>SKL Photography</strong> verification code is:</p>
      <h2 style="color: #2c3e50;">${otp}</h2>
      <p>This code is valid for the next <strong>5 minutes</strong>.</p>
      <p>If you did not request this code, you can safely ignore this email.</p>
      <p style="margin-top: 20px;">— Team SKL Photography</p>
    </div>
  `,
    };


    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${toEmail}`);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Email sending failed");
  }
};



export {
  sendOTPMessage,
  sendOTPMessageEmail
};