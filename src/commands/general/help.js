const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require('discord.js');
const { helpCategories, categoryChoices } = require('../../constants/helpCategories');

function chunkLines(lines, maxLength = 900) {
  const chunks = [];
  let current = [];
  let size = 0;

  for (const line of lines) {
    const formatted = `\`${line}\``;
    const len = formatted.length + 1;
    if (size + len > maxLength && current.length) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(formatted);
    size += len;
  }

  if (current.length) chunks.push(current);
  return chunks;
}

function buildHelpEmbed(categoryKey) {
  const category = helpCategories[categoryKey] || helpCategories.general;
  const chunks = chunkLines(category.commands);

  const embed = new EmbedBuilder()
    .setColor(0x2f3136)
    .setTitle(`${category.emoji} ${category.label}`)
    .setDescription(`${category.description}\n\n**عدد الأوامر:** ${category.commands.length}`)
    .setFooter({ text: 'اختر قائمة مختلفة من المنيو بالأسفل.' });

  chunks.forEach((chunk, index) => {
    embed.addFields({
      name: index === 0 ? 'الأوامر' : `الأوامر (تكملة ${index + 1})`,
      value: chunk.join('\n')
    });
  });

  return embed;
}

function buildMenu(current) {
  const options = categoryChoices.map(({ name, value }) =>
    new StringSelectMenuOptionBuilder().setLabel(name).setValue(value).setDefault(value === current)
  );

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('help-menu')
      .setPlaceholder('اختر القائمة المناسبة لك')
      .addOptions(options)
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('قائمة الأوامر بشكل مرتب')
    .addStringOption((opt) =>
      opt
        .setName('category')
        .setDescription('افتح قسم معيّن مباشرة')
        .addChoices(...categoryChoices)
    ),

  async execute(interaction) {
    const selected = interaction.options.getString('category') || 'general';

    await interaction.reply({
      ephemeral: true,
      embeds: [buildHelpEmbed(selected)],
      components: [buildMenu(selected)]
    });
  }
};

module.exports.buildHelpEmbed = buildHelpEmbed;
module.exports.buildMenu = buildMenu;
