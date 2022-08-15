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
        await interaction.deferReply({ ephemeral: true });

        if (interaction.channel.isThread()) {
            client.settings.set(interaction.guildId, interaction.channelId, 'threads');

            let roleName = interaction.channel.name;

            if (interaction.options.getString('role')){
                roleName = interaction.options.getString('role');
            }

            interaction.guild.roles.create({
                name: roleName,
                mentionable: true,
                reason: 'Thread role management'
            })
                .then(logger.log)
                .catch(logger.error);

            await interaction.editReply(`Now managing role '${roleName}' for thread ${interaction.channel.name}`);
        } else {
            await interaction.reply({ content: 'This channel is not a thread!', ephemeral: true });
        }
    }
};