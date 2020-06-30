export function toHexString(byteArray: any): string {
  return Array.from(byteArray, function (byte: any) {
    return (byte & 0xff).toString(16).slice(-2);
  }).join('');
}
