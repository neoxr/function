require('dotenv').config()
const Converter = new (require('./system/converter'))
const Function = new (require('./system/functions'))
const Scraper = new (require('./system/scraper'))
const Extra = require('./system/extra')
const Logs = require('./system/logs')
const NeoxrCommands = new (require('./system/neoxr'))
module.exports = class Component {
   Converter = Converter
   Function = Function
   Scraper = Scraper
   Extra = Extra
   Logs = Logs
   NeoxrCommands = NeoxrCommands
}