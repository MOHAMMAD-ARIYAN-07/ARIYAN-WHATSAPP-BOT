const fs = require("fs");
const path = require("path");

const dataDir = path.join(process.cwd(), "plugins", "data");

const badFile = path.join(dataDir, "badwords.json");
const warnFile = path.join(dataDir, "warnings.json");
const toggleFile = path.join(dataDir, "antibad_toggle.json");


function ensure() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(badFile)) fs.writeFileSync(badFile, "[]");
  if (!fs.existsSync(warnFile)) fs.writeFileSync(warnFile, "{}");
  if (!fs.existsSync(toggleFile)) fs.writeFileSync(toggleFile, "{}");
}


const loadBad = () => JSON.parse(fs.readFileSync(badFile));
const saveBad = (data) =>
  fs.writeFileSync(badFile, JSON.stringify(data, null, 2));

const loadWarn = () => JSON.parse(fs.readFileSync(warnFile));
const saveWarn = (data) =>
  fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));

const loadToggle = () => JSON.parse(fs.readFileSync(toggleFile));
const saveToggle = (data) =>
  fs.writeFileSync(toggleFile, JSON.stringify(data, null, 2));


module.exports = {
  config: {
    name: "antibadwords",
    aliases: ["abw", "badwords"],
    prefix: true,
    permission: 2,
    categorie: "Group",
    credit: "Mohammad Nayan"
  },


  event: async function ({ api, event }) {
    try {
      ensure();

      const isAdmin = global.isAdmin



      const { threadId, message, senderId, isGroup} = event;

      if (!isGroup) return;

      const { isSenderAdmin } = await isAdmin(api, threadId, senderId);

      if (isSenderAdmin) return;

      const msg = event.message?.message;
      if (!msg) return;

      const text =
        msg?.conversation ||
        msg?.extendedTextMessage?.text ||
        "";

      if (!text) return;

      const badWords = loadBad();
      const warnings = loadWarn();
      const toggle = loadToggle();

      if (toggle[threadId] === false) return;

      const words = text.toLowerCase().split(/\s+/);

      

      const isBad = words.some(w => badWords.includes(w));
      if (!isBad) return;

      if (!warnings[senderId]) warnings[senderId] = 0;

      warnings[senderId]++;
      saveWarn(warnings);

      const count = warnings[senderId];


      try {
        await api.sendMessage(threadId, {
          delete: message.key
        });
      } catch {}

      if (count < 3) {
        return api.sendMessage(threadId, {
          text: `⚠️ Warning ${count}/3\n@${senderId.split("@")[0]}`,
          mentions: [senderId]
        }, { quoted: message });
      }

      if (count === 3) {
        return api.sendMessage(threadId, {
          text: `🚨 Final Warning!\n@${senderId.split("@")[0]}`,
          mentions: [senderId]
        }, { quoted: message });
      }

      if (count > 3) {
        await api.groupParticipantsUpdate(threadId, [senderId], "remove");

        delete warnings[senderId];
        saveWarn(warnings);

        return api.sendMessage(threadId, {
          text: `👢 Kicked:\n@${senderId.split("@")[0]}`,
          mentions: [senderId]
        });
      }

    } catch (err) {
      console.error(err);
    }
  },


  start: async function ({ api, event, args }) {
    ensure();

    const { threadId, message } = event;
    const cmd = args[0];
    const word = args.slice(1).join(" ").toLowerCase();

    let badWords = loadBad();
    const toggle = loadToggle();
    const warnings = loadWarn();


    if (cmd === "add") {
      if (!word) {
        return api.sendMessage(threadId, {
          text: "❌ Please provide a word to add"
        }, { quoted: message });
      }

      if (badWords.includes(word)) {
        return api.sendMessage(threadId, {
          text: "⚠️ Word already exists"
        }, { quoted: message });
      }

      badWords.push(word);
      saveBad(badWords);

      return api.sendMessage(threadId, {
        text: `✅ Added bad word: ${word}`
      }, { quoted: message });
    }


    if (cmd === "remove") {
      if (!word) {
        return api.sendMessage(threadId, {
          text: "❌ Please provide a word to remove"
        }, { quoted: message });
      }

      badWords = badWords.filter(w => w !== word);
      saveBad(badWords);

      return api.sendMessage(threadId, {
        text: `🗑️ Removed bad word: ${word}`
      }, { quoted: message });
    }


    if (cmd === "list") {
      return api.sendMessage(threadId, {
        text: `📛 Bad Words List:\n\n${badWords.join(", ") || "Empty"}`
      }, { quoted: message });
    }


    if (cmd === "on") {
      toggle[threadId] = true;
      saveToggle(toggle);

      return api.sendMessage(threadId, {
        text: "✅ AntiBadWords ENABLED"
      }, { quoted: message });
    }


    if (cmd === "off") {
      toggle[threadId] = false;
      saveToggle(toggle);

      return api.sendMessage(threadId, {
        text: "❌ AntiBadWords DISABLED"
      }, { quoted: message });
    }


    const status = toggle[threadId] === false ? "OFF ❌" : "ON ✅";

    return api.sendMessage(threadId, {
      text: `
╔════════════════════╗
║ ⚙️ ANTI BADWORDS
╠════════════════════╣
║ 📊 Status: ${status}
║ 📛 Bad Words: ${badWords.length}
║ 👥 Warned Users: ${Object.keys(warnings).length}
╚════════════════════╝

Sub Commands:
${global.config.PREFIX}${this.config.name} add <word>
${global.config.PREFIX}${this.config.name} remove <word>
${global.config.PREFIX}${this.config.name} list
${global.config.PREFIX}${this.config.name} on / .off
      `
    }, { quoted: message });
  }
};
