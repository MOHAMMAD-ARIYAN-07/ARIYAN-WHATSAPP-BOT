const isAdmin = global.isAdmin
module.exports = {
  config: {
    name: "lock",
    aliases: ["lockMedia", "mLock"],
    permission: 2,
    prefix: 'both',
    categorie: "Moderation",
    credit: "Developed by Mohammad Nayan",
    usages: [
      "/lock sticker - Enable sticker lock",
      "/lock all - Enable all media lock",
      "/lock off - Disable lock"
    ]
  },

  state: {
    lockedGroups: {} 
  },

  start: async ({ event, api, args }) => {
    const { threadId, senderId, mentions, message} = event;
    const { isSenderAdmin, isBotAdmin } = await isAdmin(api, threadId, senderId);

    if (!isBotAdmin) {
      await api.sendMessage(threadId, { text: 'Please make the bot an admin first.' });
      return;
    }

    if (!isSenderAdmin) {
      await api.sendMessage(threadId, { text: 'Only group admins can use the kick command.' });
      return;
    }

    if (!args[0]) return await api.sendMessage(threadId, { text: "Usage:\nlock sticker | all | off" });

    const option = args[0].toLowerCase();

    if (option === "off") {
      delete module.exports.state.lockedGroups[threadId];
      await api.sendMessage(threadId, { text: "🔓 Lock disabled! Users can send media freely." });
      return;
    }

    if (option === "sticker" || option === "all") {
      module.exports.state.lockedGroups[threadId] = { type: option, count: {} };
      await api.sendMessage(threadId, { text: `🔒 ${option === "all" ? "All media" : "Sticker"} lock ENABLED! 3+ ${option === "all" ? "media" : "stickers"} => kick.` });
      return;
    }

    await api.sendMessage(threadId, { text: "❌ Invalid option! Use: sticker | all | off" });
  },

  event: async ({ event, api }) => {
  const { threadId, senderId, message, isGroup} = event;
    if (!isGroup) return;
  const msg = event.message.message;

    const { isSenderAdmin, isBotAdmin } = await isAdmin(api, threadId, senderId);

    if (isSenderAdmin) return;
    

   

  if (!threadId.endsWith("@g.us")) return;

  const locked = module.exports.state.lockedGroups[threadId];
  if (!locked) return;

  
  let msgType = null;
  if (msg.stickerMessage) msgType = "stickerMessage";
  else if (msg.imageMessage) msgType = "imageMessage";
  else if (msg.videoMessage) msgType = "videoMessage";
  else if (msg.gifMessage) msgType = "gifMessage";

    

  if (!msgType) return;

  const mediaTypes = locked.type === "all"
    ? ["stickerMessage", "imageMessage", "videoMessage", "gifMessage"]
    : ["stickerMessage"];

  if (!mediaTypes.includes(msgType)) return;

  
  if (!locked.count[senderId]) locked.count[senderId] = 0;
  locked.count[senderId]++;

  
  if (locked.count[senderId] === 1) {
    await api.sendMessage(threadId, { text: `⚠️ @${senderId.split("@")[0]}, Media is locked! Sending more than 3 times will result in a kick.` });
  }

  
  try {
    const quotedMessageId = message.key.id;
    const quotedParticipant = message.key.participant || senderId;


    await api.sendMessage(threadId, {
      delete: { remoteJid: threadId, fromMe: false, id: quotedMessageId, participant: quotedParticipant },
    });
  } catch (err) {
    console.error("Failed to delete media:", err);
  }

  
  if (locked.count[senderId] > 3) {
    try {
      await await api.groupParticipantsUpdate(threadId, [senderId], 'remove');
      await api.sendMessage(threadId, { text: `🚨 @${senderId.split("@")[0]} kicked for sending too many ${locked.type === "all" ? "media" : "stickers"}` });
      console.log(`🚨 User ${senderId} kicked`);
    } catch (err) {
      console.error("Failed to kick user:", err);
    }
  }
}
};
