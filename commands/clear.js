module.exports.aliases = ['clear', 'c']

/**
 * @param {import('../classes/Client')} client
 * @param {import('@harmonyland/harmony').Message} msg
 */
module.exports.run = async (_, msg) => {
  const [arg = 5] = msg.query.args
  if (!arg) return msg.reply('Please write a number.')

  const many = isNaN(parseInt(arg)) || parseInt(arg) + 1 < 1 ? 1 : parseInt(arg) + 1
  if (many > 100) return msg.reply('so long duh\nhttps://youtu.be/OCh2l0J1uJk?t=5')

  await msg.channel.bulkDelete(many)
  await msg.reply(`Deleted ${many - 1} messages.`)
}
