/** 警告画面 **/
window.addEventListener('DOMContentLoaded', function () {
    // ローダーの生成
    createLoader('よみこみ<ruby>中<rt>ちゅう</rt></ruby>');

    // 画面読込完了時の処理
    window.addEventListener('load', function () {
        // ローダーを非表示
        hideLoader();
    });
});

// ブラウザバック時の処理
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        // ローダーを非表示
        hideLoader();
    }
});