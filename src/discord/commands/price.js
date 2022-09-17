import * as users from '../users.js';
import * as rules from '../rules.js';
import * as money from '../../utilities/money.js';
import * as market from '../../triport/market.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('price')
    .setDescription('The market moves fast.')
    .addStringOption(option => {
        return option
            .setName('ticker')
            .setDescription('Which company would you like to price check?')
            .setRequired(true);
    });

export async function execute(interaction) {
    const tag = interaction.user.tag;
    const ticker = interaction.options.getString('ticker').toUpperCase();
    await rules.assertUserExists(tag);
    const sheetId = (await users.findUser(tag)).sheetId;
    const ex = await market.exchange(sheetId);
    const price = await market.stockPrice(ex, ticker);
    const date = await market.date(ex);
    return `${ticker} is worth ${money.format(price)} on ${date}`;
}