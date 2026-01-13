const {
  SlashCommandBuilder,
  EmbedBuilder,
  blockQuote,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows the bot latency.'),

  async execute(interaction) {
    const latency = Math.round(interaction.client.ws.ping);
    const apiLatency = Date.now() - interaction.createdTimestamp;

    // Build text first
    const quotedText = blockQuote(
      ` Niks Fried Chicken 
Bot Latency: ${latency}ms
API Latency: ${apiLatency}ms`
    );

    const embed = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Pong')
      .setDescription(quotedText)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

