var event = function(){
    var textcontent = document.getElementById("contents");
    textcontent.select();
    document.execCommand('copy');
    //alert("本文を念のためコピペしました");
    var flgReview = containsStr(textcontent.value,'レビュー');
    var flgCollaboDtl = containsStr(textcontent.value,'collaboDetail');
    var flgFaqDtl = containsStr(textcontent.value,'faqDetail');
	showAlert(flgReview, flgCollaboDtl ,flgFaqDtl);

};
document.getElementsByName("feelingKb")[0].addEventListener("change", event);
document.getElementsByClassName("btn")[3].addEventListener("click", event);

function containsStr(str,chkStr){
    return str.indexOf(chkStr) !== -1;
};

function showAlert(flgReview, flgCollaboDtl ,flgFaqDtl){
    if (flgReview == true || flgCollaboDtl == true || flgFaqDtl == true) {
        var alertTargetStr = '';
        if (flgReview == true) {
            alertTargetStr = alertTargetStr + '「レビュー」 ';
        }
        if (flgCollaboDtl == true) {
            alertTargetStr = alertTargetStr + '「collaboDetail」 ';
        }
        if (flgFaqDtl == true) {
            alertTargetStr = alertTargetStr + '「faqDetail」 ';
        }

        alert("※注意！！" + alertTargetStr + "という文字が含まれています！");
    }
};

document.onkeydown = function (e){
  if ((e.keyCode == 82) && (e.ctrlKey == true)) {
    alert("リロードが走るので、本文を退避しました");
    event();
  }
  if (e.keyCode == 116) {
    alert("リロードが走るので、本文を退避しました");
    event();
  }
};

function getUserRules(userName, jsonObj){
    let ret="";
    for (var i = 0; i < jsonObj.length; i += 1) {
        if (jsonObj[i].name == userName){
        	let linefeededStr = getLineFeededStr(jsonObj[i].text);
            ret = '<div id="userrules"; style="background-color:lightyellow; padding: 10px;">'+linefeededStr+'</div>';
        };
    }
    return ret;
};

function getLineFeededStr(aText) {
    return aText.replace(/\r?\n/g, '<br>');
}

//ここからテスト
var pageTableHeadDash = document.getElementsByClassName('pageTableHeadDash');

var headdivs = pageTableHeadDash[0].getElementsByTagName('div');

var userNameAndBBSName = headdivs[0].getElementsByTagName('b');
var userName = userNameAndBBSName[0].innerText.split(' / ')[0].trim();
//ここにinformationの内容を取得する
//var information=getUserRules(userName);

chrome.runtime.sendMessage({method: 'getItem', key: 'texts'}, function (response) {
  if (response.data) {
    let information=getUserRules(userName,response.data);
    console.log(information);
    headdivs[0].innerHTML=information+headdivs[0].innerHTML;

	foottds = pageTableHeadDash[2].getElementsByClassName('btn');

	foottds[0].outerHTML=foottds[0].outerHTML+information;
  }
});


