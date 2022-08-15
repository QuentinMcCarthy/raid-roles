const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteRole')
        .setDescription('Deletes the role being managed for this thread')
        .setDefaultMemberPermissions(PermissionFlagsBits.MANAGE_ROLES),
    async execute(interaction) {
        if (interaction.channel.isThread()) {
            let toDelete = client.settings.get(interaction.guildId, `threads.${interaction.channelId}.role`);

            interaction.guild.roles.delete('', 'No longer managing role')
                .then(() => logger.log('info', `Deleted role ID:${toDelete} at ${interaction.user.tag}'s request`))
                .catch(logger.error);

            client.settings.set(interaction.guildId, 0, `threads.${interaction.channelId}.role`);

            await interaction.reply({ content: 'Role no longer being managed for this channel', ephemeral: true});
        } else {
            await interaction.reply({ content: 'This channel is not a thread!', ephemeral: true });
        }
    }
};