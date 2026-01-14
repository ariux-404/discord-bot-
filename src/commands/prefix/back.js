module.exports = {
  data: {
    name: 'back',
    description: 'Mark yourself as back from AFK',
  },
  async execute(message, args, client) {
    const userId = message.author.id;

    // Initialize afkUsers collection if it doesn't exist
    if (!client.afkUsers) {
      client.afkUsers = new Map();
    }

    // Check if user is AFK
    if (!client.afkUsers.has(userId)) {
      return message.reply({
        content: 'You are not AFK.',
      });
    }

    const afkData = client.afkUsers.get(userId);
    const duration = calculateDuration(Date.now() - afkData.startTime);

    // Remove from AFK
    client.afkUsers.delete(userId);

    message.reply({
      content: `${message.author.username} You was  Away for ${duration}.`,
    });
  },
};

function calculateDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
