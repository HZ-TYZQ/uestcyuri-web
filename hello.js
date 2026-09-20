const greetings = [
  '你好，世界！',
  '欢迎来到 UESTC Yuri Web！',
  '祝你今天写代码顺利！',
];

const greeting = greetings[Math.floor(Math.random() * greetings.length)];
console.log(greeting);
