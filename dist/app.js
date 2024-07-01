"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const grammy_1 = require("grammy");
const TutorialBot_1 = require("./TutorialBot"); // Ensure this file exists and exports 'bot'
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();

const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const DOMAIN = process.env.DOMAIN;

if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN must be set in the environment variables.");
}
if (!DOMAIN) {
    throw new Error("DOMAIN must be set in the environment variables.");
}

// Define the path for the webhook
const webhookPath = `/telegram/${BOT_TOKEN}`;

// Parse JSON bodies (as sent by the Telegram API)
app.use(express_1.default.json());

// Serve favicon (placeholder or actual file)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Set the webhook callback to handle updates
app.use(webhookPath, (0, grammy_1.webhookCallback)(TutorialBot_1.bot, 'express'));

// Start express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    TutorialBot_1.bot.api.setWebhook(`https://${DOMAIN}${webhookPath}`)
        .then(() => console.log(`Webhook set to https://${DOMAIN}${webhookPath}`))
        .catch(console.error);
});

exports.default = app;
