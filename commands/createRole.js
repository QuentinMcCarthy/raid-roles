const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createRole')
        .setDescription('Marks the channel for thread role tracking')
        .addStringOption(option =>
            option.setName('role')
                .setDescription('The name of the role to create, if left blank the role will have the same name as the thread'))
		.setDefaultMemberPermissions(PermissionFlagsBits.MANAGE_ROLES),
    async execute(interaction) {
        if (interaction.channel.isThread()) {
            let roleName = interaction.channel.name;

            if (interaction.options.getString('role')){
                roleName = interaction.options.getString('role');
            }

            interaction.guild.roles.create({
                name: roleName,
                mentionable: true,
                reason: 'Thread role management'
            })
                .then((role) => {
                    client.settings.set(interaction.guildId, role.id, `threads.${interaction.channelId}.role`)

                    logger.log('info', `Role ${role.id} created for thread ${interaction.channel.name} at ${interaction.user.tag}'s request`)
                })
                .catch(logger.error);

            await interaction.reply(`Now managing role '${client.settings.get(interaction.guildId, `threads.${interaction.channelId}.role`)}' for thread ${interaction.channel.name}`);
        } else {
            await interaction.reply({ content: 'This channel is not a thread!', ephemeral: true });
        }
    }
};