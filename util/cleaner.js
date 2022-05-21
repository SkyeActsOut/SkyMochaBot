const JSONdb = require('simple-json-db');
const db = new JSONdb('skydb.json');

let c = 0
let n = 0

Object.entries(db.JSON()).forEach(e => {

    msgs = JSON.parse(e[1]).msgs

    for (let i = 0; i < msgs.length; i++) { // subtracts one from all
        if (msgs[i] == -33) {
            msgs[i] = 26
            c+=1;
        }
        else if (msgs[i] < 0) {
            msgs[i] = 0
            n+=1;
        }
    }

    db.set(e[0], JSON.stringify({
        msgs: msgs
    }))

})

console.log (`CLEANED UP ${c} ENTRIES`)
console.log (`NULLED ${n} ENTRIES`)