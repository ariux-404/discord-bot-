module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Initialize afkUsers collection if it doesn't exist
    if (!client.afkUsers) {
      client.afkUsers = new Map();
    }

    // Check if author is AFK
    if (client.afkUsers.has(message.author.id)) {
      const afkData = client.afkUsers.get(message.author.id);
      const duration = calculateDuration(Date.now() - afkData.startTime);

      // Remove from AFK when they post a message
      client.afkUsers.delete(message.author.id);

      message.reply({
        content: `${message.author.username} is back. Away for ${duration}.`,
      }).catch(console.error);
    }

    // Check if message starts with prefix
    if (!message.content.startsWith(client.prefix)) return;

    // Extract command and arguments
    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Get command from collection
    const command = client.prefixCommands.get(commandName);

    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(`❌ Error executing prefix command ${commandName}:`, error);
      message.reply({
        content: 'There was an error executing this command.',
        ephemeral: true,
      }).catch(console.error);
    }
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
