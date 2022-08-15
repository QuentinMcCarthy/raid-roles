const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createrole')
        .setDescription('Marks the channel for thread role tracking')
        .addStringOption(option =>
            option.setName('role')
                .setDescription('The name of the role to create, if left blank the role will have the same name as the thread'))
		.setDefaultMemberPermissions(PermissionFlagsBits.MANAGE_ROLES),
    async execute(interaction) {
        if (interaction.channel.isThread()) {
            let roleName = interaction.channel.name;
            let roleId = 0;

            if (interaction.options.getString('role')){
                roleName = interaction.options.getString('role');
            }

            interaction.guild.roles.create({
                name: roleName,
                mentionable: true,
                reason: 'Thread role management'
            })
                .then((role) => {
                    roleId = role.id;

                    client.settings.set(interaction.guildId, roleId, `threads.${interaction.channelId}.role`)

                    logger.log('info', `Role ${roleId} created for thread ${interaction.channel.name} at ${interaction.user.tag}'s request`)
                })
                .catch((err) => logger.log('error', err));

            await interaction.reply({ content: `Now managing role ${roleName} (${roleId}) for thread ${interaction.channel.name}`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'This channel is not a thread!', ephemeral: true });
        }
    }
};