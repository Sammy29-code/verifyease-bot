import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs-extra';

const configPath = './data/config.json';

export default {
  data: new SlashCommandBuilder()
    .setName('setrole')
    .setDescription('Atur role yang diberikan setelah verifikasi')
    .addRoleOption(option =>
      option.setName('role').setDescription('Pilih role verifikasi').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const config = fs.readJSONSync(configPath, { throws: false }) || {};

    config.roleId = role.id;
    await fs.writeJSON(configPath, config, { spaces: 2 });

    await interaction.reply(`✅ Role verifikasi berhasil diatur ke: **${role.name}**`);
  }
};
