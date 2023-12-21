export const convertCharacters = (str) => {
      const charMap = {
        Ç: 'C',
        Ö: 'O',
        Ş: 'S',
        İ: 'I',
        I: 'i',
        Ü: 'U',
        Ğ: 'G',
        ç: 'c',
        ö: 'o',
        ş: 's',
        ı: 'i',
        ü: 'u',
        ğ: 'g'
      };
  
      let strArray = str.split('');
  
      for (let i = 0; i < strArray.length; i++) {
        strArray[i] = charMap[strArray[i]] || strArray[i];
      }
  
      str = strArray.join('');
  
      return  str.replace(" ", "").replace("-", "").replace(/[^a-z0-9-.çöşüğı]/gi, "");
}