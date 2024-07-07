const { makeWASocket, useMultiFileAuthState, downloadContentFromMessage } = require('@whiskeysockets/baileys')
const pino = require('pino')
const axios = require('axios')
const config = require('./config')

async function connectWhatsapp() {
    const auth =  await useMultiFileAuthState("session")
    const overseas = makeWASocket({
        printQRInTerminal: true,
        browser: ["IKANN BOT!!", "Ikann", "1.0.0"],
        auth: auth.state,
        logger: pino({ level: "silent" })
    });

    overseas.ev.on("creds.update", auth.saveCreds);
    overseas.ev.on("connection.update", async ({ connection }) => {
        if (connection === "open") {
            console.log("BOT MENYALAA -- BY IKANN");
        } else if (connection === "close") {
            await connectWhatsapp();
        }
    });

    overseas.ev.on("messages.upsert", async ({messages, type }) => {const chat = messages[0]
        console.log(chat)
        await require('./overseas.js')(overseas, chat)
    })


}

connectWhatsapp()