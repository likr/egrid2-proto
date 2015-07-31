import kuromoji from 'kuromoji';

export default new Promise((resolve, reject) => {
  const builder = kuromoji.builder({dicPath: 'dict/'});
  builder.build((error, tokenizer) => {
    if (error) {
      reject(error);
    } else {
      resolve(tokenizer);
    }
  });
});
