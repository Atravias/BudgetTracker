const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

var db;

const dbRequest = indexedDB.open("budget", 1);


dbRequest.onupgradeneeded = function (event) {
    const db = event.target.result;

    db.createObjectStore("pending", { autoIncrement: true });
};

dbRequest.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};


dbRequest.onerror = function (event) {
    console.log(event.target.errorCode);
};



function saveRecord(res) {
    var transaction = db.transaction(["pending"], "readwrite");
    var store = transaction.objectStore("pending");

    store.add(res);
};






function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const retrieveAll = store.getAll();

    retrieveAll.onsuccess = function () {
        if (retrieveAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(retrieveAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })

                .then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");

                    const store = transaction.objectStore("pending");

                    store.clear();

                });
        }
    };
}


window.addEventListener("online", checkDatabase);