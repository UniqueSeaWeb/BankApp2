/** アカウント一覧 **/

/* ↓開発用URL */
const IDLIST_GAS_URL = 'https://script.google.com/macros/s/AKfycbyu4JVtJzrqj4oiwhWebuScxrZK8wnCaXJ3ufNQM0If9BWpX4Vj1BJhRUkNIGkC04k/exec';
/* ↑開発用URL */
var userDataList = [];

window.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('bal_searchInput'); // 検索欄
    const searchBtn = document.getElementById('bal_searchBtn'); // 検索ボタン
    const sortUserId = document.getElementById('bal_sortUserId'); // 銀行口座番号で並べ替えボタン
    const sortTimestamp = document.getElementById('bal_sortTimestamp'); // 口座登録日時で並べ替えボタン
    const reloadBtn = document.getElementById('bal_reloadBtn'); // 再読み込みボタン
    const topBtn = document.getElementById('bal_topBtn'); // トップへ戻るボタン

    // ローダーを生成
    createLoader('よみこみ<ruby>中<rt>ちゅう</rt></ruby>');
    // 全てのユーザーデータを取得
    getAllUsers();

    // 検索欄に入力時の処理
    searchInput.addEventListener('input', function () {
        const sujestList = document.getElementById('bal_seachSujestList');
        sujestList.parentElement.classList.add('bal_hideSeachSujest');
        sujestList.innerHTML = '';

        const uniqueNames = Array.from(new Set(userDataList.map(user => user.userName))).sort();

        if (this.value) {
            for (let i = 0; i < uniqueNames.length; i++) {
                if (String(uniqueNames[i]).includes(this.value)) {
                    let li = document.createElement('li');

                    li.innerHTML = `
                        <a href="javascript:void(0);" tabIndex="0";>
                            <p>${uniqueNames[i]}</p>
                        </a>
                    `;

                    li.addEventListener('click', clickSujest);
                    sujestList.appendChild(li);
                    sujestList.parentElement.classList.remove('bal_hideSeachSujest');
                }
            }
        }

        function clickSujest() {
            const searchInput = document.getElementById('bal_searchInput');
            const sujestList = document.getElementById('bal_seachSujestList');

            searchInput.value = this.firstElementChild.innerText;
            sujestList.parentElement.classList.add('bal_hideSeachSujest');
        }
    });

    // 検索ボタン押下時の処理
    searchBtn.addEventListener('click', function () {
        const searchInput = document.getElementById('bal_searchInput');

        showLoader();

        const sujestList = document.getElementById('bal_seachSujestList');
        const userList = document.getElementById('bal_userList');
        const numOfUsersElm = document.getElementById('bal_numOfUsers');
        let numOfUsers = 0;

        sujestList.parentElement.classList.add('bal_hideSeachSujest');

        for (let i = 0; i < userList.children.length; i++) {
            if (String(userList.children.item(i).getElementsByClassName('bal_userName')[0].innerText).includes(searchInput.value)) {
                userList.children.item(i).classList.remove('bal_userListHidden');
                numOfUsers++; 
            } else {
                userList.children.item(i).classList.add('bal_userListHidden');
            }
        }

        numOfUsersElm.innerText = numOfUsers;

        hideLoader();
    });

    // 銀行口座番号で並べ替えボタン押下時の処理
    sortUserId.addEventListener('change', function () {
        const userList = document.getElementById('bal_userList');
        const liList = Array.from(userList.children);

        function getUserId(listElement) {
            return parseInt(listElement.getElementsByClassName('bal_userId')[0].innerText);
        }

        if (this.checked) {
            liList.sort((a, b) => getUserId(a) - getUserId(b));
        } else {
            liList.sort((a, b) => getUserId(b) - getUserId(a));
        }
        userList.append(...liList);
    });

    // 口座登録日時で並べ替えボタン押下時の処理
    sortTimestamp.addEventListener('change', function () {
        const userList = document.getElementById('bal_userList');
        const liList = Array.from(userList.children);

        function getTimestamp(listElement) {
            return new Date(listElement.getElementsByClassName('bal_timestamp')[0].innerText);
        }

        if (this.checked) {
            liList.sort((a, b) => getTimestamp(a) - getTimestamp(b));
        } else {
            liList.sort((a, b) => getTimestamp(b) - getTimestamp(a));
        }
        userList.append(...liList);
    });

    // 再読み込みボタン押下時の処理
    reloadBtn.addEventListener('click', function () {
        getAllUsers();
    });

    // トップへ戻るボタン押下時の処理
    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// 全てユーザー情報を取得する関数
async function getAllUsers() {
    showLoader();

    const newUrl = setQueryParams(IDLIST_GAS_URL, { action: 'getAllUsers' });

    try {
        const response = await fetch(newUrl);
        const result = await response.json();

        if (result.message) {
            console.log('サーバーエラー発生');
            console.log(result.message);
        } else {
            displayUserData(result.result);
        }
    } catch (e) {
        console.log('エラー発生');
        console.log(e);
        window.alert('ネットワークにせつぞくされているかかくにんしてください');
    } finally {
        hideLoader();
    }
}

// ユーザー情報を表示する関数
function displayUserData(users) {
    const userList = document.getElementById('bal_userList');
    const numOfUsersElm = document.getElementById('bal_numOfUsers');
    let numOfUsers = 0;
    
    userList.innerHTML = '';
    userDataList = [];

    for (let i = users.length - 1; i >= 0; i--) {
        userDataList.push(
            {
                userId: users[i].userId,
                userName: users[i].userName,
                timestamp: users[i].timestamp,
                birthday: users[i].birthday
            }
        );

        let li = document.createElement('li');
        li.innerHTML = `
            <div class="bal_userCard">
                <p class="bal_typo_userName bal_userName">${users[i].userName}</p>
                <div class="bal_userCardContents">
                    <table>
                        <tbody>
                            <tr>
                                <td><img src="../bunk_files/p_image/ID_Card.svg"/></td>
                                <td>
                                    <p class="bal_typo_userContentsTtl">銀行口座番号</p>
                                </td>
                                <td>
                                    <p class="bal_typo_userContentsDetail bal_userId">${users[i].userId}</p>
                                </td>
                            </tr>
                            <tr>
                                <td><img src="../bunk_files/p_image/birthday.svg"/></td>
                                <td>
                                    <p class="bal_typo_userContentsTtl">たんじょう日</p>
                                </td>
                                <td>
                                    <p class="bal_typo_userContentsDetail bal_birthday">${users[i].birthday}</p>
                                </td>
                            </tr>
                            <tr>
                                <td><img src="../bunk_files/p_image/calendar.svg"/></td>
                                <td>
                                    <p class="bal_typo_userContentsTtl">口座登録日時</p>
                                </td>
                                <td>
                                    <p class="bal_typo_userContentsDetail bal_timestamp">${users[i].timestamp}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        userList.appendChild(li);

        numOfUsers++;
    }

    numOfUsersElm.innerText = numOfUsers;

    if (users.length == 0) {
        const li = document.createElement('li');
        const p = document.createElement('p');
        p.classList.add('bal_typo_noUser');
        p.innerText = '登録されたユーザーは存在しません';
        li.appendChild(p);
        userList.appendChild(li);
    }
}
