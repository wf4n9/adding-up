'use strict';

// Node.jsのモジュール読み出し
// fsはFileSystem
const fs = require('fs');
// readlineは、ファイルを一行ずつ読み込むためのモジュール
const readline = require('readline');
// ファイル名の指定
const rs = fs.ReadStream('./popu-pref.csv');
// ?
const rl = readline.createInterface({ 'input': rs, 'output': {}});
// 集計を格納する連想配列
const map = new Map();

rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const population = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if(!value) {
            value = {
                population10: 0,
                population15: 0,
                change: null
            };
        }
        if(year === 2010) {
            value.population10 += population;
        }
        if(year === 2015) {
            value.population15 += population;
        }
        map.set(prefecture, value)
    }
});
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        // この場合 pair[0]が配列の添字 pair[1]が値であるvalueとなる
        const value = pair[1];
        value.change = value.population15 / value.population10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].population10 + '=>' + pair[1].population15 + ' 変化率: ' +pair[1].change;
    })
    console.log(rankingStrings);
});