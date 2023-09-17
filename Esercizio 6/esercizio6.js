const figlet = require("figlet");

figlet("Hello Fabiola", function (err, data) {
  if (err) {
    console.log("Si è verificato un errore...");
    console.dir(err);
    return;
  }
  console.log(data);
});
