/** メニュー選択画面 **/
function formatNumberWithCommas(number) {
    // 数値を文字列に変換し、逆順にして桁区切りを追加する
    const strNumber = number.toString();
    let formattedNumber = '';

    for (let i = strNumber.length - 1, count = 1; i >= 0; i--, count++) {
        formattedNumber = strNumber[i] + formattedNumber;
        if (count !== 0 && count % 3 === 0 && i !== 0) {
            formattedNumber = ',' + formattedNumber; // 3桁ごとにカンマを追加
        }
    }

    return formattedNumber;
}

/* 顔アイコン切り替え */
function changeFace(amount) {
    if (amount >= 0) {
        const goodFaceIcon = document.getElementsByClassName('bm_goodFaceIcon')[0];
        goodFaceIcon.classList.add('bm_showFaceIcon');
    } else {
        const badFaceIcon = document.getElementsByClassName('bm_badFaceIcon')[0];
        badFaceIcon.classList.add('bm_showFaceIcon');
    }
}

/* DBから値を取得して表示 */
window.addEventListener('DOMContentLoaded', function () {
    // ローダーの生成
    createLoader('よみこみ<ruby>中<rt>ちゅう</rt></ruby>');

    // IDの認証
    // const userId = this.localStorage;
    // const nameDeployUrl = 'https://script.google.com/macros/s/AKfycbyZktHo5yEeM3MRwe8CQ_Ym4c8MNV1GIM1qF01ViLEgCFV4l2sSYiepJkVac2so4f4L/exec';
    // let queryParams = {
    //     id: userId
    // };

    // const newNameUrl = setQueryParams(nameDeployUrl, queryParams);
    // fetch(newNameUrl).then(function (nameResponse) {
    //     // レスポンスデータをJSON形式に変換
    //     return nameResponse.json();
    // }).then(function (nameData) {
    //     const name = nameData.content;
    //     const nameElement = document.getElementById('bm_nameValue');
    //     nameElement.innerText = name;
    // }).then(function () {
    // const amountDeployUrl = 'https://script.google.com/macros/s/AKfycbxWNd3mbrOy7feXkLnWgfrWvGrSXX9jC_yebsJ-0LfYnWeiQfl41s1Fz_0xTim8m3OhnA/exec';
    // const newAmountUrl = setQueryParams(amountDeployUrl, queryParams);
    // fetch(newAmountUrl).then(function (amountResponse) {
    //     // レスポンスデータをJSON形式に変換
    //     return amountResponse.json();
    // }).then(function (amountData) {
    //     const amount = Number(amountData.content);
    //     const amoountElement = document.getElementById('bm_amountValue');
    //     amoountElement.innerText = formatNumberWithCommas(amount);
    //     changeFace(amount);
    // }).then(function () {
    //     // ローダーの非表示
    //     hideLoader();
    // }).catch(function (error) {
    //     window.alert('ネットワークにせつぞくされているかかくにんしてください');
    // });
    // }).catch(function (error) {
    //     // ローダーの非表示
    //     hideLoader();
    //     window.alert('ネットワークにせつぞくされているかかくにんしてください');
    // });

    // 名前の表示処理
    let userName = '';
    let userId = '';
    try {
        userName = localStorage.getItem('userName');
        userId = localStorage.getItem('userId');
    } catch (error) {
        userName = '---';
    } finally {
        const nameElement = document.getElementById('bm_nameValue');
        nameElement.innerText = userName;
        // 残高の表示処理
        // テスト環境
        // const defaultDeployUrl = 'https://script.google.com/macros/s/AKfycbyeFYeMYV_CEyQ75PT1cLDtFlK_MBhxScO6X8GrChy7P1YopkEVv1H2kr5Dhxzg1YK_/exec';
        // 本番環境
        const defaultDeployUrl = 'https://script.google.com/macros/s/AKfycbxO78cBBcTQkZ2Nrrf-naPtk7tY-UVTiODeg8bsWOgG7zfDse6NPgwl5KoOxhGS4Zc5IQ/exec';
        const idDeployUrl = setQueryParams(defaultDeployUrl, { id: userId });
        let amountParams = {
            action: 'GetTotalAmount'
        }
        const amountDeployUrl = setQueryParams(idDeployUrl, amountParams);
        fetch(amountDeployUrl).then(function (amountResponse) {
            // レスポンスデータをJSON形式に変換
            return amountResponse.json();
        }).then(function (amountData) {
            const amount = Number(amountData.content);
            const amoountElement = document.getElementById('bm_amountValue');
            amoountElement.innerText = formatNumberWithCommas(amount);
            localStorage.setItem('amount', formatNumberWithCommas(amount));
            changeFace(amount);
        }).then(function () {
            // ローダーの非表示
            hideLoader();
        }).catch(function (error) {
            window.alert('ネットワークにせつぞくされているかかくにんしてください');
        });
    }
});

/* ログアウト */
const logoutLink = document.getElementById('com_logoutLink');

logoutLink.addEventListener('click', function () {
    let result = window.confirm('ほんとうにログアウトしますか？\n※ログインがめんにもどります');
    if (result) {
        this.href = './login.html';
    }
});

/* 残高画面・フォームへ遷移時にIDをクエリパラメータとして付与 */
window.addEventListener('DOMContentLoaded', function () {
    const userId = localStorage.getItem('userId');
    const historyLink = document.getElementById('bm_historyBtn');
    const formLink = document.getElementsByClassName('bm_menuBtn');

    // historyLink.addEventListener('click', function () {
    //     location.href = setQueryParams('./history.html', { id: userId });
    // });

    for (let i = 0; i < formLink.length; i++) {
        formLink[i].addEventListener('click', function () {
            let oldLink = formLink[i].href;
            let newLink = setQueryParams(oldLink, { 'entry.1853001129': userId });
            this.href = newLink;
        });
    }
});

/* ブラウザバック時のローダー非表示 */
window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        hideLoader();
    }
});