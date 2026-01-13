module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
    client.user.setActivity('commands help', { type: 'LISTENING' });
  },
};
