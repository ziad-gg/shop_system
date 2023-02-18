const ms = require("ms");
const unix = require("unix-timestamp");
const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js')
const Channels = require("../models/channels")

module.exports = async (interaction, client) => {
    await interaction.deferReply({ephemeral: true});
    if (!interaction.member._roles.includes(client.config.adminRoleId)) return interaction.editReply({content: "> [🔴] :: **You dont have Permissons to Use this comamnd**"})
    const User = interaction.options.getUser("target");
    const Name = interaction.options.getString("name");
    const Time = interaction.options.getString("time");
    const time = ms(Time);
    if (!time || time === void 0 || typeof time === "string") return interaction.editReply({content: "> 🔴 **Invalid time formate user (1d | 4d | 1w | 1m)**", ephemeral: true});
    if (User.bot) return interaction.editReply({content: "> 🔴 **Bots cannot have a channel for shop**", ephemeral: true})
    await interaction.guild.channels.create({
        name: Name,
        type: ChannelType.GuildText,
        parent: client.config["shop-category"] ?? undefined,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.SendMessages],
            },
            {
                id: User.id,
                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
            },
        ],
    }).then(async channel => {
        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`
          **روم خاصه جديده**

          **صاحب الروم**
          <@${User.id}> (${User.id})
         **الاداري**
          <@${interaction.user.id}> (${interaction.user.id})
          **تاريخ الانشاء**
          <t:${parseInt(unix.now())}:F>
          **تاريخ الانتهاء**
          <t:${parseInt( ((Date.now() + time) / 1/1000) ) }:R>

          ${Time} room
        `)
        const msg = await channel.send({embeds: [embed]})
        await msg.pin()
        const channelData = new Channels({
            userId: User.id,
            channelId: channel.id,
            createdAt: unix.now(),
            endsAt: parseInt(Date.now() + time),
            createBy: interaction.user.id,
            messageId: msg.id,
        })
       await channelData.save()
       interaction.editReply({content: `> 🟢 **done create a priavte room to <@${User.id}> <#${channel.id}>**`})
    }).catch(e => {
        interaction.editReply({content: `Error: (${e?.toString()})`})
    })
}