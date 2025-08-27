const { EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    name: 'resume',
    aliases: ['continue', 'unpause', 'start'],
    description: 'Resume the paused music',
    securityToken: COMMAND_SECURITY_TOKEN,
    
    async execute(message, args, client) {
        if (!shiva || !shiva.validateCore || !shiva.validateCore()) {
            const embed = new EmbedBuilder()
                .setDescription('❌ System core offline - Command unavailable')
                .setColor('#FF0000');
            return message.reply({ embeds: [embed] }).catch(() => {});
        }

        message.shivaValidated = true;
        message.securityToken = COMMAND_SECURITY_TOKEN;

        
        
        const ConditionChecker = require('../../utils/checks');
        const checker = new ConditionChecker(client);
        
        try {
            const conditions = await checker.checkMusicConditions(
                message.guild.id, 
                message.author.id, 
                message.member.voice?.channelId
            );

            if (!conditions.hasActivePlayer) {
                const embed = new EmbedBuilder().setDescription('❌ No music is currently playing!');
                return message.reply({ embeds: [embed] })
                    ;
            }

            if (!conditions.isPaused) {
                const embed = new EmbedBuilder().setDescription('❌ Music is not paused!');
                return message.reply({ embeds: [embed] })
                    ;
            }

            const player = conditions.player;
            player.pause(false);

            const embed = new EmbedBuilder().setDescription('▶️ Music resumed!');
            return message.reply({ embeds: [embed] })
                ;

        } catch (error) {
            console.error('Resume command error:', error);
            const embed = new EmbedBuilder().setDescription('❌ An error occurred while resuming music!');
            return message.reply({ embeds: [embed] })
                ;
        }
    }
};

