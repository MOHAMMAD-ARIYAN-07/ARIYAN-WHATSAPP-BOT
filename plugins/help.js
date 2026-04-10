const axios = require("axios");

module.exports = {
  config: {
    name: 'help',
    aliases: ['menu'],
    permission: 0,
    prefix: true,
    description: 'Show all available commands.',
    category: 'Utility',
    credit: 'Developed by Mohammad Nayan',
    usages: ['help', 'help [command name]'],
  },

  start: async ({ event, api, args, loadcmd }) => {
    const { threadId, getPrefix } = event;
    const getAllCommands = () => loadcmd.map((plugin) => plugin.config);
    const commands = getAllCommands();

    const prefix = await getPrefix(threadId)

    const globalPrefix = global.config.PREFIX;

    const mergedCategories = {
      "⚙️ System": ["Administration", "Admin", "Owner", "Bot Management", "System"],
      "🧠 AI & Chat": ["AI", "AI Chat"],
      "🎬 Media": ["Media", "Video", "Image"],
      "🧰 Utilities": ["Utility", "Utilities", "System"],
      "👥 Group": ["Group Management", "group"],
      "🎮 Fun": ["Fun", "Games", "greetings"],
      "🛰️ Tools": ["Tools", "Information"]
    };

    const categories = {};
    commands.forEach((cmd) => {
      let cat = cmd.category || cmd.categorie || cmd.categories || "📦 Uncategorized";
      for (const merged in mergedCategories) {
        if (mergedCategories[merged].includes(cat)) {
          cat = merged;
          break;
        }
      }
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    });

    // ───── SINGLE COMMAND INFO ─────
    if (args[0]) {
      const command = commands.find((cmd) => cmd.name.toLowerCase() === args[0].toLowerCase());
      if (command) {
        const infoText = `
╭─❖  𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢  ❖─╮
│ 🔹 Name: ${command.name}
│ 🔹 Aliases: ${command.aliases?.join(", ") || "None"}
│ 🔹 Version: ${command.version || "1.0.0"}
│ 🔹 Description: ${command.description || "No description"}
│ 🔹 Usage: ${command.usage || command.usages?.join("\n│   ") || "Not defined"}
│ 🔹 Permission: ${command.permission}
│ 🔹 Category: ${command.category || "Uncategorized"}
│ 🔹 Credits: ${command.credit || command.credits || "Mohammad Nayan"}
╰────────────────────╯`;
        await api.sendMessage(threadId, { text: infoText });
      } else {
        await api.sendMessage(threadId, { text: `⚠️ No command found named "${args[0]}".` });
      }
      return;
    }
    const pkg = global.pkg;

    const timezone = global.config.timeZone || "Asia/Dhaka";

    const now = new Date().toLocaleString("en-US", {
      timeZone: timezone,
      hour12: true,
    });

    const currentTime = new Date().toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    const currentDate = new Date().toLocaleDateString("en-US", {
      timeZone: timezone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    // ───── MAIN HELP MENU ─────
    let responseText = `
╭─❖  𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗠𝗘𝗡𝗨  ❖─╮
│ 💎 𝘽𝙤𝙩: ${global.config.botName || "EMon System"}
│ 👑 Owner: ${global.config.botOwner || "Mohammad Nayan"}
│ 🌍 Global Prefix: \`${globalPrefix}\`
│ 👥 Group Prefix: \`${prefix || "Not set (using global)"}\`
│ 🧩 Version: ${pkg.version}
│ 🕒 Time: ${currentTime}
│ 📅 Date: ${currentDate}
│ 🌐 Timezone: ${timezone}
│ 📜 Total Commands: ${commands.length}
│──────────────────────`;

    for (const category in categories) {
      const cmds = categories[category]
        .map(cmd => `│   ├─ ${prefix}${cmd.name}`)
        .join("\n");

      responseText += `\n│ ${category}\n${cmds}\n│──────────────────────`;
    }

    responseText += `
╰──────────────────────╯
✨ Power ARIYAN-BHAI`;
    try {
      const response = await axios.get(global.config.helpPic, { responseType: 'stream' });
      await api.sendMessage(threadId, {
        image: { stream: response.data },
        caption: responseText
      });
    } catch {
      await api.sendMessage(threadId, { text: responseText });
    }
  },
};
