const dataFile = "grpRules.json";

module.exports = {
  config: {
    name: "rules",
    aliases: ["grouprules", "grules"],
    permission: 0,
    prefix: true,
    categorie: "Utility",
    credit: "Developed by Mohammad Nayan",
    description: "Shows or sets group rules.",
    usages: [
      `${global.config.PREFIX}rules - Shows current group rules.`,
      `${global.config.PREFIX}rules set - Sets new rules (admins only).`,
      `${global.config.PREFIX}rules remove - Remove group rules (admins only).`,
    ],
  },

  start: async ({ event, api, args }) => {
    const { threadId, isGroup, message, senderId } = event;

    const {isSenderAdmin} = await global.isAdmin(api, threadId, senderId);

    

    if (!isGroup) {
        await api.sendMessage(threadId, { text: "This command can only be used in a group." });
        return;
    }

    let rulesData = (await global.data.get(dataFile)) || {};

    
    if (!args[0]) {
      const groupRules = rulesData[threadId];
      return api.sendMessage(threadId, {
        text: `📜 *Group Rules*\n────────────────────\n${groupRules || "⚠️ No rules set yet."}`
      }, { quoted: message });
    }

    
    if (args[0].toLowerCase() === "remove") {
      if (!isSenderAdmin) return api.sendMessage(threadId, { text: "❌ Only admins can remove rules." }, { quoted: message });
      delete rulesData[threadId];
      await global.data.set(dataFile, rulesData);
      return api.sendMessage(threadId, { text: "🗑️ Group rules removed successfully." }, { quoted: message });
    }

    
    if (args[0].toLowerCase() === "set") {
      if (!isSenderAdmin) return api.sendMessage(threadId, { text: "❌ Only admins can set rules." }, { quoted: message });

      const sentMsg = await api.sendMessage(threadId, { text: "✏️ Please reply to this message with the rules you want to set for the group." }, { quoted: message });

      
      global.client.handleReply.push({
        type: "rulesSet",
        name: "rules",
        messageID: sentMsg.key.id,
        author: senderId,
      });
    }
  },

  handleReply: async ({ api, event, handleReply }) => {
    const { threadId, senderId, body, message } = event;

    if (senderId !== handleReply.author) return;

    let rulesData = (await global.data.get("grpRules.json")) || {};

    if (handleReply.type === "rulesSet") {
      const newRules = body.trim();
      if (!newRules) return api.sendMessage(threadId, { text: "❌ You didn't type any rules." }, { quoted: message });

      rulesData[threadId] = newRules;
      await global.data.set("grpRules.json", rulesData);

      await api.sendMessage(threadId, { text: `✅ Group rules updated successfully!\n\n${newRules}` }, { quoted: message });

      
      const index = global.client.handleReply.findIndex(h => h.messageID === handleReply.messageID);
      if (index !== -1) global.client.handleReply.splice(index, 1);
    }
  },
};
