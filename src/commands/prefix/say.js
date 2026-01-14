module.exports = {
  data: {
    name: 'say',
    description: 'Make the bot send a message to the channel',
  },
  async execute(message, args, client) {
    try {
      // Check if message content is provided
      if (!args[0]) {
        return message.reply({
          content: 'Please provide a message.\nUsage: `-say <message>`',
        });
      }

      // Get the message content
      const msg = args.join(' ');

      // Send the message to the channel
      await message.channel.send(msg);

      // Delete the command message
      await message.delete();
    } catch (error) {
      console.error('Error executing say command:', error);
      message.reply({
        content: 'There was an error sending the message.',
      });
    }
  },
};
