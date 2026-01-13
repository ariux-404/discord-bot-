module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`❌ Error executing slash command ${interaction.commandName}:`, error);
        interaction.reply({
          content: '❌ There was an error executing this command.',
          ephemeral: true,
        }).catch(console.error);
      }
    }
  },
};
