/** "Är uppgången kraftig eller väntad? TT:s rubrik …" to its opening question, for the cards. The rest is on the topic page. */
export function leadQuestion(text: string): string {
  const end = text.indexOf("?");
  return end === -1 ? text : text.slice(0, end + 1);
}
