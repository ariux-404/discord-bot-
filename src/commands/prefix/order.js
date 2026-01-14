const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'order',
    description: 'Create a custom order',
  },
  async execute(message, args, client) {
    try {
      // Create the embed
      const embed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle('Create Your Order')
        .setDescription(
          'You are on the right server to place your order.\n\n' +
          'Please choose what you want to order from the dropdown menu below to get started.'
        );

      // Create the dropdown menu
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('order_type_select')
        .setPlaceholder('Select your order type')
        .addOptions([
          {
            label: 'Discord Bot',
            value: 'discord_bot',
            description: 'Order a custom Discord bot',
          },
          {
            label: 'Banner',
            value: 'banner',
            description: 'Order a custom banner',
          },
        ]);

      const row = new ActionRowBuilder().addComponents(selectMenu);

      // Send the message
      await message.reply({
        embeds: [embed],
        components: [row],
      });
    } catch (error) {
      console.error('Error executing order command:', error);
      message.reply({
        content: 'There was an error processing your order.',
      });
    }
  },
};
