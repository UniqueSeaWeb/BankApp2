/** ログイン画面 **/
/* ID一覧スプレッドシート：https://docs.google.com/spreadsheets/d/1NftJ7cv4KZOpkh0QW1RgosI0vlQPHKEiHS80lGkMJW0/edit?gid=0#gid=0 */
// ID一覧スプレッドシートのウェブアプリURLを定義
var IDLIST_GAS_URL = 'https://script.google.com/macros/s/AKfycbxvWnLDCQPPjhTYf4ZsmkgI0rtzJ0ZBklczam35ECOtoa8smC0zYJVWjSmcyJyJ-GG8bw/exec';
/* ログイン履歴スプレッドシート：https://docs.google.com/spreadsheets/d/1EYg7kVkW_GZSAfFISS7MnHIZ-1SrG5RokLR8jmtJ61A/edit?gid=0#gid=0 */
// ログイン履歴スプレッドシートのウェブアプリURLを定義
var LOG_GAS_URL = 'https://script.google.com/macros/s/AKfycbxBtLFFuKDK4YEu_doqD7VgX4SUFPaYMCT5Iixqe2NlaCr_uLqExsvxluxwuWcypIPV/exec';

window.addEventListener('DOMContentLoaded', function () {
    // 要素を取得
    const loginBtn = document.getElementById('bl_loginBtn'); // 「ログイン」ボタン
    const agreeBtn = document.getElementById('bl_agreeBtn'); // 「はい」ボタン
    const userId = document.getElementById('bl_userId'); // 「ID」テキストフィールド

    // ローダーの生成
    createLoader('よみこみ<ruby>中<rt>ちゅう</rt></ruby>');

    // 画面読込完了時の処理
    window.addEventListener('load', function () {
        // ローダーを非表示
        hideLoader();
    });

    // 「ID」テキストフィールド入力時の処理
    userId.addEventListener('input', function () {
        if (this.value.length == 5) {
            // 5桁入力した場合
            // ログインボタンにフォーカス
            loginBtn.focus();
        }
    });

    userId.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            if (this.value.length == 5) {
                this.blur();
                loginBtn.click();
            }
        }
    });

    // 「ログイン」ボタン押下時の処理
    loginBtn.addEventListener('click', function () {
        // 「ID」テキストフィールドの入力値を取得
        const userIdValue = userId.value;

        if (userIdValue.length == 5) {
            getUserName(userIdValue);
        } else {
            if (userIdValue.length == 0) {
                // エラーメッセージの文言を入力
                showError('IDをにゅうりょくしてください');
            } else {
                // エラーメッセージの文言を入力
                showError('IDは5桁です');
            }
        }
    });

    // 「はい」ボタン押下時の処理
    agreeBtn.addEventListener('click', function () {
        // テキストフィールドの値（入力されたID）を取得
        const userIdValue = userId.value;
        // ログイン履歴スプレッドシートにログを出力
        postLog(userIdValue);
    });
});

// ユーザー名を取得する関数
async function getUserName(userId) {
    showLoader();

    const newUrl = setQueryParams(IDLIST_GAS_URL, { action: 'getUser', userId: userId });

    try {
        const response = await fetch(newUrl);
        const result = await response.json();

        if (result.message) {
            // サーバーエラー発生時
            showError(result.message);
        } else {
            displayUserName(result.result.userName);
        }
    } catch (e) {
        // エラー発生時
        showError('ネットワークに<ruby>接続<rt>せつぞく</rt></ruby>されているか<ruby>確認<rt>かくにん</rt></ruby>してください<br>' + e);
    } finally {
        hideLoader();
    }
}

// ユーザー名を表示する関数
function displayUserName(userName) {
    if (userName) {
        const nickname = document.getElementById('bl_nickname');
        const inputArea = document.getElementById('bl_inputMode');
        const confirmArea = document.getElementById('bl_confirmMode');

        // ニックネームを表示
        nickname.innerText = userName;
        // 入力⇔確認画面表示切り替え
        inputArea.classList.add('bl_hidden');
        confirmArea.classList.remove('bl_hidden');
    }
}

// ブラウザバック時の処理
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        // ローダーを非表示
        hideLoader();
    }
});

// ログイン履歴スプレッドシートにログを出力する関数
async function postLog(userId) {
    // ローダーを表示
    showLoader();

    // 送信パラメータを定義
    const postparam = {
        "method": "POST",
        "Content-Type": "application/json",
        "body": JSON.stringify({
            "userId": userId
        })
    };

    try {
        const response = await fetch(LOG_GAS_URL, postparam);
        const result = await response.json();

        if (result.status == 'sucsess') {
            const nickname = document.getElementById('bl_nickname');
            localStorage.setItem('userId', userId);
            localStorage.setItem('userName', nickname.innerText);
            location.href = './menu.html';
        } else {
            showError(result.message);
        }
    } catch (e) {
        // エラー発生時
        showError('ネットワークに<ruby>接続<rt>せつぞく</rt></ruby>されているか<ruby>確認<rt>かくにん</rt></ruby>してください<br>' + e);
    } finally {
        hideLoader();
    }
}

// エラーを表示する関数
function showError(errMsg) {
    const loginErrorArea = document.getElementsByClassName('bl_loginErrorArea')[0]; // ノーティフィケーションエリア
    const errorMessage = loginErrorArea.getElementsByClassName('c_notification_text')[0].firstElementChild // エラーメッセージ

    // ノーティフィケーションを表示
    loginErrorArea.classList.add('bl_showLoginError');
    // エラーメッセージの文言を入力
    errorMessage.innerHTML = errMsg;
}