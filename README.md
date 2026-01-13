# Discord Bot

A fully featured Discord.js bot with automatic command loading, prefix commands, and slash commands.

## Features

✅ **Auto-Loading Commands** - Commands automatically load from folders and reload on file changes  
✅ **Prefix Commands** - Traditional `!command` style commands  
✅ **Slash Commands** - Modern `/command` interactions  
✅ **Event Handlers** - Organized event handling with auto-loading  
✅ **Hot Reload** - Commands update automatically when you save  
✅ **Easy Setup** - Simple folder structure for adding new commands  

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` File
Create a `.env` file in the root directory:
```
TOKEN=your_bot_token_here
PREFIX=!
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

### 3. Get Your Bot Token
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" and click "Add Bot"
4. Copy the token and paste it in `.env`

### 4. Get Client ID
- Copy your Application ID from the "General Information" tab

### 5. Get Guild ID (Server ID)
- Enable Developer Mode in Discord
- Right-click your server and copy Server ID

## Running the Bot

### Start the bot:
```bash
npm start
```

### Development mode:
```bash
npm run dev
```

## Creating Commands

### Prefix Command Template
Create a new file in `src/commands/prefix/` (e.g., `hello.js`):

```javascript
module.exports = {
  data: {
    name: 'hello',
    description: 'Says hello!',
  },
  async execute(message, args, client) {
    message.reply(`👋 Hello ${message.author.username}!`);
  },
};
```

**Usage:** `!hello`

---

### Slash Command Template
Create a new file in `src/commands/slash/` (e.g., `hello.js`):

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello!'),
  async execute(interaction, client) {
    await interaction.reply(`👋 Hello ${interaction.user.username}!`);
  },
};
```

**Usage:** `/hello`

---

### Prefix Command with Arguments
```javascript
module.exports = {
  data: {
    name: 'greet',
    description: 'Greet someone',
  },
  async execute(message, args, client) {
    const user = args.join(' ') || message.author.username;
    message.reply(`Hello, ${user}!`);
  },
};
```

**Usage:** `!greet John`

---

### Slash Command with Options
```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('greet')
    .setDescription('Greet someone')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Name to greet')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const name = interaction.options.getString('name');
    await interaction.reply(`Hello, ${name}!`);
  },
};
```

## Deploying Slash Commands

After creating slash commands, you need to deploy them:

1. Update your `.env` with `CLIENT_ID` and `GUILD_ID`
2. Uncomment the deployment code in `src/utils/deployCommands.js`
3. Run:
```bash
npm run deploy
```

## Project Structure

```
src/
├── bot.js                 # Main bot file with auto-loading
├── commands/
│   ├── prefix/           # Prefix commands (!command)
│   │   ├── ping.js
│   │   └── help.js
│   └── slash/            # Slash commands (/command)
│       ├── ping.js
│       └── hello.js
├── events/               # Event handlers
│   ├── ready.js
│   ├── messageCreate.js
│   └── interactionCreate.js
└── utils/
    └── deployCommands.js # Slash command deployer
```

## Adding Events

Create a new file in `src/events/` (e.g., `guildCreate.js`):

```javascript
module.exports = {
  name: 'guildCreate',
  once: false,
  async execute(guild, client) {
    console.log(`Bot joined guild: ${guild.name}`);
  },
};
```

## Useful Resources

- [Discord.js Documentation](https://discord.js.org)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord API Documentation](https://discord.com/developers/docs)

## Auto-Reload

Commands automatically reload when you save changes! No need to restart the bot. Just edit a command file and save it.

## Tips

- Use `!help` to see all prefix commands
- Prefix is configurable via `.env` (default: `!`)
- Slash commands are registered globally and appear instantly when deploying
- Commands are case-insensitive
- Add error handling to your commands for better user experience

## Troubleshooting

**Bot won't start:**
- Check your `.env` file has a valid TOKEN
- Make sure discord.js is installed: `npm install discord.js`

**Slash commands not showing:**
- Run `npm run deploy` to register commands
- Make sure CLIENT_ID and GUILD_ID are correct in `.env`

**Commands not loading:**
- Check file names don't have spaces
- Make sure files end with `.js`
- Check the console for errors

---

Happy coding! 🎉
