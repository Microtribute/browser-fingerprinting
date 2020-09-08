
const fetch = require('node-fetch');

function requestId() {
    let e = ''

    for (let r = 0; r < 20; r++) {
        e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
    }

    return e;
}

async function r() {
    const body = {
        "rid": requestId(),
        "cv": "2.7.5",
        "c": "1IZEt20622",
        "url": "https://fingerprintjs.com/demo",
        "d": 38,
        "i": 2,
        // "j": "s8kH9/EA/A6smSvxM2Mc28vpfcunFOSXzGuyHLSD4zSDKqGJvTOx/Jo+4U7FxzxWGNRvW/d7mBqR6KE44SOXQJhYat6ITp4qF8lum92eSRpyeXpo9WPAYZWhMnVBjZryGyyvDCF+GLYSQAlv+xY=",
        "cbd": 1,
        "cr": "https://www.google.com/",
        "k2": [
            [
                "en-US"
            ],
            [
                "en-US",
                "en",
                "ko"
            ]
        ],
        "k3": 24,
        "k4": 8,
        "k5": [
            3840,
            1080
        ],
        "k6": [
            1920,
            1053
        ],
        "k7": 12,
        "k8": -60,
        "k9": "Europe/London",
        "k10": 1,
        "k11": 1,
        "k12": 1,
        "k13": 1,
        "k15": "Linux x86_64",
        "k16": [
            {
                "name": "Chrome PDF Plugin",
                "description": "Portable Document Format",
                "mimeTypes": [
                    {
                        "type": "application/x-google-chrome-pdf",
                        "suffixes": "pdf"
                    }
                ]
            },
            {
                "name": "Chrome PDF Viewer",
                "description": "",
                "mimeTypes": [
                    {
                        "type": "application/pdf",
                        "suffixes": "pdf"
                    }
                ]
            },
            {
                "name": "Native Client",
                "description": "",
                "mimeTypes": [
                    {
                        "type": "application/x-nacl",
                        "suffixes": ""
                    },
                    {
                        "type": "application/x-pnacl",
                        "suffixes": ""
                    }
                ]
            }
        ],
        "k17": {
            "winding": true,
            "data": "1a41d156505f0cb045b1d3c13422e98d"
        },
        "k18": 0,
        "k19": {
            "maxTouchPoints": 0,
            "touchEvent": false,
            "touchStart": false
        },
        "k20": [
            "Calibri",
            "PMingLiU"
        ],
        "k21": 124.04347730590962,
        "k22": 1,
        "k23": "20030107",
        "k24": 33,
        "k25": 0,
        "k26": 0,
        "k27": "Google Inc.",
        "k28": 1,
        "k29": 0,
        "k30": 0,
        "k31": 0,
        "k32": 1,
        "k33": 0
    };

    const response = await fetch("https://f.fingerprintjs.com/", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,ko;q=0.8",
            "content-type": "text/plain",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "referrer": "https://fingerprintjs.com/demo",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors"
    });

    const json = await response.json();

    return json;
}

async function main() {
    const response = await r();
    console.log(response.visitorId, response.visitorFound);
}

main();
