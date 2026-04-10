
module.exports = {
  config: {
    name: "prefix",
    aliases: ["currentprefix"],
    permission: 0,
    prefix: "both",
    categorie: "Utility",
    credit: "Developed by Mohammad Nayan",
    description: "Displays or sets the bot's prefix.",
    usages: [
      `${global.config.PREFIX}prefix - Shows the current bot prefix.`,
      `${global.config.PREFIX}prefix set <symbol> - Sets a custom prefix for this group.`,
    ],
  },

  start: async ({ event, api, args }) => {
    const threadId = event.threadId;
    const { isGroup, message, isSenderBotadmin} = event;

    const dataFile = "grpPrefix.json";


    let prefixes = (await global.data.get(dataFile)) || {};


    if (!args[0]) {
      const globalPrefix = global.config.PREFIX;
      const groupPrefix = prefixes[threadId];

      if (isGroup) {
        return api.sendMessage(
          threadId,
          {
            text:
              `🔰 Prefix Information:\n\n` +
              `🌍 Global Prefix: \`${globalPrefix}\`\n` +
              `👥 Group Prefix: \`${groupPrefix || "Not set (using global)"}\``,
          },
          { quoted: message }
        );
      } else {
        return api.sendMessage(
          threadId,
          {
            text: `🌍 My current prefix is: \`${globalPrefix}\``,
          },
          { quoted: message }
        );
      }
    }


    if (args[0].toLowerCase() === "set") {
      if (!isGroup) {
        return api.sendMessage(
          threadId,
          {
            text: "❌ This command can only be used in groups.",
          },
          { quoted: message }
        );
      }
      if (!isSenderBotadmin) {
        await api.sendMessage(threadId, { text: `Only admins can use the ${global.config.PREFIX}admin add.` }, { quoted: message });
        return;
      }
      if (!args[1]) {
        return api.sendMessage(
          threadId,
          {
            text: "❌ Please provide a prefix to set.\n👉 Example: /prefix set .",
          },
          { quoted: message }
        );
      }

      const newPrefix = args[1];
      prefixes[threadId] = newPrefix;

      await global.data.set(dataFile, prefixes);

      return api.sendMessage(threadId, {
        text: `✅ Prefix updated for this group.\n👉 New Prefix: \`${newPrefix}\``,
      }, { quoted: message });
    }
  },
};
