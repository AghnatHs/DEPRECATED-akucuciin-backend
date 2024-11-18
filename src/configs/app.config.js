const isDevelopment = process.env.DEV;
const APPCONFIG = {
  isDevelopment: isDevelopment,
  url: {
    verifyEmailSuccess: isDevelopment
      ? process.env.VERIFY_URL_REDIRECT_SUCCESS
      : process.env.PROD_VERIFY_URL_REDIRECT_SUCCESS,
    verifyEmailExpired: isDevelopment
      ? process.env.VERIFY_URL_REDIRECT_ERROR_EXPIRED
      : process.env.PROD_VERIFY_URL_REDIRECT_ERROR_EXPIRED,
    verifyEmailInvalid: isDevelopment
      ? process.env.VERIFY_URL_REDIRECT_ERROR_INVALID
      : process.env.PROD_VERIFY_URL_REDIRECT_ERROR_INVALID,
    verifyEmailAlreadyActive: isDevelopment
      ? process.env.VERIFY_URL_REDIRECT_ERROR_ALREADY_ACT
      : process.env.PROD_VERIFY_URL_REDIRECT_ERROR_ALREADY_ACT,
  },
  googleEnv: {
    keyFile: process.env.GOOGLE_KEYFILE,
    sheetId: process.env.GOOGLE_SPREADSHEET_ID
  }
};

module.exports = APPCONFIG;
