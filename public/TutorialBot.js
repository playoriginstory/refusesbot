"use strict";
const { Bot } = require("grammy");
const axios = require("axios");
const FormData = require("form-data");
const { config, ethers } = require("@fal-ai/serverless-client");
const dotenv = require("dotenv");
dotenv.config();

// Configure FAL.ai client
config({
    credentials: process.env.FAL_API_KEY,
});

if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN environment variable is not set.");
}

const bot = new Bot(process.env.BOT_TOKEN);
const contractABI = [/* ABI details omitted for brevity */];

// Session middleware setup
bot.use((0, session)({
    initial: () => ({
        answers: [],
        generationCount: 0,
    }),
}));

bot.command("start", async (ctx) => {
    ctx.session.answers = [];
    ctx.session.imageUrl = undefined;
    ctx.session.metadataUrl = undefined;
    ctx.session.walletAddress = undefined;
    ctx.session.generationCount = 0;
    await ctx.reply("Hello Agent! Choose your secret weapon.");
});

bot.on("message:text", async (ctx) => {
    const session = ctx.session;
    if (!ctx.msg.text) return;

    if (session.generationCount >= 5) {
        await ctx.reply("You've reached the maximum number of generations.");
        return;
    }

    if (session.answers.length < 3) {
        session.answers.push(ctx.msg.text);
        switch (session.answers.length) {
            case 1:
                await ctx.reply("Hello Agent! Choose your hat.");
                break;
            case 2:
                await ctx.reply("Hello Agent! Choose your outfit color.");
                break;
            case 3:
                const prompt = `An animated secret agent, equipped with ${session.answers[0]}, wearing a ${session.answers[1]} hat and ${session.answers[2]} outfit. This image should be glossy, symmetrical, and high-resolution.`;
                await ctx.reply("Aggregating new prompt...");
                try {
                    const imageUrl = await generateImage(prompt);
                    session.imageUrl = imageUrl;
                    session.generationCount += 1;
                    await ctx.reply(`Here is your image: ${imageUrl}`);
                    await ctx.reply("Would you like to mint this image as an NFT? Reply 'yes' or 'no'.");
                } catch (error) {
                    await ctx.reply("Failed to generate image.");
                }
                break;
        }
    } else if (ctx.msg.text.toLowerCase() === "yes" && session.imageUrl) {
        await ctx.reply("Uploading image to IPFS...");
        try {
            const metadataUrl = await uploadToPinata(session.imageUrl);
            session.metadataUrl = metadataUrl;
            await ctx.reply("Please provide your wallet address.");
        } catch (error) {
            await ctx.reply("Failed to upload to IPFS.");
        }
    } else if (ctx.msg.text.toLowerCase() === "no") {
        await ctx.reply("Restarting...");
        session.answers = [];
        session.imageUrl = undefined;
        session.metadataUrl = undefined;
        session.walletAddress = undefined;
        session.generationCount = 0;
        await ctx.reply("Welcome back! Choose your secret weapon.");
    } else if (session.metadataUrl && ethers.utils.isAddress(ctx.msg.text)) {
        session.walletAddress = ctx.msg.text;
        await ctx.reply("Minting your NFT, this may take a few moments...");
        try {
            const transactionHash = await mintNFT(session.walletAddress, session.metadataUrl);
            await ctx.reply(`NFT minted successfully! Transaction hash: [${transactionHash}](https://explorer.mantle.xyz/tx/${transactionHash}), Metadata: [View on IPFS](${session.metadataUrl})`, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error("Error during minting NFT:", error);
            await ctx.reply("Minting failed due to a blockchain error. Please try again later.");
        }
    } else {
        await ctx.reply("Please reply 'yes' to mint or 'no' to restart.");
    }
});

async function generateImage(prompt) {
    const options = {
        input: { prompt },
        headers: { Authorization: `Bearer ${process.env.FAL_API_KEY}` }
    };
    const result = await fal.subscribe("fal-ai/stable-cascade", options);
    if (result.images && result.images.length > 0) {
        return result.images[0].url;
    } else {
        throw new Error("No images generated.");
    }
}

async function uploadToPinata(imageUrl) {
    console.log("Starting image upload to Pinata...");
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');
        const formData = new FormData();
        formData.append("file", imageBuffer, "image.png");
        console.log("Uploading to Pinata...");
        const pinataResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
                Authorization: `Bearer ${process.env.PINATA_JWT}`
            }
        });
        console.log("Upload successful:", pinataResponse.data);
        return `https://gateway.pinata.cloud/ipfs/${pinataResponse.data.IpfsHash}`;
    } catch (error) {
        console.error("Failed to upload to Pinata:", error);
        throw error;
    }
}

async function mintNFT(walletAddress, metadataUrl) {
    const provider = new ethers.providers.JsonRpcProvider("base");
    const signer = new ethers.Wallet(process.env.MAINNET_PRIVATE_KEY.trim(), provider);
    const contract = new ethers.Contract("0x3a18694852924178f20b61d18b0195c2db1e4c00", contractABI, signer);

    try {
        const transactionResponse = await contract.mintNFT(walletAddress, metadataUrl, {
            value: ethers.utils.parseEther("0") // assuming mintFee is 0 as per your contract constructor
        });
        await transactionResponse.wait();
        return transactionResponse.hash;
    } catch (error) {
        console.error("Error during minting NFT:", error);
        throw error;
    }
}

bot.start();
