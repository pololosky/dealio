import QRCode from "qrcode";
const { authenticator } = require("otplib");

export const generateTwoFactorSecret = (email: string) => {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, "Dealio POS", secret);
  return { secret, otpauth };
};

export const generateQRCodeDataURL = async (otpauth: string) => {
  return await QRCode.toDataURL(otpauth);
};

export const verifyTwoFactorToken = (token: string, secret: string) => {
  return authenticator.verify({ token, secret });
};
