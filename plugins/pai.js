const axios = require("axios");

module.exports = {
  config: {
    name: "pai",
    aliases: ["ai2"],
    permission: 0,
    prefix: true,
    categorie: "AI Chat",
    cooldowns: 5,
    credit: "Developed by Mohammad Nayan",
    usages: [
      `${global.config.PREFIX}pai <message> - Chat with Pai AI`,
      `${global.config.PREFIX}pai - Get a default reply`,
    ],
    description: "Chat with Pai AI bot!",
  },

  start: async function ({ api, event, args }) {
    const { threadId, message, senderId } = event;
    const usermsg = args.join(" ");

    if (!usermsg) {
      return api.sendMessage(
        threadId,
        {
          text: "Please enter a message to chat with the AI.",
        },
        { quoted: message }
      );
    }

    try {
      const response = await axios.get(
        `https://nayan-ai-online.vercel.app/nayan/pai?number=${senderId.split("@")[0]}&question=${encodeURIComponent(usermsg)}`
      );

      const replyText =
        response.data?.answer || "I'm not sure how to respond.";

      const sent = await api.sendMessage(
        threadId,
        { text: replyText },
        { quoted: message }
      );

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat",
      });
    } catch (err) {
      console.error("❌ Pai command error:", err);
      return api.sendMessage(
        threadId,
        { text: "❌ Failed to get response from AI API." },
        { quoted: message }
      );
    }
  },

  handleReply: async function ({ api, event }) {
    const { threadId, message, body, senderId } = event;

    try {
      const response = await axios.get(
        `https://nayan-ai-online.vercel.app/nayan/pai?number=${senderId.split("@")[0]}&question=${encodeURIComponent(body)}`
      );

      const replyText =
        response.data?.answer || "I'm not sure how to respond.";

      const sent = await api.sendMessage(
        threadId,
        { text: replyText },
        { quoted: message }
      );

      global.client.handleReply.push({
        name: "pai",
        author: senderId,
        messageID: sent.key.id,
        type: "chat",
      });
    } catch (err) {
      console.error("❌ Pai handleReply error:", err);
      return api.sendMessage(
        threadId,
        { text: "❌ Failed to continue the conversation." },
        { quoted: message }
      );
    }
  },
};
