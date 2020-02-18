var Tree = {

	el:$('#texts-tree'),
	dom:document.getElementById('texts-tree'),
	clearSelections:	function() {		
		$('li', this.el).removeClass('selected');
	},
	load:	function(folder) {
	
		// loop through each item
		for (var i=0, ilen=folder.length; i<ilen; i++) {
			
			// get current item
			var text = folder[i];
			
			// add it
			Node.add(text);
			
			if ('folder' === text.type) {
				
				this.load(text.items);
				
			}
		}
	},
	reload:	function(noSelect) {
			
			// get selected id
			var selectedId = Node.selected && Node.selected.dataset.id || null;
			
			// remove all children
			this.el.empty();
			
				
			// rebuild
			this.load(TextStore.getTexts());
			
			if (!noSelect && selectedId) {
				Node.select(document.getElementById('texts-text' + selectedId));
			}
			else {
				this.clearSelections();
			}
			
		}

};

var TextStore = {
	texts  : null,
	getTexts : function() {
		if (null === this.texts) {
			var texts = [];
			if (localStorage.texts) {
				texts = JSON.parse(localStorage.texts);
			}
			this.texts = texts;
		}
		return this.texts;
	},
	setTexts : function(texts) {
		if (texts) {
			this.texts = texts;
		}
		localStorage.texts = JSON.stringify(this.texts);
	},
	nextId : function () {
		if (typeof localStorage['textId'] === 'undefined') {
			localStorage['textId']  = 0;
	    }
		return ++localStorage.textId;
	},
	initializeId : function () {
		localStorage['textId']  = 0;
	},
	getDefaultText : function (type) {
		return {
			id : this.nextId(),
			name : SettingsStore.get('defaultText'),
			type : type,
			text : ''
		};
	}
};

var Node = {
	add: function(text,select) {
        //alert(text);
		var li = document.createElement('li');
		var $li = $(li).addClass(text.type)
		               .attr('id','text_' + text.id )
		               .html(text.name);
		li.dataset.id   = text.id;
		li.dataset.type = text.type;
		li.dataset.name = text.name;
		li.dataset.text = text.text;
		// select node
		if (true === select) {
			this.select(li);
		}
		Tree.el.append(li);
		return li;
	},
	selected : null,
	select:	function(dom) {
		
		// record selection
		this.selected = dom;
			
		// clear active selections
		Tree.clearSelections();
			
	
		// add selected class
		$(dom).addClass('selected');
			
		// show content
		//Content.show(dom.dataset);
		$('#texts-content').show();
		$('#texts-name').val(dom.dataset.name);


		// filter folder select
		//Folder.filter(dom.dataset.id);
			
//			Toolbar.up();
//			Toolbar.down();
			
		}
};

var addbutton = document.getElementById('texts-toolbar-text-add');
addbutton.onclick = 
function () {
	clearbutton.onclick();
    //alert('add click');
    //localStorage.setItem('test',"test string.");
    //Node.add($('#texts-name').val(),true);
	Node.add(TextStore.getDefaultText('text'),true);
};

var moveupbutton = document.getElementById('texts-toolbar-move-up');
moveupbutton.onclick = 
function () {
	//alert(localStorage.getItem('test'));
	//alert("localStoragetest");
};

var savebutton = document.getElementById('texts-button-save');
savebutton.onclick = 
function () {
    localStorage.textsName = $('#texts-name').val();
    localStorage.textsText = $('#texts-text').val();
    
    var tmpitem = document.getElementById('texts-tree');
    //tmpitem.childNode[0].appendChild(document.createTextNode(document.getElementById('texts-name').value));
};

var loadbutton = document.getElementById('texts-button-load');
loadbutton.onclick = 
function () {
    $('#texts-name').val(localStorage.textsName);
    $('#texts-text').val(localStorage.textsText);
};

