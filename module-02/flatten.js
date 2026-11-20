// Is a string stored as one flat block of characters? Plain JavaScript, because
// %StringIsFlat is a V8 debugging helper: node --allow-natives-syntax flatten.js
let s = "";
for (let i = 0; i < 5; i++) s += `req ${i}\n`;
console.log("after five +=          flat:", %StringIsFlat(s));
console.log("read s.length (" + s.length + ")    flat:", %StringIsFlat(s));
s.charCodeAt(0);
console.log("after s.charCodeAt(0)  flat:", %StringIsFlat(s));
s += "req 5\n";
console.log("after one more +=      flat:", %StringIsFlat(s));
