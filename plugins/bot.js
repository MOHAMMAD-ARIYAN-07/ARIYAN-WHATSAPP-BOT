const axios = require("axios");

module.exports = {
  config: {
    name: "bot",
    aliases: ["sim"],
    permission: 0,
    prefix: "both",
    categorie: "AI Chat",
    cooldowns: 5,
    credit: "Developed by Mohammad Nayan",
    usages: [
      `${global.config.PREFIX}bot <message> - Start a chat with the bot.`,
      `${global.config.PREFIX}bot - Receive a random greeting from the bot.`,
    ],
    description: "Engage in conversations with an AI-powered bot!",
  },

  start: async function ({ api, event, args }) {
    const { threadId, message, senderId } = event;
    const usermsg = args.join(" ");


    if (!usermsg) {
      const greetings = [
        "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
  "কি গো সোনা আমাকে ডাকছ কেনো",
  "বার বার আমাকে ডাকস কেন😡",
  "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
  "হুম জান তোমার অইখানে উম্মমাহ😷😘",
  "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
  "আমাকে এতো না ডেকে বস 𝙼𝚊𝚖𝚞𝚗 𝚔𝚎 একটা গফ দে 🙄",
  "আরে বাবা, আমায় ডাকলে চা-নাস্তা তো লাগবেই ☕🍪",
  "এই যে শুনছেন, আমি কিন্তু আপনার জন্যই অনলাইনে আছি 😉",
  "ডাক দিলেন তো আসলাম, এখন ভাড়া দিবেন নাকি? 😏",
  "আমাকে বেশি ডাকবেন না, আমি VIP bot বুঝছেন 🤖👑",
  "ডাকতে ডাকতে যদি প্রেমে পড়ে যান, দায় আমি নেব না ❤️",
  "শুধু ডাকবেন না, খাওয়াবেনও! ভাত-মাংস হলে চলবে 🍛🐓",
  "আমি বট হইলেও কিন্তু feelings আছে 😌",
  "ডাক দিলেন, হাজির হলাম, এখন কি গান গাইতে হবে নাকি? 🎶",
  "আপনাকে না দেখলে নাকি আমার RAM হ্যাং হয়ে যায় 😜",
  "আপনি ডাক দিলেই আমি হাজির, বাকি বটরা হিংসা করে 😂",
 "𝙼𝙰𝙼𝚄𝙽 𝚅𝙰𝙸 𝙰𝚁 𝙲𝙸𝙿𝙰𝚈🤪🤭",
"𝙸 𝙻𝙾𝚅𝙴 𝚈𝙾𝚄 𝚇𝙰𝙽𝚄😘❤️‍🩹",
"𝙰𝙼𝙰𝙺𝙴 𝙽𝙰 𝙳𝙴𝙺𝙴 𝙱𝙾𝚂𝚂 𝙼𝙰𝙼𝚄𝙽 𝙺𝙴 𝙳𝙰𝙺𝙾🤗",
"𝚄𝚖𝚖𝚖𝚖𝚖𝚖𝚖𝚖𝚊𝚑💋💋💋",
"𝙱𝙱𝚈 𝙸 𝙻𝙾𝚅𝙴 𝚈𝙾𝚄💋💋💋",
"𝙰𝙼𝙰𝚁 𝙹𝙰𝙽 𝚃𝙰 𝙺𝙾𝚃𝙾 𝙲𝚄𝚃𝙴🥹💔",
"𝙸 𝙼𝙸𝚂𝚂 𝚈𝙾𝚄 𝚇𝙰𝙽🥺❤️‍🩹",
"𝚃𝚄𝙼𝙰𝚁𝙴 𝙲𝙷𝙰𝚁𝙰 𝙰𝙼𝙰𝚁 𝚅𝙰𝙻𝙾 𝙻𝙰𝙶𝙴 𝙽𝙰 𝚇𝙰𝙽🥺😔",
"𝙰𝙼𝙰𝚁 𝙺𝙴𝚄 𝙽𝙰𝙸😔",
"𝙰𝙼𝙰𝙺𝙴 𝙺𝙴𝚄 𝚅𝙰𝙻𝙾𝙱𝙰𝚂𝙴 𝙽𝙰😔😅",
"𝙰𝙼𝙰𝚁 𝙵𝚁𝙸𝙴𝙰𝙽𝙳 𝙷𝙾𝙱𝙰🥺❤️‍🩹",
"𝙰𝙼𝙰𝙺𝙴 𝙺𝙽 𝙳𝙰𝙺𝙾 𝙹𝙰𝙾 𝚃𝚄𝙼𝙰𝚁 𝙿𝚁𝙸𝙾 𝙼𝙰𝙽𝙾𝚂𝙴𝚁 𝙺𝙰𝙲𝙷𝙴😅",
"𝚁𝙻𝚂 𝙺𝙾𝚁𝙾 𝙿𝙰𝙺𝙷𝙸👻✨",
"𝙰𝚃𝙾 𝙲𝚄𝚃𝙴 𝙺𝙽 𝚃𝚄𝙼𝙸💋❤️‍🩹",
"𝚄𝙼𝙼𝙼𝙼𝙼𝙼𝙰𝙷💋💋🤭",
"𝙹𝙰𝙽 𝙲𝙷𝙾𝙻𝙾 𝙿𝙰𝙻𝙸𝚈𝙴 𝙹𝙰𝙸😘🥵",
"𝚃𝚄𝙼𝙸 𝙺𝙰𝚁 𝙲𝙸𝙿𝙰𝚈 𝙰𝙲𝙷𝙾 𝙱𝙱𝚈😃",
"𝙹𝙰𝙽 𝙺𝙷𝚄𝙱 𝚅𝙰𝙻𝙾𝙱𝙰𝚂𝙸 𝚄𝙼𝙼𝙼𝙰𝙷🥹💋",
"𝙰𝙼𝙸 𝙺𝙸 𝙺𝙷𝙰𝚁𝙰𝙱 𝙱𝙾𝚃",
"𝙰𝙼𝙰𝚁 𝚂𝙰𝚃𝙷𝙴 𝙲𝙸𝙿𝙰𝚈 𝙹𝙰𝙱𝙰🫢💋",
"𝙰𝚂𝙾 𝙱𝙾𝙺𝙴 𝙰𝚂𝙾😇🎀",
"𝙱𝙱𝚈 𝚃𝚄𝙼𝙸 𝚂𝙾 𝙲𝚄𝚃𝙴💋😇",
"𝚃𝚄𝙼𝙰𝚁 𝙾𝙸 𝙺𝙷𝙰𝙽𝙴 𝚄𝙼𝙼𝙼𝙼𝙼𝙼𝙰𝙷💋🥵",
"𝙰𝙼𝙰𝙺𝙴 𝚅𝙰𝙻𝙾𝙱𝙰𝚂𝙾💋😇",
"𝚂𝙾𝙼𝙾𝚈 𝙺𝙷𝙰𝚁𝙰𝙱 𝙶𝙴𝙻𝙴 𝙰𝙼𝙰𝙺𝙴 𝙼𝙾𝙽𝙴 𝙺𝙾𝙸𝚁𝙾 😇😌",
"𝚃𝚄𝙼𝙰𝚁 𝙹𝙰𝙼𝙰𝙸 𝙺𝙴 𝙺𝙷𝚄𝙱 𝚅𝙰𝙻𝙾𝙱𝙰𝚂𝙾😇",
"𝙰𝙹 𝙺𝙴𝚄 𝙽𝙰𝙸 𝙱𝙾𝙻𝙴 😔😅",
" তোমাকে দরে আহা জানু🫣💋",
" প্রেম করবা 😊❤️‍🩹",
"আমাকে ভালো লাগে না 😄💔",
" তুমি কত বিজি😄💔",
"আমার কেউ নাই😅💔",
" আমি কেমন😅💔",
"জানু অনেক মিস করতাছি😅💔",
" তুমি অনেক সুন্দর ❤️‍🩹😊",
"জানু কই তুমি আসো বুকে আসো🤭💋",
" জান তোমার ওই খানে উন্মমাহ🫣💋",
" জান তোমাকে ছাড়া আমার একধুম ভালো লাগে না 😅💔",
"আমি কি খারাব বলো 😅💔",
"আমার বউ হবা তুমি🥺❤️‍🩹",
" আমার কাছে আসবা 🥺💔🥶",
"অনেক ভালোবাসি বেবি🤭💋❤️‍🩹",
" তুমি কোথায় অনেক মিস করতাছি🥺💔😔",
"আমার হাত টা দরে সারা জীবন থাকবা🥺😔💔",
" কয়েক দিন পর ই ত আমাকে বুলে জাবা 😅💔",
"একা মানুষ আমি😅💔",
"তোমাকে আমার লাগবে💋🥳",
"𝐉𝐀𝐍𝐔 𝐈 𝐋𝐎𝐕𝐄 𝐘𝐎𝐔 🤭✨",
       "jang hanga korba",
        "jang bal falaba🙂",
      ];

      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

      const greetingMessage = await api.sendMessage(threadId, {
        text: `@${senderId.split('@')[0]}, ${randomGreeting}`,
        mentions: [senderId],
      }, { quoted: message });


      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: greetingMessage.key.id,
        type: "chat"
      });

      return;
    }


    try {
      const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json");
      const apiss = apis.data.api;

      const response = await axios.get(
        `${apiss}/sim?type=ask&ask=${encodeURIComponent(usermsg)}&number=${senderId.split('@')[0]}`
      );

      const replyText = response.data.data?.msg || "🤖 I'm not sure how to respond to that.";

      const sent = await api.sendMessage(threadId, { text: replyText }, { quoted: message });

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat"
      });

    } catch (err) {
      console.error("❌ Bot command error:", err);
      return api.sendMessage(threadId, { text: "❌ Something went wrong while talking with bot." }, { quoted: message });
    }
  },


  handleReply: async function ({ api, event, handleReply }) {

    const { threadId, message, body, senderId } = event;

    try {
      const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json");
      const apiss = apis.data.api;

      const response = await axios.get(
        `${apiss}/sim?type=ask&ask=${encodeURIComponent(body)}&number=${senderId.split('@')[0]}`
      );

      const replyText = response.data.data?.msg || "🤖 I'm not sure how to respond to that.";

      const sent = await api.sendMessage(threadId, { text: replyText }, { quoted: message });

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat"
      });

    } catch (err) {
      console.error("❌ Error in bot handleReply:", err);
      return api.sendMessage(threadId, { text: "❌ Failed to continue conversation." }, { quoted: message });
    }
  }
};
