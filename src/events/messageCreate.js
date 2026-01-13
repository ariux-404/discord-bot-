module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;

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
        content: '❌ There was an error executing this command.',
        ephemeral: true,
      }).catch(console.error);
    }
  },
};
