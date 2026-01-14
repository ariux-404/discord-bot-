module.exports = {
  data: {
    name: 'afk',
    description: 'Set yourself as AFK',
  },
  async execute(message, args, client) {
    const reason = args.length > 0 ? args.join(' ') : 'Away from keyboard';
    const userId = message.author.id;
    const channelId = message.channelId;

    // Initialize afkUsers collection if it doesn't exist
    if (!client.afkUsers) {
      client.afkUsers = new Map();
    }

    // Check if user is already AFK
    if (client.afkUsers.has(userId)) {
      return message.reply({
        content: `You are already AFK. Use -back to return.`,
      });
    }

    // Store AFK data
    client.afkUsers.set(userId, {
      reason,
      startTime: Date.now(),
      channelId,
    });

    message.reply({
      content: `${message.author.username} is now away from keyboard.\nReason: ${reason}`,
    });
  },
};
