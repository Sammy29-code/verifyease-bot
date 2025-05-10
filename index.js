import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

// Status presence
client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'VerifyEase 🚀', type: 0 }],
    status: 'online',
  });
});

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.data.name, command.default);
}

// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = await import(`./events/${file}`);
  client.on(event.default.name, (...args) => event.default.execute(...args, client));
}

client.login(process.env.TOKEN);
