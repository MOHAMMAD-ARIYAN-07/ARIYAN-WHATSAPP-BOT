const fs = require("fs");
const path = require("path");
const os = require("os");


function getFolderSize(folderPath) {
  let totalSize = 0;

  function calculate(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        calculate(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  }

  calculate(folderPath);
  return totalSize;
}


function getCacheSize() {
  const cachePath = path.join(process.cwd(), "plugins", "cache");

  if (!fs.existsSync(cachePath)) return 0;

  return getFolderSize(cachePath);
}

module.exports = {
  config: {
    name: 'ping',
    aliases: ['p'],
    permission: 0,
    prefix: 'both',
    categories: 'system',
    description: 'Check bot response time',
    credit: "Mohammad Nayan"
  },

  start: async ({ event, api }) => {
    const { threadId, message } = event;

    const start = Date.now();

    

    const ping = Date.now() - start;

    
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

    
    const rootSize = getFolderSize(process.cwd());
    const cacheSize = getCacheSize();

    const rootMB = (rootSize / 1024 / 1024).toFixed(2);
    const cacheMB = (cacheSize / 1024 / 1024).toFixed(2);

    
    let status = "🚀 SUPER FAST";
    if (ping > 500) status = "🐢 SLOW";
    else if (ping > 200) status = "⚠️ NORMAL";

    const box = `
╔══════════════════════╗
║     🏓 SYSTEM PING    ║
╠══════════════════════╣
║ ⚡ Ping: ${ping}ms
║ 📊 Status: ${status}
║ 🧠 RAM: ${freeMem}/${totalMem} GB
║ 📦 Project: ${rootMB} MB
║ 🗂️ Cache: ${cacheMB} MB
╚══════════════════════╝
`;

    await api.sendMessage(
      threadId,
      { text: box },
      { quoted: message }
    );
  }
};
