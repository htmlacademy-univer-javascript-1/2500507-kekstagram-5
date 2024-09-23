const checkStringLength = (string, length) => string.length <= length;
checkStringLength();
function isPalindrome(string){
  const normalString = string.replaceAll(' ','').toLowerCase();
  let reverseString = '';
  for (let i = normalString.length - 1; i >= 0; i--){
    reverseString += normalString[i];
  }
  return reverseString === normalString;
}
isPalindrome();
