const ms = require("ms");
const unix = require("unix-timestamp");
const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js')
const Channels = require("../models/channels")

module.exports = async (interaction, client) => {
    await interaction.deferReply({ephemeral: true})
    if (!interaction.member._roles.includes(client.config.adminRoleId)) return interaction.editReply({content: "> [🔴] :: **You dont have Permissons to Use this comamnd**"})
    const Channel = interaction.options.getChannel("channel");
    const Time = interaction.options.getString("time");
    const time = ms(Time)
    if (!time || time === void 0 || typeof time === "string") return interaction.editReply({content: "> 🔴 **Invalid time formate user (1d | 4d | 1w | 1m)**", ephemeral: true});
    const channelData = await Channels.findOne({channelId: Channel.id});
    if (!channelData) return interaction.deferReply({content: "> 🔴 **I cant Find This Channel**"});
    const embed = new EmbedBuilder()
    .setColor("Purple")
    .setDescription(`
      **روم خاصه جديده**

      **صاحب الروم**
      <@${channelData.userId}> (${channelData.userId})
     **الاداري**
      <@${interaction.user.id}> (${interaction.user.id})
      **تاريخ الانشاء**
      <t:${parseInt(channelData.createdAt)}:F>
      **تاريخ الانتهاء**
      <t:${parseInt( ((Date.now() + time) / 1/1000) ) }:R>

      ${Time} room
    `);
    const msg = await Channel.messages.fetch(channelData.messageId);
    await msg.edit({embeds: [embed]});
    channelData.locked = false;
    channelData.endsAt = parseInt(Date.now() + time);
    await channelData.save();
    Channel.permissionOverwrites.create(Channel.guild.roles.everyone, { ViewChannel: true });
    interaction.editReply({content: `> 🟢 **renew <#${Channel.id}> For ${Time}**`});
}