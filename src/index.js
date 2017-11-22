#!/usr/bin/env node 
const _ = require('lodash')
const program = require('commander')
const axios = require('axios')
const moment = require('moment')
const cfonts = require('cfonts')
const asciichart = require('asciichart')
const ora = require('ora')
const Table = require('cli-table2')
const colors = require('colors')

program
  .version('0.0.1')
  .option('-c, --coin <string>', 'BOTH: specify the coin e.g. BTC, ETH... (Default: BTC)', 'BTC')
  .option('-cur, --currency <string>', 'BOTH: specify the currency of coin (Default: USD)', 'USD')
  .option('-d, --days <n>', 'CHART: number of days the chart will go back, must be 90 > days > 0 (Default: 30)', parseInt)
  .option('-r, --rank <n>', 'RANK: starting rank (Default: 0)', parseInt)
  .option('-l, --limit <n>', 'RANK: specify the number of coins to display (Default: 5)', parseInt)
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
const daysOfData =  days > 0 && days <= 90 ? days : 30
const maxWidth = width || 100
const maxHeight = height || 14
const maxLimit = limit || 5
const startingRank = rank || 0
let loading = false
const spinner = ora()
spinner.color = 'green'

// custom params
const { coin, currency } = program

// APIs
const cryptocompareAPI = 'https://min-api.cryptocompare.com/data'
const historyAPI = `${cryptocompareAPI}/pricehistorical?fsym=${coin}&tsyms=${currency}&ts=`
const snapShotAPI = `https://www.cryptocompare.com/api/data/coinsnapshot/?fsym=${coin}&tsym=${currency}`
const coinmarketcapAPI = 'https://api.coinmarketcap.com/v1/ticker'
const coinsRankingAPI = `${coinmarketcapAPI}/?start=${startingRank}&limit=${maxLimit}&convert=${currency}`

// table
const table = new Table({
  chars: {
    'top': '-',
    'top-mid': '-',
    'top-left': '-',
    'top-right': '-',
    'bottom': '-',
    'bottom-mid': '-',
    'bottom-left': '-',
    'bottom-right': '-',
    'left': '',
    'left-mid': '-',
    'mid': '-',
    'mid-mid': '-',
    'right': '',
    'right-mid': '-',
    'middle': '│'
  },
  head: ['Rank', '💰 Coin', `Price (${currency})`, 'Change (24H)', 'Change (1H)', 'Change (7D)', `Market Cap (${currency})`].map(title => title.yellow),
  colWidths: [6, 15, 15, 15, 15, 20],
  wordWrap: true
})

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
const fetchRanks = async () => await axios.get(coinsRankingAPI)

const printChart = (history) => console.log(asciichart.plot(history, { height: maxHeight }))

const toggleLoading = (text) => {
  if(loading) {
    loading = !loading  
    spinner.stop()
    return spinner.clear()
  } else {
    loading = !loading
    return spinner.start(text)
  }
}

const loadChart = async () => {
  try{
    // chart part
    let pastTimeStamps = getPastTimeStamps()
    let result = []
    for (let i = 0; i < pastTimeStamps.length; i++) {
      toggleLoading('Loading 📈 ...')
      let history = await fetchPriceHistory(pastTimeStamps[i])
      toggleLoading()
      result.push(...history)
    }

    // legends part
    toggleLoading('Loading 📸 ...')
    const snapShot = await fetchSnapShot()
    toggleLoading()
    const { PRICE, LASTUPDATE } = snapShot.data.Data.AggregatedData
    const lastUpdatedAt = moment.unix(LASTUPDATE).format("YYYY-MM-DD hh:mm:ss")
    const legends = `${coin} Chart on last ${daysOfData} days \nCurrent: ${PRICE} (${currency})`
    const source = `Source: https://www.cryptocompare.com at ${lastUpdatedAt}`
    // display result
    printChart(result)
    console.log(legends.green)
    return console.log(`${source.green}\n`)
  } catch (err) {
    toggleLoading()
    throw err
  } 
}

const ranksMassage = (record) => {
  const { rank, symbol, percent_change_24h, percent_change_1h, percent_change_7d  } = record
  const lowerCaseCurrency = currency.toLowerCase()
  const marketCap = record[`market_cap_${lowerCaseCurrency}`]
  const price = record[`price_${lowerCaseCurrency}`]
  return [
    rank,
    `💰 ${symbol}`, 
    price,
    percent_change_24h > 0 ? percent_change_24h.green : percent_change_24h.red, 
    percent_change_1h > 0 ? percent_change_1h.green : percent_change_1h.red, 
    percent_change_7d > 0 ? percent_change_7d.green : percent_change_7d.red,
    marketCap
  ]
}

const pushToTable = (record) => table.push(record)
const printTable = () => console.log(table.toString())

const loadRanks = async () => {
  try {
    toggleLoading('Loading 📊 ...')
    const ranks = await fetchRanks()
    toggleLoading()
    ranks.data
      .map(ranksMassage)
      .forEach(pushToTable)
    printTable()
    const lastUpdatedAt = moment.unix(ranks.data[0]['last_updated']).format("YYYY-MM-DD hh:mm:ss")
    const legends = `Source: https://coinmarketcap.com at ${lastUpdatedAt}`
    return console.log(legends.bold)
  } catch (err) {
    toggleLoading()
    throw err
  }
}

const main = async () => {
  // show header
  cfonts.say(header, headerconfig)
  const charting = await loadChart(spinner)
  loadRanks(charting)
  
}

main()