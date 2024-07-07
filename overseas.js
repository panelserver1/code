const { makeWASocket, useMultiFileAuthState, downloadContentFromMessage } = require('@whiskeysockets/baileys')
const { createSticker, StickerTypes } = require('wa-sticker-formatter')
const axios = require("axios")
const moment = require("moment-timezone")
const ytdl = require("ytdl-core")
const fs = require("fs")
const config = require('./config')
const ping = require("ping")

const bulan = moment.tz('Asia/Jakarta').format('MM/MMMM')
const tahun = moment.tz('Asia/Jakarta').format('YYYY')
const tanggal = moment().tz("Asia/Jakarta").format("dddd, d")
const tanggall = moment().tz("Asia/Jakarta").format("dddd")
const jam = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')
const jamm = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm')
const timeWib = moment().tz('Asia/Jakarta').format('HH:mm:ss')
const wibTime = moment().tz('Asia/Jakarta').format('HH:mm:ss')
const penghitung = moment().tz("Asia/Jakarta").format("dddd, D MMMM - YYYY")
const kalender = moment().tz("Asia/Jakarta").format("d MMMM YYYY")

module.exports = async (overseas, chat) => {
    const msg = (
        chat.message?.extendedTextMessage?.text ??
        chat.message?.ephemeralMessage?.message?.extendedTextMessage?.text ??
        chat.message?.conversation
    ) || ''
    const Jid = chat.key.remoteJid

        const isGrup = Jid.endsWith('@g.us')

        const grupMetadata = isGrup ? await overseas.groupMetadata(Jid).catch(() => {}) : ''
        const participants = isGrup ? await grupMetadata.participants : ''

        const getRandom = (Ext) => {
            return Math.floor(Math.random() * 1000000)+Ext
        }
/////////////////////////////////////////////////////////////////////////////////////
        function sendOwnerContact() {
            const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${config.owner}
TEL;type=CELL;type=VOICE;waid=${config.nomorOwner.replace(/^[0-9]/g, '')}:${config.nomorOwner}
END:VCARD`
                    overseas.sendMessage(Jid, { contacts: {
                        displayName: config.owner,
                        contacts: [{ vcard }]
                    }}, { quoted: chat })
                }

                async function jadwalsholat(kota) {
                    try {
                    let { data } = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=8`)
                    let response = {
                      subuh: data.data.timings.Fajr,
                      dhuhur: data.data.timings.Dhuhr,
                      ashar: data.data.timings.Asr,
                      maghrib: data.data.timings.Maghrib,
                      isya: data.data.timings.Isha 
                     }
                    return response
                    } catch (e){
                    returne
                    }

                    /*async function randomCerpen() {
                        try {
                          const n = await axios.get("http://cerpenmu.com/"),
                          a = cheerio.load(n.data);
                          let r = [];
                          a("#sidebar > div").each(function (t, e) {
                            a(e)
                            .find("ul > li")
                            .each(function (t, e) {
                              let n = a(e).find("a").attr("href");
                              r.push(n);
                            });
                          });
                          var t = r[Math.floor(Math.random() * r.length)];
                          let o = await axios.get(${t});
                          const i = cheerio.load(o.data);
                          let c = [];
                          i("#content > article > article").each(function (t, e) {
                            let n = i(e).find("h2 > a").attr("href");
                            c.push(n);
                          });
                          var e = c[Math.floor(Math.random() * c.length)];
                          let s = await axios.get(${e}),
                          u = cheerio.load(s.data),
                          l = u("#content").find("article > h1").text().trim(),
                          h = u("#content").find("article > a:nth-child(2)").text().trim(),
                          f = [];
                          u("#content > article > p").each(function (t, e) {
                            let n = u(e).text().trim();
                            f.push(n);
                          });
                          let w = [];
                          for (let t of f) w += t;
                          return {
                            status: !0,
                            judul: l,
                            penulis: h,
                            sumber: e,
                            cerita: w
                          };
                        } catch (t) {
                          return {
                            status: !1
                          };
                        }
                      }*/

                async function pinterest(query) {
                    try {
                      const res = await axios(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
                      const random = res.data.resource_response.data.results[Math.floor(Math.random() * (res.data.resource_response.data.results.length))];
                      const result = {
                        url: random.images.orig.url
                      };
                      return result;
                    } catch (e) {
                      throw e;
                    }
                  }

                    /*await overseas.sendMessage(Jid, { text: 'hello!' })
                    await overseas.sendMessage(Jid, { delete: chat.key })*/

                async function ffStalk(id) {
                    try {
                      const response = await axios.get('https://allstars-apis.vercel.app/freefire?id=' + id);
                      return response.data;
                    } catch (error) {
                      console.error(error);
                    }
                  }
                  
        const downloadMp3 = async (Link) => {
            overseas.sendMessage(Jid, { react: {
                text: '⏳',
                key: chat.key
            }})
            try {
            await ytdl.getInfo(Link)
            let mp3File = getRandom('.mp3')
            ytdl(Link, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(mp3File))
            .on('finish', async () => {
            await overseas.sendMessage(Jid, { audio: fs.readFileSync(mp3File), mimetype: 'audio/mpeg' }, { quoted: chat })
            fs.unlinkSync(mp3File)
            })
            } catch (err) {
                overseas.sendMessage(Jid, { text: `${err}` }, { quoted: chat })
        }
    }
    
    const downloadMp4 = async (Link) => {
        overseas.sendMessage(Jid, { react: {
            text: '⏳',
            key: chat.key
        }})
        try {
            await ytdl.getInfo(Link)
            let mp4File = getRandom('.mp4')
            ytdl(Link)
            .pipe(fs.createWriteStream(mp4File))
            .on('finish', async () => {
                await overseas.sendMessage(Jid, { video: fs.readFileSync(mp4File), gifPlayback: false }, { quoted: chat })
                fs.unlinkSync(`./${mp4File}`)
            })
            } catch (err) {
            overseas.sendMessage(Jid, { text: `${err}` }, { quoted: chat })
            }
        }

        if (msg == '!online') {
            await overseas.sendMessage(Jid, { text: "Aku sedang online" }, { quoted: chat })
        }

        if (chat.message?.imageMessage?.caption == '!s' && chat.message?.imageMessage) {
                console.log('Mantap wak')
                const getMedia = async (msg) => {
                    const messageType = Object.keys(msg?.message)[0]
                    const stream = await downloadContentFromMessage(msg.message[messageType], messageType.replace('Message', ''))
                    let buffer = Buffer.from([])
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk])
                    }
                    return buffer
                }
                
                const mediaData = await getMedia(chat)
                const stickerOption = {
                    pack: "Ikann_STICKER",
                    author: "IkannBOT",
                    type: StickerTypes.FULL,
                    quality: 50
                }
                const generateSticker = await createSticker(mediaData, stickerOption);
                await overseas.sendMessage(Jid, { sticker: generateSticker }, { quoted: chat })
            }

            if (chat.message?.imageMessage?.caption == '!sticker' && chat.message?.imageMessage) {
                console.log('Mantap wak')
                const getMedia = async (msg) => {
                    const messageType = Object.keys(msg?.message)[0]
                    const stream = await downloadContentFromMessage(msg.message[messageType], messageType.replace('Message', ''))
                    let buffer = Buffer.from([])
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk])
                    }
                    
                    return buffer
                }
                
                const mediaData = await getMedia(chat)
                const stickerOption = {
                    pack: "Ikann_STICKER",
                    author: "IkannBOT",
                    type: StickerTypes.FULL,
                    quality: 50
                }
    
                const generateSticker = await createSticker(mediaData, stickerOption);
                await overseas.sendMessage(Jid, { sticker: generateSticker }, { quoted: chat })
            }
            
            if (msg && (msg.includes('ajg') || msg.includes('kntl'))) {
                await overseas.sendMessage(Jid, { react: {text: '❓',key: chat.key}})
                await overseas.sendMessage(Jid, { react: {text: '❗',key: chat.key}})
                await overseas.sendMessage(Jid, { react: {text: '‼',key: chat.key}})
                await overseas.sendMessage(Jid, { react: {text: '⚠',key: chat.key}})
                await overseas.sendMessage(Jid, { text: `Terdeksi ${chat.pushName} toxic` })
            }
            
