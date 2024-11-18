const { google } = require("googleapis");
const APPCONFIG = require("../configs/app.config");

const auth = new google.auth.GoogleAuth({
  keyFile: APPCONFIG.googleEnv.keyFile,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = APPCONFIG.googleEnv.sheetId;

const GoogleAPIService = {
  sendOrderToSheets: async (data) => {
    try {
    const arrData = [
      [
        data.id,
        data.customer_id,
        data.customer_name,
        data.customer_telephone,
        null,
        null,
        null,
        data.gmaps_pinpoint,
        data.customer_address,
        null,
        data.code_referral,
        data.code_referral !== "" ? "YA" : "TIDAK",
        data.pickup_date,
        data.delivery_date,
        data.note === "" ? "tidak ada catatan" : data.note,
        data.laundry_type,
        data.laundry_content,
      ],
    ];

    const range = `WebFormTest!A1`; 

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: {
        values: arrData,
      },
    });
  } catch(e) {
    console.log(e);
  }
},
};

module.exports = GoogleAPIService;
