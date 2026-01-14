module.exports = {
  data: {
    name: 'tax',
    description: 'Calculate tax amount (adds 30%)',
  },
  async execute(message, args, client) {
    try {
      const { EmbedBuilder } = require('discord.js');

      // Check if amount is provided
      if (!args[0]) {
        return message.reply({
          content: 'Please specify an amount.\nUsage: `-tax <amount>`',
        });
      }

      const amount = parseFloat(args[0]);

      // Validate amount
      if (isNaN(amount)) {
        return message.reply({
          content: 'Please provide a valid number.',
        });
      }

      if (amount <= 0) {
        return message.reply({
          content: 'Amount must be greater than 0.',
        });
      }

      // Calculate 30% tax
      const taxAmount = amount * 0.30;
      const totalAmount = amount + taxAmount;

      // Create embed
      const embed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle('Tax Calculator')
        .addFields(
          { name: 'Original Amount', value: `${amount}`, inline: true },
          { name: 'Tax (30%)', value: `${taxAmount}`, inline: true },
          { name: 'Total Amount', value: `${totalAmount}`, inline: true },
          { name: 'Robux to Sell', value: `**${totalAmount} Robux**`, inline: false }
        )
        .setFooter({ text: 'Sell the total amount to get your desired amount' });

      // Send result
      await message.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.error('Error executing tax command:', error);
      message.reply({
        content: 'There was an error calculating the tax.',
      });
    }
  },
};
