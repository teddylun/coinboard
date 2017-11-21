<p align=center>
<img src="">
</p>
<p align=center>
<a target="_blank" href="http://nodejs.org/download/" title="Node version"><img src="https://img.shields.io/badge/node.js-%3E=_6.0-green.svg"></a>
<a target="_blank" href="https://opensource.org/licenses/MIT" title="License: MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
<a target="_blank" href="http://makeapullrequest.com" title="PRs Welcome"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
</p>  

> Cryptocurrency Dashboard CLI 
All-in-one Cryptocurrencies dashboard on your terminal
![alt text](https://github.com/teddylun/coinboard/tree/master/src/common/images/screenshot.png "screenshot")

## Features
- Coins Chart
- Coins Ranking

## Coming features
- Coins list display
- Coins subscription 
- Section toggling

and more...

## Installation
Coinboard requirs node 8.* or later
```
$ npm install -g coinboard
```

## Usage
```
$ coinboard
```

## Options
```
  -V, --version              output the version number
  -c, --coin <string>        specify the coin e.g. BTC, ETH... (Default: BTC)
  -cur, --currency <string>  specify the currency of coin (Default: USD)
  -d, --days <n>             number of days the chart will go back (Default: 30)
  -r, --rank <n>             starting rank (Default: 0)
  -l, --limit <n>            specify the number of coins to display (Default: 5)
  -h, --help                 output usage information
```

## Development
```
$ git clone https://github.com/teddylun/coinboard.git
$ cd coinboard
$ npm install -g 
$ npm link
$ coinboard
```

## Data sources
- [cryptocompare](https://www.cryptocompare.com)
- [coinmarketcap](https://coinmarketcap.com) 

## License
MIT