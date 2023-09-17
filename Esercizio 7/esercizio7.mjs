import * as fs from 'fs';

fs.writeFile('testo.txt', 'Hello, Fabiola!', (err) => {
  if (err) throw err;
  console.log('File saved!');
});