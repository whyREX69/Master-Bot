import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions
} from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import axios from 'axios';
import * as data from '../../config.json';
import Logger from '../../lib/utils/logger';

@ApplyOptions<CommandOptions>({
  name: 'anime',
  description: 'Replies with a random anime gif!',
  preconditions: ['isCommandDisabled']
})
export class AnimeCommand extends Command {
  public override chatInputRun(interaction: CommandInteraction) {
    axios
      .get(
        `https://api.tenor.com/v1/random?key=${data.tenorAPI}&q=anime&limit=1`
      )
      .then(async response => {
        return await interaction.reply({
          content: response.data.results[0].url
        });
      })
      .catch(async error => {
        Logger.error(error);
        return await interaction.reply(
          'Something went wrong when trying to fetch a anime gif :('
        );
      });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ): void {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description
    });
  }
}
