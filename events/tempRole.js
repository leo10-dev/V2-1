const client = require("../index")

client.on('voiceStateUpdate', (oldState, newState) => {

    if (oldState.channelId === newState.channelId) return;
    if (newState.channelId === '996040150889005086') {

        const member = newState.guild.members.cache.get(newState.id);
        const checkChannel = newState.guild.channels.cache.find(channel => channel.name === member.user.tag);

        if (!checkChannel) {
            newState.guild.channels.create(member.user.tag, {
                type: 2,
                parent: '986645897427439626',
                permissionOverwrites: [
                    {
                        type: 'role',
                        id: newState.guild.roles.everyone,
                        deny: ['ViewChannel']
                    },
                    {
                        type: 'user',
                        id: newState.id,
                        allow: ['ViewChannel', 'Speak']
                    },
                ],
            }).then(createdChannel => member.voice.setChannel(createdChannel).catch(error => { }));
        } else {
             member.voice.setChannel(checkChannel).catch(error => { });
        }

    }

});
