const { Client, Collection, GatewayIntentBits, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Collections for commands
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

// Prefix configuration
client.prefix = process.env.PREFIX || '!';

// Load Prefix Commands
const loadPrefixCommands = () => {
  const commandsPath = path.join(__dirname, 'commands', 'prefix');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if (command.data && command.execute) {
      client.prefixCommands.set(command.data.name, command);
      console.log(`✅ Loaded prefix command: ${command.data.name}`);
    }
  }
};

// Load Slash Commands
const loadSlashCommands = () => {
  const commandsPath = path.join(__dirname, 'commands', 'slash');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if (command.data && command.execute) {
      client.slashCommands.set(command.data.name, command);
      console.log(`✅ Loaded slash command: ${command.data.name}`);
    }
  }
};

// Load Events
const loadEvents = () => {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.name && event.execute) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
      console.log(`✅ Loaded event: ${event.name}`);
    }
  }
};

// Load all commands and events
loadPrefixCommands();
loadSlashCommands();
loadEvents();

// Dynamic command reloading (watching for file changes) - disabled in production
// to avoid EMFILE errors
const watchCommands = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('File watching disabled in production');
    return;
  }

  const prefixPath = path.join(__dirname, 'commands', 'prefix');
  const slashPath = path.join(__dirname, 'commands', 'slash');

  try {
    const prefixWatcher = fs.watch(prefixPath, { persistent: false }, (eventType, filename) => {
      if (eventType === 'change' && filename.endsWith('.js')) {
        try {
          const filePath = path.join(prefixPath, filename);
          delete require.cache[require.resolve(filePath)];
          const command = require(filePath);
          client.prefixCommands.set(command.data.name, command);
          console.log(`Reloaded prefix command: ${command.data.name}`);
        } catch (error) {
          console.error(`Error reloading prefix command: ${error}`);
        }
      }
    });

    const slashWatcher = fs.watch(slashPath, { persistent: false }, (eventType, filename) => {
      if (eventType === 'change' && filename.endsWith('.js')) {
        try {
          const filePath = path.join(slashPath, filename);
          delete require.cache[require.resolve(filePath)];
          const command = require(filePath);
          client.slashCommands.set(command.data.name, command);
          console.log(`Reloaded slash command: ${command.data.name}`);
        } catch (error) {
          console.error(`Error reloading slash command: ${error}`);
        }
      }
    });

    prefixWatcher.on('error', (error) => {
      console.error('Prefix watcher error:', error.code);
      prefixWatcher.close();
    });

    slashWatcher.on('error', (error) => {
      console.error('Slash watcher error:', error.code);
      slashWatcher.close();
    });
  } catch (error) {
    console.error('Error setting up file watchers:', error.code);
  }
};

watchCommands();

client.login(process.env.TOKEN);
