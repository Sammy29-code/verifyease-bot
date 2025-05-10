import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs-extra';

const configPath = './data/config.json';

export default {
  data: new SlashCommandBuilder()
    .setName('resetsetup')
    .setDescription('Reset semua pengaturan bot verifikasi')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await fs.writeJSON(configPath, {}, { spaces: 2 });
    await interaction.reply('🔁 Semua pengaturan berhasil direset.');
  }
};
