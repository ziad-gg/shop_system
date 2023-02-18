const { Client, GatewayIntentBits, Events, Collection, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const ms = require('ms');
const ChannelsModel = require("./models/channels")

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.config = require("./src/config");

const commands = [
    new SlashCommandBuilder()
    .setName("renew-private-room")
    .setDescription("to renew a private room slash")
    .addChannelOption(op => op
        .setName("channel")
        .setDescription("the channel") 
        .setRequired(true)   
    )
    .addStringOption(op => op 
        .setName("time")
        .setDescription("time of channnel (1d| 1w| 2w| 1m)")
        .setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName("create-private-room")
    .setDescription("to create a private room slash")
    .addUserOption(op => 
        op
        .setName('target')
        .setDescription('The member to create channel')
        .setRequired(true)
    )
    .addStringOption(op => op 
        .setName("name")
        .setDescription("channel name")
        .setRequired(true)
    )
    .addStringOption(op => op 
        .setName("time")
        .setDescription("time of channnel (1d| 1w| 2w| 1m)")
        .setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName("send-post")
    .setDescription("send post in a custom channel")
	.addStringOption(option =>
        option.setName('mention')
            .setDescription('choose mention type')
            .setRequired(true)
            .addChoices(
                { name: '@everyone', value: '@everyone' },
                { name: '@here', value: '@here' },
                { name: 'none', value: 'none' },
            )
    )
    .addUserOption(op => 
        op
        .setName('target')
        .setDescription('The member to send post')
        .setRequired(true)
    )
    .addStringOption(op => op 
        .setName("post")
        .setDescription("content of post")
        .setMaxLength(4000)
        .setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName("dm-user")
    .setDescription("send message to user")
    .addUserOption(op => 
        op
        .setName('target')
        .setDescription('The member to send post')
        .setRequired(true)
    )
    .addStringOption(op => op 
        .setName("content")
        .setDescription("content of message")
        .setMaxLength(4000)
        .setRequired(false)
    )
]

client.once(Events.ClientReady, async c => {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
	console.log(`Ready! Logged in as ${c.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(c.token);
    const data = await rest.put( Routes.applicationCommands(c.user.id), { body: commands });
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    await mongoose.connect("mongodb+srv://ZIAD:ZIATH@cluster0.qizpg.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Client Database is ready @connection[${mongoose.connection.readyState}]`);
    require('./src/antiCrash')
    setInterval(async () => {
        const activeChannels = await ChannelsModel.find({loked: false});
        const unActive = await ChannelsModel.find({locked: true});
        await unActive.forEach(async channel => {
            const ch = await c.channels.cache.get(channel.channelId);
            if (!ch || ch === void 0) return channel.remove();
            if (channel.since < Date.now()) {
                await channel.remove();
                await ch.delete();
            }
        })
        await activeChannels.forEach(async channel => {
           const ch = await c.channels.cache.get(channel.channelId);
           if (!ch || ch === void 0) return channel.remove()
           if (channel.endsAt < Date.now()) {
            const Message = await ch.messages.fetch(channel.messageId)
            const embed = EmbedBuilder.from(Message.embeds[0]).setDescription("**تم انتهاء مدة الروم الخاص**\n**للتجديد توجه للدعم الفني** ⏳");
            ch.permissionOverwrites.create(ch.guild.roles.everyone, { ViewChannel: false });
            Message.edit({embeds: [embed]});
            channel.locked = true;
            channel.since = (Date.now() + ms("1d"))
            await channel.save();
           }
        });
    }, 5 * 60000)
});

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;
    const cmd = require('./commands/'.concat(interaction.commandName))
    cmd(interaction, client)
})

client.login("MTA1MTA2MDc2ODU0MTUyMzk4OA.Gv4_-Z.9GjEpy-CUJgTWYw7D5Z5AJvLPU8JiaJgQz9cGk")