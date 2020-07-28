export default function getKeywordsString(arr) {
  // очистим массив от дубликатов
  const uniqKeywords = Array.from(new Set(arr));
  let subtitleString='По ключевым словам: ';

  // теперь определим длинну массива
  const countKeywords = uniqKeywords.length;

  if (countKeywords > 2) {
    // если больше двух то формируем фразу "и еще Х другим"
    const restOfKeywords = countKeywords - 2;
    subtitleString = subtitleString + `${uniqKeywords[0]}, ${uniqKeywords[1]} и ${restOfKeywords} другим`;
  } else {
    // если одно или два слова просто их выводим
    for (let i=0; i<countKeywords; i++) {
      subtitleString = subtitleString + uniqKeywords[i];
      if (i!==countKeywords-1) {
        subtitleString = subtitleString+', ';
      }
    }
  }
  return subtitleString;
}