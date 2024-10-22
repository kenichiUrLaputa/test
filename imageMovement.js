// imageMovement.js
let timer;
let D = 0; // 移動距離
let v = 0; // 現在の速度
const a = 8; // 加速度
let sv; // 安定速度
let p; // 初期位置
let dots1 = []; // 描写したドットの座標を保持する配列（1つ目のキャンバス）
let dots2 = []; // 描写したドットの座標を保持する配列（2つ目のキャンバス）
let dots3 = []; // 描写したドットの座標を保持する配列（3つ目のキャンバス）
let dots4 = []; // 描写したドットの座標を保持する配列（4つ目のキャンバス）
let dots5 = []; // 描写したドットの座標を保持する配列（5つ目のキャンバス）
let lastDrawTime = 0; // 最後にドットを描写した時間
let startCount = 0; // 実験開始ボタンのカウント（初期値は0）
let oneSecondDistance = 0; // 1秒間の移動距離
let differenceDistance = 0; // 前回の距離
let oneSecondTimer; // 1秒ごとのタイマー
let secondCounter = 0; // 秒数カウンター

document.addEventListener('DOMContentLoaded', function() 
    {
    const startButton = document.getElementById('strat');
    const slider = document.getElementById('slider1');
    const speedInput = document.getElementById('speed');
    const distanceInput = document.getElementById('distance');
    const image3 = document.getElementById('image3'); // 3.pngの要素
    const image2 = document.getElementById('image2'); // 2.pngの要素
    const canvas1 = document.getElementById('dot_1'); // ドット描写用のキャンバス1
    const ctx1 = canvas1.getContext('2d'); // 2Dコンテキストを取得
    const canvas2 = document.getElementById('dot_2'); // ドット描写用のキャンバス2
    const ctx2 = canvas2.getContext('2d'); // 2Dコンテキストを取得
    const canvas3 = document.getElementById('dot_3'); // ドット描写用のキャンバス3
    const ctx3 = canvas3.getContext('2d'); // 2Dコンテキストを取得
    const canvas4 = document.getElementById('dot_4'); // ドット描写用のキャンバス4
    const ctx4 = canvas4.getContext('2d'); // 2Dコンテキストを取得
    const canvas5 = document.getElementById('dot_5'); // ドット描写用のキャンバス5
    const ctx5 = canvas5.getContext('2d'); // 2Dコンテキストを取得

    // スライダーの変更イベント
    slider.addEventListener('input', function() 
        {
        startButton.disabled = slider.value <= 0; // スライダーが左端以外の時にボタンを有効化
        if (startCount === 1) 
            {
            clearAllDots(ctx1, ctx2, ctx3, ctx4, ctx5); // コンテキストを渡す
            resetSliderValues(); // 各回目のスライダー値を0に戻す
            }
        });

    startButton.addEventListener('click', function() {
        if (startCount === 0) 
        {
            startCount = 1; 
        }

        const sliderValue = slider.value; // 現在のスライダー値を取得
        // スライダーの値を各回目の<div>に書き込む
        switch (startCount)
        {
            case 1:
                document.getElementById('sliderValue2').innerText = `1回目（${sliderValue}%）`;
                break;
            case 2:
                document.getElementById('sliderValue3').innerText = `2回目（${sliderValue}%）`;
                break;
            case 3:
                document.getElementById('sliderValue4').innerText = `3回目（${sliderValue}%）`;
                break;
            case 4:
                document.getElementById('sliderValue5').innerText = `4回目（${sliderValue}%）`;
                break;
            case 5:
                document.getElementById('sliderValue6').innerText = `5回目（${sliderValue}%）`;
                break;
        }

        // 新しい<div>にスライダーの値を追加
        switch (startCount)
        {
            case 1:
                document.getElementById('sliderValue7').innerText = `1回目（${sliderValue}%）`;
                break;
            case 2:
                document.getElementById('sliderValue8').innerText = `2回目（${sliderValue}%）`;
                break;
            case 3:
                document.getElementById('sliderValue9').innerText = `3回目（${sliderValue}%）`;
                break;
            case 4:
                document.getElementById('sliderValue10').innerText = `4回目（${sliderValue}%）`;
                break;
            case 5:
                document.getElementById('sliderValue11').innerText = `5回目（${sliderValue}%）`;
                break;
        }

        // ボタンとスライダーを無効化
        startButton.disabled = true; 
        slider.disabled = true; 

        // 初期位置を記憶
        p = parseFloat(image3.style.left) || 15; 
        sv = a * Math.sqrt((15 - p) / 1000); // 安定速度を計算
        v = 0; // 初速度を0
        D = 0; // 初期移動距離を0に設定
        oneSecondDistance = 0; // 1秒間の移動距離を初期化
        differenceDistance = 0; // 前回の距離を初期化
        lastDrawTime = Date.now(); // 最後にドットを描写した時間を初期化
        secondCounter = 0; // 秒数カウンター初期化

        // ドットを追加
        switch (startCount) {
            case 1:
                dots1.push(0);
                drawDots(ctx1, dots1, 'blue');
                break;
            case 2:
                dots2.push(0);
                drawDots(ctx2, dots2, 'red');
                break;
            case 3:
                dots3.push(0);
                drawDots(ctx3, dots3, 'green');
                break;
            case 4:
                dots4.push(0);
                drawDots(ctx4, dots4, 'orange');
                break;
            case 5:
                dots5.push(0);
                drawDots(ctx5, dots5, 'purple');
                break;
        }

        // 1秒ごとの距離計測タイマー開始
        oneSecondTimer = setInterval(function() {
            oneSecondDistance = D - differenceDistance; 
            differenceDistance = D; // 現在のDをdifferenceDistanceに保存

            // 秒数をカウント
            secondCounter++;
            let labelId = ''; 

            // 1回目から5回目、1秒目から12秒目の表示方法を明示的に設定
            if (startCount === 1) {
                if (secondCounter === 1) {
                    labelId = 'time_1_01'; // 1回目の1秒目
                } else if (secondCounter === 2) {
                    labelId = 'time_1_02'; // 1回目の2秒目
                } else if (secondCounter === 3) {
                    labelId = 'time_1_03'; // 1回目の3秒目
                } else if (secondCounter === 4) {
                    labelId = 'time_1_04'; // 1回目の4秒目
                }
            } else if (startCount === 2) {
                if (secondCounter === 1) {
                    labelId = 'time_2_01'; // 2回目の1秒目
                } else if (secondCounter === 2) {
                    labelId = 'time_2_02'; // 2回目の2秒目
                } else if (secondCounter === 3) {
                    labelId = 'time_2_03'; // 2回目の3秒目
                } else if (secondCounter === 4) {
                    labelId = 'time_2_04'; // 2回目の4秒目
                }
            } else if (startCount === 3) {
                if (secondCounter === 1) {
                    labelId = 'time_3_01'; // 3回目の1秒目
                } else if (secondCounter === 2) {
                    labelId = 'time_3_02'; // 3回目の2秒目
                } else if (secondCounter === 3) {
                    labelId = 'time_3_03'; // 3回目の3秒目
                } else if (secondCounter === 4) {
                    labelId = 'time_3_04'; // 3回目の4秒目
                }
            } else if (startCount === 4) {
                if (secondCounter === 1) {
                    labelId = 'time_4_01'; // 4回目の1秒目
                } else if (secondCounter === 2) {
                    labelId = 'time_4_02'; // 4回目の2秒目
                } else if (secondCounter === 3) {
                    labelId = 'time_4_03'; // 4回目の3秒目
                } else if (secondCounter === 4) {
                    labelId = 'time_4_04'; // 4回目の4秒目
                }
            } else if (startCount === 5) {
                if (secondCounter === 1) {
                    labelId = 'time_5_01'; // 5回目の1秒目
                } else if (secondCounter === 2) {
                    labelId = 'time_5_02'; // 5回目の2秒目
                } else if (secondCounter === 3) {
                    labelId = 'time_5_03'; // 5回目の3秒目
                } else if (secondCounter === 4) {
                    labelId = 'time_5_04'; // 5回目の4秒目
                }
            }

            // 対応する<input>にoneSecondDistanceを表示（-0.04して表示）
            const inputField = document.getElementById(labelId);
            if (inputField) {
                inputField.value = (oneSecondDistance - 0.04).toFixed(2); // mで表示し-0.04
            }

            // 12秒に達したらタイマーを停止
            if (secondCounter >= 12) {
                clearInterval(oneSecondTimer);
            }

        }, 1000); // 1秒ごとに実行

        // メインタイマーイベント開始
        timer = setInterval(function() {
            // 速度を表示
            speedInput.value = v.toFixed(2); // m/s

                        // 移動距離を更新
            const d = v * 0.01 + (a * 0.01 * 0.01) / 2; // m
            D += d; // D = D + d
            // 移動距離を表示
            distanceInput.value = D.toFixed(2); // m

            // PXに換算
            const dpx = D * 250; // mからPXに換算
            // 3.pngの位置を更新
            image3.style.left = (p + dpx) + 'px'; 

            // 速度を更新
            v += 0.01 * a; // v = v + 0.01 * a
            if (v > sv) v = sv; // vが安定速度を超えないように設定

            // LEFT位置が15未満の間の処理
            if (parseFloat(image3.style.left) < 15) {
                return; // ループを続ける
            }

            // 0.1秒ごとにドットを描写
            const currentTime = Date.now();
            if (currentTime - lastDrawTime >= 100) { // 0.1秒経過
                lastDrawTime = currentTime; // 最後の描写時間を更新
                switch (startCount) {
                    case 1:
                        dots1.push(dpx); // 現在のdpxを追加
                        drawDots(ctx1, dots1, 'blue'); // 青で描写
                        break;
                    case 2:
                        dots2.push(dpx); // 現在のdpxを追加
                        drawDots(ctx2, dots2, 'red'); // 赤で描写
                        break;
                    case 3:
                        dots3.push(dpx); // 現在のdpxを追加
                        drawDots(ctx3, dots3, 'green'); // 緑で描写
                        break;
                    case 4:
                        dots4.push(dpx); // 現在のdpxを追加
                        drawDots(ctx4, dots4, 'orange'); // オレンジで描写
                        break;
                    case 5:
                        dots5.push(dpx); // 現在のdpxを追加
                        drawDots(ctx5, dots5, 'purple'); // 紫で描写
                        break;
                }
            }

            // 2.pngの位置を設定
            image2.style.left = (parseFloat(image3.style.left) - 16) + 'px'; // 2.pngの位置

            // 3.pngの位置がLEFT:731以上になったらタイマーイベント終了
            if (parseFloat(image3.style.left) >= 731) {
                clearInterval(timer); // タイマーを停止
                clearInterval(oneSecondTimer); // 1秒ごとのタイマーを停止
                image3.style.left = '731px'; // 3.pngのLEFT位置を強制的に731に設定
                image2.style.left = (731 - 16) + 'px'; // 2.pngの位置を設定
                // スライダーを動かせるようにする
                slider.disabled = false; 
                
                // スライダーを動かすと、実験開始ボタンが押せるようにし、2.pngを初期位置に戻す
                slider.addEventListener('input', function() {
                    startButton.disabled = slider.value <= 0; // スライダーが左端以外の時にボタンを有効化
                    image2.style.left = '-1px'; // 2.pngを初期位置に戻す

                    // startCountが1の時に全ての値を0に戻す
                    if (startCount === 1) {
                        resetAllInputValues(); // すべての入力値を0に設定
                    }
                });

                // startCountを更新
                startCount = (startCount % 5) + 1; // 1から5まで循環
            }

        }, 10); // 10ミリ秒ごとに実行
    });
});

