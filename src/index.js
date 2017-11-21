#!/usr/bin/env node 
const _ = require('lodash')
const program = require('commander')
const axios = require('axios')
const moment = require('moment')
const cfonts = require('cfonts')
const asciichart = require('asciichart')
const ora = require('ora')
const table = require('cli-table2')

program
  .version('0.0.1')
  .option('-c, --coin <string>', 'specify the coin e.g. BTC, ETH... (Default: BTC)', 'BTC')
  .option('-cur, --currency <string>', 'specify the currency of coin (Default: USD)', 'USD')
  .option('-d, --days <n>', 'number of days the chart will go back', parseInt)
  .option('-r, --rank <n>', 'starting rank (Default: 0)', parseInt)
  .option('-lim, --limit <n>', 'specify the number of coins to display (Default: 5)', parseInt)
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
const { days, width, height, limit, rank } = program
const daysOfData =  days > 0 && days < 90 ? days : 30
const maxWidth = width || 100
const maxHeight = height || 14
const maxLimit = limit || 5
const startingRank = rank || 0

// custom params
const { coin, currency } = program

// APIs
const cryptocompareAPI = 'https://min-api.cryptocompare.com/data'
const historyAPI = `${cryptocompareAPI}/pricehistorical?fsym=${coin}&tsyms=${currency}&ts=`
const snapShotAPI = `https://www.cryptocompare.com/api/data/coinsnapshot/?fsym=${coin}&tsym=${currency}`

const coinmarketcapAPI = 'https://api.coinmarketcap.com/v1/ticker'
const coinsRankingAPI = `${coinmarketcapAPI}/?start=${startingRank}limit=${maxLimit}`

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

const fetchSnapShot = async () => await axios.get(snapShotAPI)

const printChart = (history) => console.log(asciichart.plot(history, { height: maxHeight }))

const loadChart = async () => {
  const spinner = ora('📈 loading coins data...').start()
  spinner.color = 'yellow'
  // chart part
  let pastTimeStamps = getPastTimeStamps()
  let result = []
  for (let i = 0; i < pastTimeStamps.length; i++){
    let history = await fetchPriceHistory(pastTimeStamps[i])
    result.push(...history)
  }

  // legends part
  const snapShot = await fetchSnapShot()
  const { PRICE, LASTUPDATE } = snapShot.data.Data.AggregatedData
  const lastUpdatedAt = moment.unix(LASTUPDATE).format("YYYY-MM-DD h:mm")
  const legends = `${coin} chart on last ${daysOfData} days \nCurrent: ${PRICE} ${currency}, updated at: ${lastUpdatedAt} \nsource: https://www.cryptocompare.com`
  
  // display result
  spinner.stop()
  printChart(result)
  console.log(legends) 
}

const main = async () => {
  // show header
  cfonts.say(header, headerconfig)
  
  loadChart()


}

main()