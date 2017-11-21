#!/usr/bin/env node 
const _ = require('lodash')
const program = require('commander')
const axios = require('axios')
const moment = require('moment')
const cfonts = require('cfonts')
const asciichart = require('asciichart')
const ora = require('ora')

program
  .version('0.0.1')
  .option('-c, --coin <string>', 'specify the coin e.g. BTC, ETH... (Default: BTC)', 'BTC')
  .option('-cur, --currency <string>', 'specify the currency of coin (Default: USD)', 'USD')
  .option('-d, --days <n>', 'number of days the chart will go back', parseInt)
  .parse(process.argv)

// header 
const header = 'coinboard' 
const headerconfig = {
  font: 'block',
  align: 'left',
  colors: ['green'],
  background: 'Black',
  letterSpacing: 2,
  lineHeight: 1,
  space: true,
  maxLength: '0'
}

// params with default
const { days, width, height } = program
const daysOfData = days || 30
const maxWidth = width || 100
const maxHeight = height || 14

// custom params
const { coin, currency } = program

// APIs
const baseAPI = 'https://min-api.cryptocompare.com/data'
const historyAPI = `${baseAPI}/pricehistorical?fsym=${coin}&tsyms=${currency}&ts=`
const currentAPI = `${baseAPI}/pricehistorical?fsym=${coin}&tsyms=${currency}`

// calling APIs
const getPastTimeStamps = () => {
  const dates = []
  for (let i = daysOfData; i > -1; i--) {
    dates.push(moment().subtract(i, 'days').unix())
  }
  return _.chunk(dates, 15)
}

const fetchPriceHistory = async (dates) => {
  // const dates = getPastTimeStamps()
  let promises = _.map(dates, async (date) => {
    const res = await axios.get(historyAPI + date)
    if (typeof res['data'] !== undefined){
      return parseInt(res['data'][coin][currency])
    }
  })
  return Promise.all(promises)
}

const fetchCurrentPrice = async () => await axios.get(currentAPI)

const printChart = (history) => console.log(asciichart.plot(history, { height: maxHeight }))

// main function
const main = async () => {
  // show header
  cfonts.say(header, headerconfig)

  let pastTimeStamps = getPastTimeStamps()
  let history0 =  await fetchPriceHistory(pastTimeStamps[0])
  let history1 =  await fetchPriceHistory(pastTimeStamps[1])
  let result = history0.concat(history1)
  printChart(result)
  
  const legend = `\t${coin} chart past ${timePast}`
    + ` ${timeName} since ${past}. Current value: ${value[param.currency]} ${param.currency}`

}

main()