// すべての<input>要素の値を0に設定する関数
function resetAllInputValues() {
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 12; j++) {
            const inputFieldId = `time_${i}_${j < 10 ? '0' + j : j}`; // IDを生成
            const inputField = document.getElementById(inputFieldId);
            if (inputField) {
                inputField.value = '0'; // 値を0に設定
            }
        }
    }
}

// ドットを描写する関数
function drawDots(ctx, dots, color) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // キャンバスをクリアせずに過去のドットを残す
    ctx.fillStyle = color; // 指定された色を設定
    for (let i = 0; i < dots.length; i++) {
        const x = dots[i]; // 保存されたdpx
        const y = 25; // Y座標は固定

        // ドットを描く
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2); // ドットの半径を1に設定
        ctx.fill();
    }
}

// すべてのキャンバスのドットをクリアする関数
function clearAllDots(ctx1, ctx2, ctx3, ctx4, ctx5) {
    dots1 = [];
    dots2 = [];
    dots3 = [];
    dots4 = [];
    dots5 = [];
    drawDots(ctx1, dots1, 'blue'); // クリアしたキャンバスに再描写
    drawDots(ctx2, dots2, 'red');
    drawDots(ctx3, dots3, 'green');
    drawDots(ctx4, dots4, 'orange');
    drawDots(ctx5, dots5, 'purple');
}

// 各回目のスライダー値を0に戻す関数
function resetSliderValues() {
    document.getElementById('sliderValue2').innerText = "1回目（0%）";
    document.getElementById('sliderValue3').innerText = "2回目（0%）";
    document.getElementById('sliderValue4').innerText = "3回目（0%）";
    document.getElementById('sliderValue5').innerText = "4回目（0%）";
    document.getElementById('sliderValue6').innerText = "5回目（0%）";
    document.getElementById('sliderValue7').innerText = "1回目\n（0%）";
    document.getElementById('sliderValue8').innerText = "2回目\n（0%）";
    document.getElementById('sliderValue9').innerText = "3回目\n（0%）";
    document.getElementById('sliderValue10').innerText = "4回目\n（0%）";
    document.getElementById('sliderValue11').innerText = "5回目\n（0%）";
}