var deletebutton = document.getElementById('texts-button-delete');
deletebutton.onclick = 
function () {
	//$('#texts-content')
    //        .find("input, select, textarea")
    //        .not(":button, :submit, :reset, :hidden")
    //        .val("");
    var removeNode = Node.selected;
    removeNode.remove();
    $('#texts-content').hide();
    saveJSONbutton.onclick();
    $('#texts-tree').empty();
    Tree.load(TextStore.getTexts());
    
};

var clearbutton = document.getElementById('texts-button-clear');
clearbutton.onclick = 
function () {
	$('#texts-content')
            .find("input, select, textarea")
            .not(":button, :submit, :reset, :hidden")
            .val("");
};

var showbutton = document.getElementById('texts-toolbar-show-contents');
showbutton.onclick = 
function () {
    //alert('start show');
    $('#texts-content').show();
};	

var updatebutton = document.getElementById('texts-button-update');
updatebutton.onclick = 
function () {
    //alert('start show');
    Node.selected.innerText = $('#texts-name').val();
	Node.selected.dataset.name = $('#texts-name').val();
	Node.selected.dataset.text = $('#texts-text').val();
	saveJSONbutton.onclick();
};

var textstree = document.getElementById('texts-tree');
textstree.onclick = 
function () {
	$('#texts-tree li').click(function() {
		//var text = $(elem).text();
		Node.select(this);
		$('#texts-name').val(Node.selected.dataset.name);
		$('#texts-text').val(Node.selected.dataset.text);
	});
};

var tostrbutton = document.getElementById('to-string-button');
tostrbutton.onclick = 
function () {
    //$('#save-string-text').val($('#texts-tree li').dataset.text);

	var tmpStrArray = [];
	$('#texts-tree li').each(function(i,elem){
		tmpStrArray.push({  "id" : elem.dataset.id,
							"type" : elem.dataset.type,
							"name" : elem.dataset.name,
							"text"  : elem.dataset.text}); 
	});
	//console.log(JSON.stringify(tmpStrArray));
	$('#save-string-text').val(JSON.stringify(tmpStrArray));
};
var saveJSONbutton = document.getElementById('save-json-button');
saveJSONbutton.onclick = 
function () {
	var tmpStrArray = [];
	$('#texts-tree li').each(function(i,elem){
		tmpStrArray.push({  id : elem.dataset.id,
							type : elem.dataset.type,
							name : elem.dataset.name,
							text  : elem.dataset.text}); 
	});
	TextStore.setTexts(tmpStrArray);

};

Tree.load(TextStore.getTexts());

//var firstExec = function () {$('#texts-tree li').each(function(i,elem){
//	//console.log(i);
//	if (i === 0) {elem.click();}
//})};
//setTimeout(firstExec,3000);


	// expose reload for other sections
	window.reloadTextsTree = function() {
		Tree.reload.call(Tree);
	};

///////////////////////////////////////////////////
//‚±‚±‚©‚çSideMenu
///////////////////////////////////////////////////
var sideMenu = function() {
	
	// sidebar
	$('#tab-container').on('click','div' , function(e) {
		
		// remove active
		$('div.active', '#tab-container').removeClass('active');
		
		// add active
		$(this).addClass('active');
		
		// hide current content
		$('div.tab-content.show').removeClass('show');
		
		// show selected content
		$('#' + this.dataset.content).addClass('show');
		
	});
	
	var toasting = false;
	
	/**
	 * toast
	 */
	window.toast = function(text) {
		
		if (!toasting) {
			
			toasting = true;
			
			$('#toast').html(text || 'Update successful');
		
			$('#toast')
				.show()
				.animate({
					top: '+=55'
				}, 500)
				.delay(1000)
				.animate({
					top: '-=55'
				}, 500, function() {
					$('#toast').hide();
					toasting = false;
				});
				
		}
		
	};
		
	
};

sideMenu();

