const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('review')
    .setDescription('Submit a review for a product or designer'),
  async execute(interaction, client) {
    try {
      // Create designer selection menu
      const designerSelect = new StringSelectMenuBuilder()
        .setCustomId('review_designer_select')
        .setPlaceholder('Select a designer')
        .addOptions([
          {
            label: 'ariu.x',
            value: '1457331661992759323',
            description: 'Review ariu.x',
          },
          {
            label: 'nikcreates_',
            value: '1347129007321387068',
            description: 'Review nikcreates_',
          },
        ]);

      const designerRow = new ActionRowBuilder().addComponents(designerSelect);

      // Create product selection menu
      const productSelect = new StringSelectMenuBuilder()
        .setCustomId('review_product_select')
        .setPlaceholder('Select a product')
        .addOptions([
          {
            label: 'Discord Bot',
            value: 'discord_bot',
            description: 'Review a Discord Bot',
          },
          {
            label: 'Banner',
            value: 'banner',
            description: 'Review a Banner',
          },
        ]);

      const productRow = new ActionRowBuilder().addComponents(productSelect);

      // Send the selection menus
      await interaction.reply({
        content: 'Review Submission\n\nStep 1: Select a designer',
        components: [designerRow],
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error executing review command:', error);
      interaction.reply({
        content: 'There was an error opening the review form.',
        ephemeral: true,
      });
    }
  },
};
