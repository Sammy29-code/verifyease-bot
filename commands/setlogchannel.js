import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import fs from 'fs-extra';

const configPath = './data/config.json';

export default {
  data: new SlashCommandBuilder()
    .setName('setlogchannel')
    .setDescription('Atur channel untuk log verifikasi member')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Pilih channel log')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const config = fs.readJSONSync(configPath, { throws: false }) || {};

    config.logChannelId = channel.id;
    await fs.writeJSON(configPath, config, { spaces: 2 });

    await interaction.reply(`📃 Channel log verifikasi berhasil diatur ke: ${channel}`);
  }
};
