export default {
  name: 'ready',
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);
  }
};
