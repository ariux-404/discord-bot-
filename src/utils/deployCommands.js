const fs = require('fs');
const path = require('path');
const { REST } = require('discord.js');
const { Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, '..', 'commands', 'slash');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.data) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // For global commands (takes up to 1 hour to refresh)
    // await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    // For guild commands (instant refresh - use for testing)
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });

    console.log(`Successfully reloaded ${commands.length} application (/) commands in guild ${process.env.GUILD_ID}.`);
  } catch (error) {
    console.error(error);
  }
})();
