const fs = require('fs');
const ascii = require('ascii-table');
let table = new ascii(`Commands`);
table.setHeading('Command', 'Load Status');

module.exports = (client) => {
    fs.readdirSync('./SlashCommands').forEach((folder) => {
        const commandFiles = fs.readdirSync(`./SlashCommands/${folder}`).filter(file => file.endsWith('.js'));
        for (file of commandFiles) {
            let command = require(`../SlashCommands/${folder}/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, '❌');
                continue;
            }
            
        }
    });
    console.log(table.toString());
   
}
