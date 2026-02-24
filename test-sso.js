import crypto from "crypto";

// const KJL_URL = "https://openapi.kujiale.com";
// const API_PATH = "/v2/sso/token";

const APP_KEY = "0jvklkECkz";
const APP_SECRET = "qmIxFknndEpkOxRhzU6ysNdxpl9GBc0E";
const APP_UID = "3FO4K4UEG61B";

// function generateSignature(appkey, appsecret, appuid) {
//     const timestamp = Date.now().toString();
//     const rawString = appsecret + appkey + appuid + timestamp;

//     const sign = crypto
//         .createHash("md5")
//         .update(rawString, "utf8")
//         .digest("hex");

//     return { sign, timestamp };
// }

// async function getToken() {
//     const { sign, timestamp } = generateSignature(
//         APP_KEY,
//         APP_SECRET,
//         APP_UID
//     );

//     const params = new URLSearchParams({
//         timestamp,
//         appkey: APP_KEY,
//         sign,
//         appuid: APP_UID,
//         dest: "5"
//     });

//     const response = await fetch(
//         `${KJL_URL}${API_PATH}?${params.toString()}`,
//         {
//             method: "POST"
//         }
//     );

//     const result = await response.json();
//     console.log(result);
// }

// getToken().catch(console.error);


//////


const KJL_URL = "https://openapi.kujiale.com";
const API_PATH = "/v2/register";


function generateSignature(appkey, appsecret, appuid) {
    const timestamp = Date.now().toString();
    const rawString = appsecret + appkey + appuid + timestamp;

    const sign = crypto
        .createHash("md5")
        .update(rawString, "utf8")
        .digest("hex");

    return { sign, timestamp };
}

async function createAccount() {
    const { sign, timestamp } = generateSignature(
        APP_KEY,
        APP_SECRET,
        APP_UID
    );

    const params = new URLSearchParams({
        timestamp,
        appkey: APP_KEY,
        sign,
        appuid: APP_UID
    });

    const response = await fetch(
        `${KJL_URL}${API_PATH}?${params.toString()}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "dome7ai",
                email: "dome7ai01@gmail.com",
                type: 0
            })
        }
    );

    const result = await response.json();
    console.log(result);
}

createAccount().catch(console.error);
