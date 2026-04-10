const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  config: {
    name: "getlink",
    aliases: ["glink", "ulink"],
    permission: 0,
    prefix: true,
    description: "Upload replied image or GIF to server and get direct link.",
    category: "Tools",
    usages: ["getlink (reply to image/GIF)"],
    credit: "Developed by Mohammad Nayan",
  },

  start: async ({ event, api }) => {
    const { message } = event;

    try {
      const ctx = message?.message?.extendedTextMessage?.contextInfo;
      if (!ctx || !ctx.quotedMessage) {
        return api.sendMessage(
          event.threadId,
          { text: "⚠️ Please reply to an *image* or *GIF* to upload." },
          { quoted: message }
        );
      }

      const quoted = ctx.quotedMessage;

      // Check media type
      let mediaType = null;
      if (quoted.imageMessage) mediaType = "image";
      else if (quoted.videoMessage && quoted.videoMessage.gifPlayback)
        mediaType = "gif";
      else if (quoted.videoMessage || quoted.audioMessage) {
        return api.sendMessage(
          event.threadId,
          {
            text:
              "⚠️ Upload for *video & audio* is not supported yet.\n📌 These formats will be added very soon!",
          },
          { quoted: message }
        );
      } else {
        return api.sendMessage(
          event.threadId,
          { text: "⚠️ Unsupported media type." },
          { quoted: message }
        );
      }

      // Download media buffer
      const buffer = await downloadMediaMessage(
        { message: quoted },
        "buffer",
        {},
        {
          reuploadRequest: api.updateMediaMessage,
        }
      );

      // Save temp file
      const tempPath = path.join(
        __dirname,
        `temp_${Date.now()}.${mediaType === "gif" ? "gif" : "jpg"}`
      );

      fs.writeFileSync(tempPath, buffer);

      // Upload to API
      const form = new (require("form-data"))();
      form.append("image", fs.createReadStream(tempPath));

      const response = await axios.post(
        "http://65.109.80.126:20732/nayan/postimage",
        form,
        { headers: form.getHeaders() }
      );

      // Auto delete temp file
      fs.unlinkSync(tempPath);

      // Send uploaded URL
      return api.sendMessage(
        event.threadId,
        {
          text: `✅ *Upload Successful!*\n\n🔗 *Direct Link:*\n${response.data?.url || response.data}`,
        },
        { quoted: message }
      );
    } catch (err) {
      console.error("getlink error:", err);

      return api.sendMessage(
        event.threadId,
        {
          text: "❌ Failed to upload image. Please try again later.",
        },
        { quoted: message }
      );
    }
  },
};
