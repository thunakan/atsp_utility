console.log('this is background script');
localStorage.textId = localStorage.textId || 1;


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("background request");
  switch (request.method) {
    case 'getLength': // 保存されているデータ数を取得
      sendResponse({data: localStorage.length});
      break;
    case 'getKeyName': // 指定されたn番目のkey名を取得
      sendResponse({data: localStorage.key(request.number)});
      break;
    case 'getItem': // 指定されたkeyの値を取得
      sendResponse({data: JSON.parse(localStorage.getItem(request.key))});
      break;
    case 'setItem': // 指定されたkeyと値を保存（更新）
      sendResponse({data: localStorage.setItem(request.key, request.value)});
      break;
    case 'removeItem': // 指定されたkeyの値を削除
      sendResponse({data: localStorage.removeItem[request.key]});
      break;
    default:
      console.log('no method');
      break;
  }
});
