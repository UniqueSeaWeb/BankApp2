// グラフを形成するデータ
const fileData = [{
    "graphData": [
        {
            // 横軸の色とデータ
            "column": [
                {
                    "data": 2,
                    "color": "#5993EB"
                },
                {
                    "data": 0,
                    "color": "#4DABEF"
                },
                {
                    "data": 9,
                    "color": "#5ECAEC"
                },
                {
                    "data": 18,
                    "color": "#D8DB5F"
                },
                {
                    "data": 22,
                    "color": "#F0D800"
                },
                {
                    "data": 40,
                    "color": "#FABF00"
                },
                {
                    "data": 30,
                    "color": "#F69C00"
                },
                {
                    "data": 8,
                    "color": "#F28300"
                },
                {
                    "data": -10,
                    "color": "#F15D78"
                },
                {
                    "data": -3,
                    "color": "#E53935"
                }
            ],
            // 縦軸ラベル
            "row": [
                {
                    "label": "-10"
                },
                {
                    "label": "0"
                },
                {
                    "label": "10"
                },
                {
                    "label": "20"
                },
                {
                    "label": "30"
                }
            ],
            // Y軸の最大最小値（最小は目盛がないところまで設定）と現在値
            "graph": [
                {
                    "min": -10,
                    "max": 30
                }
            ]
        }
    ]
}]

// =====グラフ生成処理========================================================
// jsonData：JSONファイルデータ
// target：対象グラフ
// ==========================================================================
function createGraph(jsonData, target) {
    // キャンバス設定
    const graph_canvas = target.getElementsByClassName('canvas')[0];
    const context = graph_canvas.getContext('2d');
    // グラフ領域
    graph_canvas.width = graph_canvas.offsetWidth;
    graph_canvas.height = graph_canvas.offsetHeight;
    const width = graph_canvas.offsetWidth;
    const height = graph_canvas.offsetHeight;

    // 縦軸の値1に対しての高さ
    const heightPerOne = height / (jsonData.graph[0].max - jsonData.graph[0].min);

    // グラフの横線を描画する
    // 一番下の横線は太さが2pxで、線端がroundのため1px調整
    drawStrokeLine(context, 1, height - 1, width - 1, height - 1, '#D5D5D5', 1, 'round', true);
    // 縦軸のデータの個数分繰り返す
    for (let i = 0; i < jsonData.row.length; i++) {
        // 値が0の要素か判定
        if (jsonData.row[i].label == Number(jsonData.row[jsonData.row.length - 1].label) + Number(jsonData.row[0].label)) {
            // 0の横線は太さが2pxで、線端がroundのため1px調整
            drawStrokeLine(context, 1, heightPerOne * (jsonData.row[i].label - jsonData.graph[0].min), width - 1, heightPerOne * (jsonData.row[i].label - jsonData.graph[0].min), '#D5D5D5', 2, 'round', false);
        } else {
            drawStrokeLine(context, 0, heightPerOne * (jsonData.row[i].label - jsonData.graph[0].min), width, heightPerOne * (jsonData.row[i].label - jsonData.graph[0].min), '#D5D5D5', 1, 'round', true);
        }
    }

    // 棒グラフを描画する
    const good = target.getElementsByClassName('graph_goodText')[0].offsetWidth;
    const bad = target.getElementsByClassName('graph_badText')[0].offsetWidth;
    const fluctuationArea = width - good - bad;   // グラフの変動領域

    // 各横軸ラベルのX座標を左から順に配列に格納
    const XCoordinate = getXCoordinate(jsonData, fluctuationArea, good);

    // 棒グラフの色を設定する
    // 横軸のデータの個数分繰り返す
    for (let i = 0; i < jsonData.column.length; i++) {
        let color;
        // 正の値なら青に、負の値なら赤に設定
        if (jsonData.column[i].data > 0) {
            color = '#5ea1c5';
        } else if (jsonData.column[i].data < 0) {
            color = '#e84f4c';
        }

        // 棒グラフの縦軸の座標（Y座標）
        let Ycoordinate = heightPerOne * (jsonData.graph[0].max - jsonData.column[i].data);
        // データが最大値以上か判定
        if (jsonData.column[i].data > jsonData.graph[0].max - 2) {
            // 上限値に設定
            // グラフが一番上の横線と重ならないように2px調整
            Ycoordinate = 2;
        }
        // データが最小値以下か判定
        if (jsonData.column[i].data < jsonData.graph[0].min + 2) {
            // 下限値に設定
            // グラフが一番下の横線と重ならないように2px調整
            Ycoordinate = heightPerOne * (jsonData.row[jsonData.row.length - 1].label - jsonData.graph[0].min) - 2;
        }

        // データが0以外の場合、棒グラフの線を描画する
        if (jsonData.column[i].data != 0) {
            // 2pxで描画するため7px調整、横線に重ならないように調整（1と3の部分）
            drawTwoCornerRoundedLine(context, XCoordinate[i] + 7, heightPerOne * (jsonData.row[3].label - jsonData.graph[0].min), XCoordinate[i] - 7, Ycoordinate + 1, 2, color, color, 2, false);
        }

        // ペンギンの位置指定
        const box = document.getElementsByClassName('box')[0];
        if (jsonData.column[i].data >= 0) {
            box.style.top = Ycoordinate * 0.56 + 103 + 'px';
            box.style.left = XCoordinate[i] * 0.93 + 40 + 'px';
        } else if (jsonData.column[i].data < 0) {
            box.style.top = Ycoordinate + 92 - fluctuationArea / 24 + 'px';
            box.style.left = XCoordinate[i]  + 30 - fluctuationArea / 24 + 'px';
        }

        // ペンギンの大きさ指定
        box.style.height = fluctuationArea / 7 + 'px';
        box.style.width = fluctuationArea / 7 + 'px';
    }
}

