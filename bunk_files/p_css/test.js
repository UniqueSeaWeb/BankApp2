





const db = new Dexie('TestAppDB');

db.version(1).stores({
    TestDB: '++number, timeStump, userId, amount, balance'
});

const testTable = db.table('TestDB');

const depositAmount =  document.getElementsByClassName('test_detail_depositAmount')[0];
const balanceAmount =  document.getElementsByClassName('test_detail_balanceAmount')[0];



const deployUrl ='https://script.google.com/macros/s/AKfycbzeTxaHCM0GhsxYywR13LzjgVo3nDfFJNwCABu73fAB90IR7UA7cq-KJmtBl4DXLmgV/exec';


fetch(deployUrl).then(function(response) {
    const dataList = response.json();
    console.log(dataList);
}).then(function() {
    // testTable.open();
    testTable.put(deployUrl,'number');
    testTable.orderBy('timeStump').each(function(test) {
        let newElement = document.createElement('p');
        newElement.innerText = test.amount; 
        depositAmount.appendChild(newElement);
    });
    // testTable.close();
    console.log('end');
});



