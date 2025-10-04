"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailUserTemplate = void 0;
const mailUserTemplate = (message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message To User</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff; /* White background for the container */
                padding: 40px;
                border-radius: 8px;
            }
            h3 {
                color:rgb(13, 13, 228); /* Bold red color for the header */
                font-size: 24px;
                margin-bottom: 20px;
            }
            p {
                color: #4A5568; /* Darker grey for text */
                font-size: 16px;
                margin-bottom: 10px;
            }
            .link {
                color:rgb(13, 13, 228); /* Bold red color for links */
                text-decoration: underline;
            }
            .footer {
                font-size: 12px;
                color: #4A5568;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body style="font-family: 'Inter', sans-serif; background-color: #ffffff; padding: 20px; margin: 0; color: #4A5568;">
        <div class="container">
            ${message}
        </div>
    </body>
    </html>
    `;
};
exports.mailUserTemplate = mailUserTemplate;
