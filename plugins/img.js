const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  config: {
    name: "img",
    aliases: ["image", "editimg"],
    permission: 0,
    prefix: true,
    description: "AI Image Tools",
    categories: "Tools",
    usages: [`${global.config.PREFIX}img (reply to image)`],
    credit: "Developed by Mohammad Nayan"
  },

  start: async ({ api, event }) => {
    const { message } = event;

    const ctx = message?.message?.extendedTextMessage?.contextInfo;
    if (!ctx) {
      return api.sendMessage(event.threadId, { text: "⚠️ Please reply to an image." }, { quoted: message });
    }

    const quoted = ctx.quotedMessage;

    if (!quoted.imageMessage) {
      return api.sendMessage(event.threadId, { text: "❌ Only image is allowed." }, { quoted: message });
    }

    
    const buffer = await downloadMediaMessage(
      { message: quoted },
      "buffer",
      {},
      { logger: undefined, reuploadRequest: api.updateMediaMessage }
    );

    
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const filePath = path.join(cacheDir, `img_${Date.now()}.jpg`);
    fs.writeFileSync(filePath, buffer);

    
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));

    const {data} = await axios.get(`https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/refs/heads/main/api.json`)

    const upload = await axios.post(data.gemini+"/nayan/postimage", form, {
      headers: form.getHeaders()
    });

    const uploadedUrl = upload.data.direct_link;

    const msg = `
📸 *Choose an AI Image Tool:*
1️⃣ Upscale  
2️⃣ Enhance  
3️⃣ Remove Text  
4️⃣ Remove Watermark  
5️⃣ OCR (Get Text)  
6️⃣ Remove Background  

Reply with *1–6*
    `;

    const sent = await api.sendMessage(event.threadId, { text: msg }, { quoted: message });
    global.client.handleReply.push({
        name: "img",
        messageID: sent.key.id || sent.messageID,
        author: event.senderId,
        uploadedUrl
    });
  },

  handleReply: async ({ api, event, handleReply }) => {

    
    if (event.senderId !== handleReply.author) return;

    const { uploadedUrl } = handleReply;
    const url = encodeURIComponent(uploadedUrl);
    const waitMsg = await api.sendMessage(event.threadId, { text: "⏳ Processing image... Please wait..." }, { quoted: event.message });

    const option = event.body.trim();
    const {data} = await axios.get(`https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/refs/heads/main/api.json`)
    

    const apiLinks = {
      "1": { link: `${data.api}/nayan/upscale?url=${url}`, type: "Upscaled" },
      "2": { link: `${data.api}/nayan/enhanced?url=${url}`, type: "Enhanced" },
      "3": { link: `${data.api}/nayan/rmtext?url=${url}`, type: "Text Removed" },
      "4": { link: `${data.api}/nayan/rmwtmk?url=${url}`, type: "Watermark Removed" },
      "5": { link: `${data.api}/nayan/ocr?url=${url}`, type: "OCR" },
      "6": { link: `${data.api}/nayan/rmbg?url=${url}`, type: "Background Removed" }
    };

    if (!apiLinks[option]) {
      return api.sendMessage(event.threadId, { text: "❌ Invalid option." }, { quoted: event.message });
    }

    const chosen = apiLinks[option];

    if (option === "5") return runOCR(api, event, chosen.link);

    return runProcess(api, event, chosen.link, chosen.type, waitMsg);
  }
};

// ====== Processing Functions ======

async function runProcess(api, event, apiUrl, actionType, waitMsg) {
  try {
    const res = await axios.get(apiUrl);

    

    const processed =
      res.data.upscaled ||
      res.data.enhanced_image ||
      res.data.removed_text_image ||
      res.data.watermark_removed_image ||
      res.data.removed_background_image;
    
    if (!processed)
      return api.sendMessage(event.threadId, { text: "❌ Failed to process image." }, { quoted: event.message });

    

    const img = (await axios.get(processed, { responseType: "stream" })).data;

    await api.sendMessage(event.threadId, { delete: waitMsg.key })

    return api.sendMessage(
      event.threadId,
      {
        image: { stream: img },
        caption: `✔️ ${actionType}`
      },
      { quoted: event.message }
    );
  } catch (err) {
    console.log(err);
    return api.sendMessage(event.threadId, { text: "❌ Error processing image." });
  }
}

async function runOCR(api, event, apiUrl) {
  try {
    const res = await axios.get(apiUrl);

    if (!res.data.text)
      return api.sendMessage(event.threadId, { text: "❌ Could not extract text." });

    return api.sendMessage(
      event.threadId,
      { text: `📄 Extracted Text:\n\n${res.data.text}` },
      { quoted: event.message }
    );

  } catch (err) {
    console.log(err);
    return api.sendMessage(event.threadId, { text: "❌ OCR failed." }, { quoted: event.message });
  }
}
