const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'g',
    description: 'Send a giveaway embed to the giveaway channel',
  },
  async execute(message, args, client) {
    try {
      const giveawayChannelId = '1460329918620635167';
      const giveawayChannel = await message.guild.channels.fetch(giveawayChannelId);

      if (!giveawayChannel) {
        return message.reply({
          content: 'Giveaway channel not found.',
        });
      }

      // Create giveaway embed
      const giveawayEmbed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle('GIVEAWAY')
        .setDescription('React to the buttons below to enter the giveaway!\n\nWinners will be selected randomly.')
        .addFields(
          { name: 'Prize', value: 'TBD', inline: true },
          { name: 'Duration', value: 'TBD', inline: true },
          { name: 'Winners', value: 'TBD', inline: true }
        )
        .setFooter({ text: 'React with the button below to enter!' });

      // Create buttons
      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('giveaway_enter')
          .setLabel('Enter Giveaway')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('giveaway_leave')
          .setLabel('Leave Giveaway')
          .setStyle(ButtonStyle.Danger)
      );

      // Send giveaway message
      const giveawayMessage = await giveawayChannel.send({
        embeds: [giveawayEmbed],
        components: [buttonRow],
      });

      // Confirm to user
      await message.reply({
        content: `Giveaway sent to <#${giveawayChannelId}>`,
      });

      // Delete command message
      await message.delete().catch(() => {});
    } catch (error) {
      console.error('Error executing giveaway command:', error);
      message.reply({
        content: 'There was an error sending the giveaway.',
      });
    }
  },
};
