const { EmbedBuilder } = require('discord.js')

module.exports = async (interaction, client) => {
    await interaction.deferReply({ephemeral: true});
    if (!interaction.member._roles.includes(client.config.adminRoleId)) return interaction.editReply({content: "> [🔴] :: **You dont have Permissons to Use this comamnd**"})
    const User = interaction.options.getUser("target")
    const args = interaction.options.getString("content")
    const embed = new EmbedBuilder()
    .setColor('Red')
    .setDescription(args || "**الرجاء الرجوع هنا <#{channelId}>**".toString().replace(/\{channelId}/g, interaction.channel.id))
    User.send({embeds: [embed]}).then(ok => {
        interaction.editReply({content: `> 🟢 **Done send Message to <@${User.id}>**`})
    }).catch(e => {
        interaction.editReply({content: `> 🔴 **I Cant send Message to This User look like he blocked __me__**`})
    })
}