// ====線を引く===============================================================
// context：対象キャンバス
// startX：開始点のX座標
// startY：開始点のY座標
// endX：終了点のX座標
// endY：終了点のY座標
// color：線の色
// size：線の太さ
// lineCap：線端の種類
// dotLine：破線か否か
// ==========================================================================
function drawStrokeLine(context, startX, startY, endX, endY, color, size, lineCap, dotLine) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = lineCap;
    // 破線か否か判定
    if (dotLine) {
        context.setLineDash([2, 1]);
    } else {
        context.setLineDash([]);
    }
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}

// =====各横軸ラベルのX座標設定================================================
// jsonData：JSONファイルデータ
// fluctuationArea：変動領域
// margin：左右余白
// ==========================================================================
function getXCoordinate(jsonData, fluctuationArea, margin) {
    // 一つの横軸ラベルの幅
    const memWidth = fluctuationArea / jsonData.column.length;
    const memWidthHalf = memWidth / 2;
    // 描画位置（X座標）を順に配列に格納する
    let XCoordinate = [];
    for (let i = 0; i < jsonData.column.length; i++) {
        XCoordinate.push(memWidthHalf + margin + (memWidth * i));
    }
    return XCoordinate;
}

// ====2つの角が角丸の線を引く================================================
// context：対象キャンバス
// x1：開始点のX座標
// y1：開始点のY座標
// x2：開始点の対角のX座標
// y2：開始点の対角のY座標
// strokeColor：線の色
// fillColor：塗りつぶす色
// size：線の太さ
// dotLine：破線か否か
// ==========================================================================
function drawTwoCornerRoundedLine(context, x1, y1, x2, y2, borderRadius, strokeColor, fillColor, size, dotLine) {
    context.beginPath();
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    context.lineWidth = size;
    // 破線か否か判定
    if (dotLine) {
        context.setLineDash([6, 4]);
    } else {
        context.setLineDash([]);
    }
    context.moveTo(x1, y1);
    context.lineTo(x2, y1);
    context.arcTo(x2, y2, x1, y2, borderRadius);
    context.arcTo(x1, y2, x1, y1, borderRadius);
    context.closePath();
    context.fill();
    context.stroke();
}

// =====Element生成==========================================================
// jsonData：JSONファイルデータ
// target：対象グラフ
// ==========================================================================
function createGraph_Element(jsonData, target) {

    // X軸ラベルの作成
    const XlabelArea = document.createElement('div');
    XlabelArea.classList.add('graph_XlabelArea');

    // 「Good」テキスト
    const goodText = document.createElement('div');
    goodText.classList.add('graph_goodText');
    // タイポ
    let goodText_typo = document.createElement('p');
    goodText_typo.innerText = 'むかし';
    goodText.appendChild(goodText_typo);
    XlabelArea.appendChild(goodText);

    // X軸ラベル
    const Xlabel = document.createElement('div');
    Xlabel.classList.add('graph_Xlabel');
    for (let i = 0; i < jsonData.column.length; i++) {
        // X軸のbar
        const Xlabel_div = document.createElement('div');
        const Xlabel_bar = document.createElement('div');
        Xlabel_bar.classList.add('graph_bar');
        // Xlabel_bar.style.backgroundColor = jsonData.column[i].color;

        Xlabel_div.appendChild(Xlabel_bar);
        Xlabel.appendChild(Xlabel_div);
    }
    XlabelArea.appendChild(Xlabel);

    // 「Bad」テキスト
    const badText = document.createElement('div');
    badText.classList.add('graph_badText');
    // タイポ
    let badText_typo = document.createElement('p');
    badText_typo.innerText = 'いま';
    badText.appendChild(badText_typo);
    XlabelArea.appendChild(badText);
    target.appendChild(XlabelArea);

    // Y軸ラベルの作成
    const YlabelArea = document.createElement('div');
    YlabelArea.classList.add('graph_YlabelArea');
    for (let i = jsonData.row.length - 1; i >= 0; i--) {
        const Ylabel = document.createElement('div');
        Ylabel.classList.add('graph_Ylabel');

        // タイポ
        let Ylabel_typo = document.createElement('p');
        Ylabel_typo.className = 'yLabel';
        Ylabel_typo.innerText = jsonData.row[i].label;

        Ylabel.appendChild(Ylabel_typo);
        YlabelArea.appendChild(Ylabel);
    }
    target.appendChild(YlabelArea);
}

// y軸ラベルの高さ調整
function setYlabelHeight(jsondata, height) {
    for (let i = 0; i < jsondata.row.length; i++) {
        document.getElementsByClassName('graph_Ylabel')[i].style.height = height / (jsondata.row.length - 1) + 'px';
    }
}

const graph = document.getElementsByClassName('graph');
// ページ読み込み時にイベント登録
window.addEventListener('DOMContentLoaded', function () {
    // グラフ生成処理呼び出し
    for (let i = 0; i < graph.length; i++) {
        createGraph_Element(fileData[0].graphData[i], graph[i]);
        createGraph(fileData[0].graphData[i], graph[i]);
        setYlabelHeight(fileData[0].graphData[i], graph[i].getElementsByClassName('canvas')[0].offsetHeight);
    }
});
// リサイズ時にイベント登録
window.addEventListener('resize', function () {
    for (let i = 0; i < graph.length; i++) {
        createGraph(fileData[0].graphData[i], graph[i]);
        setYlabelHeight(fileData[0].graphData[i], graph[i].getElementsByClassName('canvas')[0].offsetHeight);
    }
});