/////////////////////////////////////////////////////////////////////////////////////

        if (msg.startsWith("!")) {
            const commandBody = msg.slice('!'.length)
            const args = commandBody.split(' ')
            const command = args.shift().toLowerCase()
            
            switch (command) {
                case 'menu':
                    await overseas.sendMessage(Jid, { react: {text: '🕛',key: chat.key}})
                    await overseas.sendMessage(Jid, { react: {text: '🕒',key: chat.key}})
                    await overseas.sendMessage(Jid, { react: {text: '🕕',key: chat.key}})
                    await overseas.sendMessage(Jid, { react: {text: '🕘',key: chat.key}})
                    await overseas.sendMessage(Jid, { react: {text: '🕛',key: chat.key}})
                    await overseas.sendMessage(Jid, { react: {text: '✔',key: chat.key}})
                    await overseas.sendMessage(Jid, { text: `╭─────═[ TODAY ]═─────⋆
│╭──────────────────⋆
┴│ *Siang kak ${chat.pushName}*
⬡│ 📆 *Tanggal:* ${tanggall}
⬡│ 🗓️ *Date:* ${kalender}
┬│ ⏰ *Waktu:* ${jam}
│╰──────────────────⋆
┠─────═[ INFO BOT ]═─────⋆
│╭──────────────────⋆
┴│ 🤖 *Nama Bot:* ${config.botName}
⬡│ 🔄 *Prefix:* [ *!* ]
⬡│ 🔋 *Battery:* Tidak Diketahui
⬡│ 🖥️ *Platform:* Windows
┬│ 💻 *Type:* Node.Js
│╰──────────────────⋆
╰──────────═┅═──────────


⃝▣──「 Menu 」───⬣
│○ !online
│○ !allmenu
▣───────────⬣`,contextInfo: {
    externalAdReply: {
    title: `${config.version}`,
    body: `${config.editor}`,
    thumbnail: await fs.readFileSync(await "image/1719237305891.jpg"),
    mediaType: 1,
    renderLargerThumbnail: true
    }}}, {quoted: chat})
                    break;

                case 'allmenu':
                    await overseas.sendMessage(Jid, { text: `⃝▣──「 Bot 」───⬣
│○ !online
│○ !fitur
▣───────────⬣` }, { quoted: chat })
                    break;

                case 'fitur':
                    await overseas.sendMessage(Jid, { text: `⃝▣──「 Bot 」───⬣
│○ -Anti link
│○ -Anti toxic
▣───────────⬣ `}, { quoted: chat })
                    break;

                case 'ytmp3':
                    await downloadMp3(args.join(' '))
                    break;

                case 'ytmp4':
                    await downloadMp4(args.join(' '))
                    break;
                
                case 'h':
                    if (isGrup) {
                        await overseas.sendMessage(Jid, { text: args.join(' '), mentions: participants.map(a => a.id) })
                    } else {
                        await overseas.sendMessage(Jid, { text: 'Fitur khusus Grup Ngab' })
                    }
                    break;

                case 'cekkhodam': {
                   if (!args.join(' ')) await overseas.sendMessage(Jid, { text: 'Masukkan namamu' }, { quoted: chat })
                   
                   const khodamData = JSON.parse(await fs.readFileSync(await './assets/listkhodam.json'))
                   const randomKhodam = khodamData[Math.floor(Math.random() * khodamData.length)]
                   const result = `*-- CEK KHODAM --*
Nama: ${args.join(' ')}
Khodam: ${randomKhodam}`
                   if (args.join(' ')) await overseas.sendMessage(Jid, { text: result }, { quoted: chat })
                   }
                   break;

                case 'cekganteng': {
                   if (!args.join(' ')) await overseas.sendMessage(Jid, { text: 'Masukkan namamu' }, { quoted: chat })
                   
                   const gantengData = JSON.parse(await fs.readFileSync(await './assets/listganteng.json'))
                   const randomGanteng = gantengData[Math.floor(Math.random() * gantengData.length)]
                   const result = `*-- CEK GANTENG --*
Nama: ${args.join(' ')}
Hasil: ${randomGanteng}`
                   if (args.join(' ')) await overseas.sendMessage(Jid, { text: result }, { quoted: chat })
                   }
                   break;

                case 'owner':
                    sendOwnerContact()
                    break;

                case 'dadu': {
                        const daduData = JSON.parse(await fs.readFileSync(await './assets/dadulist.json'))
                        const randomDadu = daduData[Math.floor(Math.random() * daduData.length)]
                        const result = `*-- DADU --*
Nama: ${args.join(' ')}
Hasil: ${randomDadu}`
                        
                        if (args.join(' ')) await overseas.sendMessage(Jid, { text: result }, { quoted: chat })
                        }
                        break;

                        case 'kalkulator':{
                            val = args.join(' ')
                            .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
                            .replace(/×/g, '*')
                            .replace(/÷/g, '/')
                            .replace(/π|pi/gi, 'Math.PI')
                            .replace(/e/gi, 'Math.E')
                            .replace(/\/+/g, '/')
                            .replace(/\++/g, '+')
                            .replace(/-+/g, '-')
                            let format = val
                            .replace(/Math\.PI/g, 'π')
                            .replace(/Math\.E/g, 'e')
                            .replace(/\//g, '÷')
                            .replace(/\*×/g, '×')
                            overseas.sendMessage(Jid, { react: { text: '🕒', key: chat.key }})
                            try {
                            let result = (new Function('return ' + val))()
                            if (!result) return overseas.sendMessage(Jid, { text: `${result}` }),{quoted: chat}
                            overseas.sendMessage(Jid, { text: `*${format}* = _${result}_`}),{quoted: chat}
                            } catch (e) {
                            if (e == undefined) return overseas.sendMessage(Jid, { text: 'Isinya?'}),{quoted: chat}
                            overseas.sendMessage(Jid, { text: 'Format salah, hanya 0-9 dan Simbol -, +, *, /, ×, ÷, π, e, (, ) yang disupport' }),{quoted: chat}
                            }
                            }
                            break

                            case 'ffstalk': {
                                const id = args.join(' ')
                                if (!id) return overseas.sendMessage(Jid, { text: 'Masukin ID FF nya Ngab' }, { quoted: chat })
                                const ff = await ffStalk(id)
                                const result = `*\`FREE FIRE STALK\`*
> BASIC INFO
*Name:* ${ff.BasicInfo.Name}
*ID:* ${ff.BasicInfo.UID}
*Level:* ${ff.BasicInfo.Level}
*Region:* ${ff.BasicInfo.Region}
*Honor Score:* ${ff.BasicInfo.HonorScore}
*Title:* ${ff.BasicInfo.Title}
*Bio:* ${ff.BasicInfo.Bio}

> ACTIVITY INFO
*Fire Pass:* ${ff.ActivityInfo.FirePass}
*CS Point:* ${ff.ActivityInfo.CSPoints}
*Created At:* ${ff.ActivityInfo.CreatedAt}
*Last Login:* ${ff.ActivityInfo.LastLogin}

> PET INFO
*Equipped:* ${ff.PetInfo.Equipped}
*Pet Name:* ${ff.PetInfo.PetName}
*Pet Type:* ${ff.PetInfo.PetType}
*Pet Level:* ${ff.PetInfo.PetLevel}
                                
> GUILD INFO
*Guild Name:* ${ff.GuildInfo.GuildName}
*Guild ID:* ${ff.GuildInfo.GuildID}
*Guild Level:* ${ff.GuildInfo.GuildLevel}
*Member:* ${ff.GuildInfo.LiveMembers}
                                `
                                console.log(result)
                                overseas.sendMessage(Jid, { text: result,contextInfo: {
                                    externalAdReply: {
                                    title: `${config.version}`,
                                    body: `${config.editor}`,
                                    thumbnail: await fs.readFileSync(await "image/1719237305891.jpg"),
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                    }}}, {quoted: chat})
                                }
                                break;

                                case 'cuaca': {
                                    const text = args.join(' ')
                                    if (!text) return overseas.sendMessage(Jid, { text: 'masukan nama daerah' })
                                    try {
                                            const response = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`)
                                            const res = await response
                                            const name = res.data.name
                                            const Country = res.data.sys.country
                                            const Weather = res.data.weather[0].description
                                            const Temperature = res.data.main.temp + "°C"
                                            const Minimum_Temperature = res.data.main.temp_min + "°C"
                                            const Maximum_Temperature = res.data.main.temp_max + "°C"
                                            const Humidity = res.data.main.humidity + "%"
                                            const Wind = res.data.wind.speed + "km/h"
                                            const wea = `「 📍 」 Place: ${name}\n「 🗺 」 Country: ${Country}\n「 🌤 」 Weather: ${Weather}\n「 🌡 」Temperature: ${Temperature}\n「 💠 」 Minimum Temperature: ${Minimum_Temperature}\n「 📛 」 Maximum Temperature: ${Maximum_Temperature}\n「 💦 」 Humidity: ${Humidity}\n「 🌬 」 Wind: ${Wind}
                                      `
                                    
                                            overseas.sendMessage(Jid, { text: wea})
                                        } catch (e) {
                                            return "Error location not found!!!"
                                    }
                                    }
                                    break;

                                    /*case 'pin' : {
                                        const text = args.join(' ')
                                        if (!text) return overseas.sendMessage(Jid, { text: 'masukan nama daerah' })
                                            overseas.sendMessage(Jid,{ react: { text: '🕒', key: chat.key }})
                                              try {
                                                let res = await pinterest(text) 
                                                overseas.sendFile(Jid, res.url, '', '', m) 
                                              } catch (e) {
                                                console.log(e) 
                                                overseas.reply(Jid, e, m) 
                                              }
                                            }*/

                                    case 'waktusholat' : {
                                        const text = args.join(' ')
                                        if (!text) return overseas.sendMessage(Jid, { text: 'masukan nama daerah' })
                                        let res = await jadwalsholat(text)
                                        overseas.sendMessage(Jid, { text : `「 📑 」 Jadwal sholat di ${text}

「 🌆 」 Subuh: ${res.subuh}
「 🏜 」 Dzuhur: ${res.dhuhur}
「 🌇 」 Ashar: ${res.ashar}
「 🌄 」 Maghrib: ${res.maghrib}
「 🌃 」 Isya: ${res.isya}`})

                                        }break;

                                        /*case 'tws': {
                                            await overseas.sendMessage(Jid, { text: 'nulas peypey' })
                                            await overseas.sendMessage(Jid, { text: 'updated text goes here', edit: chat.key, })
                                        }*/

                                    }

                    /*case 'https://' : {
                    overseas.sendMessage(Jid, { react: {text: '❓',key: chat.key}})
                    overseas.sendMessage(Jid, { react: {text: '❗',key: chat.key}})
                    overseas.sendMessage(Jid, { react: {text: '‼',key: chat.key}})
                    overseas.sendMessage(Jid, { react: {text: '⚠',key: chat.key}})
                    await overseas.sendMessage(Jid, { text: `Terdeksi @${chat.pushName} mengerim link`,contextInfo: {
                    externalAdReply: {
                    title: `${config.antilink} ${config.nit}`,
                    body: `${config.editor}`,
                    thumbnail: await fs.readFileSync(await "image/Dilarang Masuk.png"),
                    mediaType: 1,
                    renderLargerThumbnail: true
                    }}}, {quoted: chat})
                    }*/

                /*case 'oseas': {
                    async function gpt4(q) {
                          const headers = {
                            'Content-Type': 'application/json',
                            'Referer': 'https://chatgpt4online.org/',
                            'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                            'Sec-Ch-Ua-Mobile': '?0',
                            'Sec-Ch-Ua-Platform': '"Windows"',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                            'X-Wp-Nonce': '152990aad3'
                          };
                        
                        
                          const params = {
                            "botId": "default",
                            "customId": null,
                            "session": "N/A",
                            "chatId": "r20gbr387ua",
                            "contextId": 58,
                            "messages": [
                              {
                                "id": "0aqernpzbas7",
                                "role": "assistant",
                                "content": "Hi! How can I help you?",
                                "who": "AI: ",
                                "timestamp": 1719360952775
                              }
                            ],
                            "newMessage": q,
                            "newFileId": null,
                            "stream": false
                          };
                        
                        
                          try {
                            const response = await axios.post("https://chatgpt4online.org/wp-json/mwai-ui/v1/chats/submit", params, { headers });
                            console.log('Response:', response.data);
                          } catch (error) {
                            console.error('Error:', error);
                          }
                        await overseas.sendMessage(Jid, { text: response }, { quoted: chat })
                    }
                }*/
                

            /*  === R.I.P FITUR STICKER ===
            if (chat.message?.imageMessage?.caption == '!s' && chat.message?.imageMessage) {
                console.log('Mantap wak')
                const getMedia = async (msg) => {
                    const messageType = Object.keys(msg?.message)[0]
                    const stream = await downloadContentFromMessage(msg.message[messageType], messageType.replace('Message', ''))
                    let buffer = Buffer.from([])
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk])
                    }
                    return buffer
                }
                
                const mediaData = await getMedia(chat)
                const stickerOption = {
                    pack: "Ikann_STICKER",
                    author: "IkannBOT",
                    type: StickerTypes.FULL,
                    quality: 50
                }
                const generateSticker = await createSticker(mediaData, stickerOption);
                await socket.sendMessage(chat.key.remoteJid, { sticker: generateSticker })
            }

            if (chat.message?.imageMessage?.caption == '!sticker' && chat.message?.imageMessage) {
                console.log('Mantap wak')
                const getMedia = async (msg) => {
                    const messageType = Object.keys(msg?.message)[0]
                    const stream = await downloadContentFromMessage(msg.message[messageType], messageType.replace('Message', ''))
                    let buffer = Buffer.from([])
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk])
                    }
                    
                    return buffer
                }
                
                const mediaData = await getMedia(chat)
                const stickerOption = {
                    pack: "Ikann_STICKER",
                    author: "IkannBOT",
                    type: StickerTypes.FULL,
                    quality: 50
                }
    
                const generateSticker = await createSticker(mediaData, stickerOption);
                await socket.sendMessage(chat.key.remoteJid, { sticker: generateSticker })
            }*/
        }}
        }
