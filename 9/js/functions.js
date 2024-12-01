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

function isMeetingDuringWork(startDay, endDay, startMeeting, durationMeeting){
  function timeToMinutes(timeStr){
    const [hours, mitutes] = timeStr.Split(':').Map(Number);
    return hours * 60 + mitutes;
  }
  const endMeeting = timeToMinutes(startMeeting) + durationMeeting;
  return timeToMinutes(startDay) <= timeToMinutes(startMeeting) && endMeeting <= timeToMinutes(endDay);
}
isMeetingDuringWork();
