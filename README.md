<p align=center>
<img src="https://raw.githubusercontent.com/teddylun/coinboard/master/src/common/images/logo.png" width="50%">
</p>
<p align=center>
<a target="_blank" href="http://nodejs.org/download/" title="Node version"><img src="https://img.shields.io/badge/node.js-%3E=_8.0-green.svg"></a>
<a target="_blank" href="https://opensource.org/licenses/MIT" title="License: MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
<a target="_blank" href="http://makeapullrequest.com" title="PRs Welcome"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
</p>  

> Bitcoin dashboard on CLI 

Check bitcoin prices on CLI 💻

<p align="center">
  <img src="https://raw.githubusercontent.com/teddylun/coinboard/master/src/common/images/screenshot.png" width="100%"/>
</p>

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
  -c, --coin <string>        BOTH: specify the coin e.g. BTC, ETH... (Default: BTC)
  -cur, --currency <string>  BOTH: specify the currency of coin (Default: USD)
  -d, --days <n>             CHART: number of days the chart will go back, must be 90 > days > 0 (Default: 30)
  -r, --rank <n>             RANK: starting rank (Default: 0)
  -l, --limit <n>            RANK: specify the number of coins to display (Default: 5)
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
