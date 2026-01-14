module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
    
    const guildId = '1460285787923939481';
    
    const updatePresence = async () => {
      try {
        const guild = await client.guilds.fetch(guildId);
        const memberCount = guild.memberCount;
        client.user.setActivity(`${memberCount} members`, { type: 'WATCHING' });
      } catch (error) {
        console.error('Error updating presence:', error);
        client.user.setActivity('members', { type: 'WATCHING' });
      }
    };

    // Set presence on startup
    updatePresence();

    // Update presence every 5 minutes
    setInterval(updatePresence, 5 * 60 * 1000);
  },
};
