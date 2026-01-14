module.exports = {
  data: {
    name: 'purge',
    description: 'Delete messages from the channel',
  },
  async execute(message, args, client) {
    try {
      // Check if amount is provided
      if (!args[0]) {
        return message.reply({
          content: 'Please specify the number of messages to delete.\nUsage: `-purge <amount>`',
        });
      }

      const amount = parseInt(args[0]);

      // Validate amount
      if (isNaN(amount)) {
        return message.reply({
          content: 'Please provide a valid number.',
        });
      }

      if (amount < 1 || amount > 100) {
        return message.reply({
          content: 'You can only delete between 1 and 100 messages at a time.',
        });
      }

      // Check permissions
      if (!message.member.permissions.has('ManageMessages')) {
        return message.reply({
          content: 'You do not have permission to manage messages.',
        });
      }

      if (!message.guild.members.me.permissions.has('ManageMessages')) {
        return message.reply({
          content: 'I do not have permission to manage messages.',
        });
      }

      // Delete messages (amount + 1 to include the command message)
      const deleted = await message.channel.bulkDelete(amount + 1, true);

      // Send confirmation message as a new message (not a reply)
      const confirmMessage = await message.channel.send({
        content: `Successfully deleted **${deleted.size - 1}** message(s).`,
      });

      // Auto-delete confirmation after 5 seconds
      setTimeout(() => {
        confirmMessage.delete().catch(() => {});
      }, 5000);
    } catch (error) {
      console.error('Error executing purge command:', error);
      message.reply({
        content: 'There was an error deleting messages.',
      });
    }
  },
};