///////////////////////////////////////////////////
//‚±‚±‚©‚çSideMenu
///////////////////////////////////////////////////
var SettingsStore = {
	
	settings:	null,
	
	getSettings:	function() {
		
		if (null === this.settings) {

			var settings = localStorage.settings;

			if (settings) {			
				settings = JSON.parse(settings);
			}
			else {
				settings = {};			
			}
			
			this.settings = settings;
			
		}
		
		return this.settings;
		
	},
	
	setSettings:	function() {
		
		localStorage.settings = JSON.stringify(this.getSettings());
		
	},
	
	init:	function() {
		
		var settings = this.getSettings();
		
		if (!settings.hasOwnProperty('defaultText')) {
			settings.defaultText = 'DefaultText';
		}
		
		this.setSettings();
		
	},
	
	set:	function(name, value) {
		
		var settings = this.getSettings();
		
		settings[name] = value;
		
		this.setSettings();
		
	},
	
	get:	function(name) {
		
		var settings = this.getSettings();
		
		return settings[name];
		
	}
	
};

SettingsStore.init();

var settings = function() {
	// defaultText
	//$('#save-setting-button').click =  function() {
	//	SettingsStore.set('defaultText', $('#setting-defaultText').val());
	//};
	var saveSettingsButton = document.getElementById('save-setting-button');
	saveSettingsButton.onclick = 	function () {
		SettingsStore.set('defaultText', $('#setting-defaultText').val());
	};

	$('#setting-defaultText')
		.val(SettingsStore.get('defaultText'));
};

settings();

	var Export = {
		
		Empty:	function() {
			return '';
		},
		
		ExportSettings:	function() {
			return JSON.stringify(TextStore.getTexts());
		}
		
	};
	
	$('#export-setting-button').bind('click', function(e) {
		$('#export-contents')
			.val(Export['ExportSettings']());
		
	});
	
	var Import = {
		
		Empty:	function() {
			$('#dialog')
				.html('Please select a format')
				.dialog({
					modal:		true,
					resizable:	false,
					title:		'Error',
					width:		200,
					height:		60
				});
			return false;
		},
		
		ImportSettings:	function(contents, type) {
			var error = "";
			// check format
			if (!/^\[\{"id"\:.+\}\]$/.test(contents)) {
				error = 'Content does not appear to be in the correct format';
			}
			try {
				JSON.parse(contents);
			}
			catch (e) {
				error = 'Content does not appear to be in the correct format';
			}
			
			if (error) {
				$('#dialog')
					.html(error)
					.dialog({
						modal:		true,
						resizable:	false,
						title:		'Error',
						width:		250,
						height:		75
					});
				return false;
			}
			
			// re-assign ids
			var reassignIds = function(folder, parent) {
				for (var i=0,ilen=folder.length; i<ilen; i++) {
					var text = folder[i];
					text.id = TextStore.nextId();
					if (parent) {
						text.parent = parent;
					}
					if (text.items) {
						reassignIds(text.items, text.id);
					}
				}
			}
			var texts = JSON.parse(contents);
			TextStore.initializeId();
			reassignIds(texts);
			if (type == 'Overwrite') {
				TextStore.setTexts(texts);
			}
			toast('Import successfully');
			return true;
		}
		
	};
	
	$('#import-button')
		.bind('click', function(e) {
			var contents = $('#import-contents').val().trim();
			if (contents.length === 0) {
				$('#dialog')
					.html('Please enter content to import')
					.dialog({
						modal:		true,
						resizable:	false,
						title:		'Error',
						width:		200,
						height:		75
					});
				return false;
			}
			if (Import['ImportSettings'](contents, 'Overwrite')) {
				reloadTextsTree();
				$('#import-contents').val('');
				$('#import-file').val('');
			}
		});
		
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		$('#import-file').bind('change', function(e) {
			var files = e.target.files;
			
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#import-contents').val(e.target.result);
			};
			reader.readAsText(files[0]);
			
		});
	}
	else {
		$('#import-file-container').remove();
	}
	
