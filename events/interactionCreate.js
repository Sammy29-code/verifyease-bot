import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder
} from 'discord.js';
import fs from 'fs-extra';

const configPath = './data/config.json';

export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
        await interaction.reply({ content: '❌ Terjadi kesalahan saat menjalankan command.', ephemeral: true });
      }
    }

    // Handle Tombol Verifikasi
    if (interaction.isButton() && interaction.customId === 'start_verification') {
      const modal = new ModalBuilder()
        .setCustomId('form_verifikasi')
        .setTitle('Form Verifikasi Member')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('nama')
              .setLabel('Nama Panggilan')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('umur')
              .setLabel('Umur kamu')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('season')
              .setLabel('Season Pertama')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('alasan')
              .setLabel('Alasan gabung')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          )
        );

      await interaction.showModal(modal);
    }

    // Handle Submit Modal
    if (interaction.isModalSubmit() && interaction.customId === 'form_verifikasi') {
      await interaction.deferReply({ ephemeral: true });

      const nama = interaction.fields.getTextInputValue('nama');
      const umur = interaction.fields.getTextInputValue('umur');
      const season = interaction.fields.getTextInputValue('season');
      const alasan = interaction.fields.getTextInputValue('alasan');

      const avatar = interaction.user.displayAvatarURL();
      const config = fs.readJSONSync(configPath, { throws: false }) || {};
      const roleId = config.roleId || null;
      const logChannelId = config.logChannelId || null;

      const embed = new EmbedBuilder()
        .setDescription(`## Verifikasi Member\nHello! 👋 <@${interaction.user.id}>\nBerikut data verifikasi kamu!`)
        .setThumbnail(avatar)
        .addFields(
          { name: '• Nama Panggilan :', value: nama },
          { name: '• Umur kamu :', value: umur },
          { name: '• Season Pertama :', value: season },
          { name: '• Alasan gabung :', value: alasan }
        )
        .addFields({ name: '🎉 THANK YOU 🎉', value: 'Welcome and enjoy your stay!' })
        .setImage('https://media.discordapp.net/attachments/920108348706258947/1334218781630791734/banner_lighbearers_exp.jpg')
        .setFooter({ text: `Member ID : ${interaction.user.id}`, iconURL: avatar })
        .setTimestamp();

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('start_verification')
          .setLabel('✅ Verifikasi Yuk')
          .setStyle(ButtonStyle.Primary)
      );

      // Kirim embed ke channel log
      if (logChannelId) {
        const channel = await interaction.guild.channels.fetch(logChannelId);
        if (channel) {
          await channel.send({ embeds: [embed], components: [button] });
        }
      }

      // Tambahkan role ke member
      if (roleId) {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        await member.roles.add(roleId).catch(console.error);
      }

      await interaction.editReply({ content: '✅ Data berhasil dikirim dan role ditambahkan!' });
    }
  }
};
