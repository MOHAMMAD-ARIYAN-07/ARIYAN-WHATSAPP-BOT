const os = require('os');

module.exports = {
  config: {
    name: 'info',
    aliases: ['about', 'admininfo', 'serverinfo'],
    permission: 0,
    prefix: 'both',
    categorie: 'Utilities',
    credit: 'Developed by Mohammad Nayan',
    usages: [`${global.config.PREFIX}info - Show admin and server information.`],
  },
  start: async ({ event, api, message }) => {
    try {
      const uptimeSeconds = process.uptime();
      const uptime = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);

      const adminListText =
        global.config.admin.length > 0
          ? global.config.admin
              .map((id, i) => `${i + 1}. @${id.split('@')[0]}`)
              .join('\n')
          : 'No admins found.';

      const infoMessage = `
--------------------------------------------

╔══════════════════════════════════╗
       ✨ ＰＥＲＳＯＮＡＬ ＩＮＦＯ ✨
╚══════════════════════════════════╝
👤 𝙉𝙖𝙢𝙚        : 𝐒𝐓𝐑𝐈𝐊𝐄𝐑 𝐀𝐑𝐈𝐘𝐀𝐍
🎭 𝙉𝙞𝙘𝙠𝙣𝙖𝙢𝙚    : 𝐀𝐫𝐈𝐲𝐀𝐧-𝐁𝐇𝐀𝐈
🧑‍🦱 𝙂𝙚𝙣𝙙𝙚𝙧     : 𝑴𝒂𝒍𝒆  
🎂 𝘼𝙜𝙚         : 18+  

╔══════════════════════════════════╗
     🕌 ＲＥＬＩＧＩＯＮ ＆ ＲＥＬＡＴＩＯＮＳＨＩＰ 🕌
╚══════════════════════════════════╝
☪️ 𝙍𝙚𝙡𝙞𝙜𝙞𝙤𝙣   : 𝐈𝐬𝐥𝐚𝐦  
💔 𝙎𝙩𝙖𝙩𝙪𝙨     : 𝑺𝒊𝒏𝒈𝒍𝒆  

╔══════════════════════════════════╗
          📍 ＡＤＤＲＥＳＳ 📍
╚══════════════════════════════════╝
🏠 𝙋𝙚𝙧𝙢𝙖𝙣𝙚𝙣𝙩  : 𝐍𝐚𝐫𝐚𝐲𝐚𝐧𝐠𝐚𝐧𝐣
📌 𝘾𝙪𝙧𝙧𝙚𝙣𝙩    : 𝐀𝐫𝐚𝐢𝐡𝐚𝐳𝐚𝐫  

╔══════════════════════════════════╗
           💼 ＷＯＲＫ 💼
╚══════════════════════════════════╝
🌏 𝙅𝙤𝙗        :  𝐍𝐚𝐢

╔══════════════════════════════════╗
          📱 ＣＯＮＴＡＣＴＳ 📱
╚══════════════════════════════════╝
📧 𝙂𝙢𝙖𝙞𝙡      : 𝐚𝐫𝐢𝐲𝐚𝐧𝐢𝐬𝐥𝐚𝐦121382@𝐠𝐦𝐚𝐢𝐥.𝐜𝐨𝐦
💬 𝙒𝙝𝙖𝙩𝙨𝘼𝙥𝙥   : wa.me/+8801832852311
📨 𝙏𝙚𝙡𝙚𝙜𝙧𝙖𝙢   : t.me/@striker_ariyan  

╔══════════════════════════════════╗
          📘 ＦＡＣＥＢＯＯＫ 📘
╚══════════════════════════════════╝
🔹 𝙋𝙧𝙤𝙛𝙞𝙡𝙚 𝙉𝙖𝙢𝙚 : 
🔹 𝙋𝙧𝙤𝙛𝙞𝙡𝙚 𝙇𝙞𝙣𝙠 : 


--------------------------------------------
\`\`\`
🖥️ Server Info:
• Platform       : ${os.platform()}
• CPU            : ${os.cpus()[0].model}
• Node.js Version: ${process.version}
• Uptime         : ${uptime}
• Total Memory   : ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB
• Free Memory    : ${(os.freemem() / (1024 ** 3)).toFixed(2)} GB
\`\`\``;

      await api.sendMessage(
            event.threadId,
            { image: { url: "https://i.postimg.cc/Gh9TDzCr/1774291668544.jpg" }, caption: infoMessage || '' },
            { quoted: event.message }
          );;
    } catch (error) {
      console.error(error);
      await api.sendMessage(event.threadId, '❌ An error occurred while fetching info.', { quoted: event.message });
    }
  },
};
