import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('verifikasiyuk')
    .setDescription('Kirim pesan awal verifikasi dengan tombol form verifikasi'),

  async execute(interaction) {
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('start_verification')
        .setLabel('✅ Verifikasi Yuk')
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setTitle('Form Verifikasi Data Diri')
      .setDescription(
        `Untuk bergabung dan mendapatkan akses penuh, kamu perlu mengisi data diri dengan benar.\n\nKlik tombol **Verifikasi Yuk** di bawah ini untuk mengisi form ya!`
      )
      .setColor(0x5865f2)
      .setFooter({ text: 'LevelPro Verification Bot' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], components: [button] });
  }
};
