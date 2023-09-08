const crypto = require("crypto");
const min = 1;
const max = 100;
const Id = crypto.randomInt(min, max);
console.log(Id);
