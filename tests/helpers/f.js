import { A } from '@ember/array';

function generateContent(length) {
  const startFrom = arguments.length > 1 ? arguments[1] : 0;
  const ret = A([]);
  for (let i = startFrom; i < startFrom + length; i++) {
    const charCode = 65 + (i % 15);
    ret.push({
      reversedIndex: startFrom + length - i,
      id: i,
      chars: String.fromCharCode(charCode) + String.fromCharCode(charCode + 1),
    });
  }
  return ret;
}

export { generateContent };
