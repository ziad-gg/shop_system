module.exports = async (interaction, client) => {
    await interaction.deferReply({ephemeral: true})
    if (!interaction.member._roles.includes(client.config.adminRoleId)) return interaction.editReply({content: "> [🔴] :: **You dont have Permissons to Use this comamnd**"})
    const User = interaction.options.getUser("target");
    const Mention = interaction.options.getString("mention") === "none" ? "" : interaction.options.getString("mention");
    const content = interaction.options.getString("post");
    const channel = await interaction.guild.channels.cache.get(client.config["ads-channel"]);
    channel.send({content: content.toString().replace(/@everyone|@here|[<&>]/gi, "").concat('\n\n', `تواصل مع <@${User.id}>`, "\n\n", (Mention? Mention : ""))});
    interaction.editReply({content: content.toString().replace(/@everyone|@here|[<&>]/gi, "").concat('\n\n', `تواصل مع <@${User.id}>`, "\n\n", (Mention? Mention : ""))})
}