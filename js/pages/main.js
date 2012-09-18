var myMask_info = "加载数据中,请稍后...";
var myMask = new Ext.LoadMask(Ext.getBody(), {
			msg : myMask_info
		});
// 模块的数组 用来缓存模块function的
var moduleArray = {};
// 创建树
function createTree(menuItems) {
	for (var i = 0; i < menuItems.length; i++) {
		var id = menuItems[i].id;
		var tree = new Ext.tree.TreePanel({
			rootVisible : false,
			border : false,
			frame : false,
			root : new Ext.tree.AsyncTreeNode({
						id : id,
						disable : true
					}),
			loader : new Ext.tree.TreeLoader({
						dataUrl : contextPath
								+ '/authority/permissionscope!getrolemenu.action'

					})

		});
		var tmp = new Ext.Panel({
					id : "panel_" + id,
					title : menuItems[i].title,
					iconCls : menuItems[i].iconCls,
					autoWidth : true,
					items : [tree]
				});
		Ext.getCmp("west-panel").add(tmp);
		Ext.getCmp("west-panel").doLayout();
		tree.on('click', treeClick);
		tree.on('load', treeLoad);
	}
	myMask.hide();
};
// tree载入后，隐藏遮罩
function treeLoad() {
	myMask.hide();
}
// 点击目录树触发
function treeClick(node, event) {
	event.stopEvent();
	maintab = Ext.getCmp("MainTab");
	if (maintab.items.getCount() >= Global.Config.maxTabs) {
		Ext.Msg.alert("提示", "系统允许同时打开的面板数已经达到极限，请先关闭其它打开的面板再重新进入");
		return false;
	} else {

		// 叶子节点点击不进入链接
		if (node.isLeaf()) {
			myMask.show();
			var moduleId = node.attributes.appclass;

			var n = maintab.getComponent(moduleId);
			if (typeof n != 'undefined') {
				// 如果数组里初始化过此module
				if (moduleArray[moduleId] != undefined) {
					var module = moduleArray[moduleId];
					var moduleInstance = new module();
					var outCmp = maintab.add(moduleInstance);
					maintab.setActiveTab(outCmp);
				}
			} else {
				if (moduleId != "") {

					// ajax请求 来eval一段module的代码 并执行 然后加到tabpanel上
					Ext.Ajax.request({
								method : 'GET',
								url : node.attributes.hrefurl,
								success : function(response) {
									var module = eval(response.responseText);
									moduleArray[moduleId] = module;
									var moduleInstance = new module();
									var outCmp = maintab.add(moduleInstance);
									maintab.setActiveTab(outCmp);
								},
								failure : function(resp, opts) {
									Ext.Msg.alert('错误', respText.error);
								}
							});
				} else {
					var tab = maintab.add({
								xtype : 'iframepanel',
								id : node.attributes.id,
								title : node.attributes.text,
								tabTip : node.attributes.text,
								closable : true,
								loadMask : true,
								frame : true,
								frameConfig : {
									autoCreate : {
										id : 'frame-' + node.attributes.id
									}
								},
								defaultSrc : node.attributes.hrefurl
							});
					maintab.setActiveTab(tab);

				}
			}
			myMask.hide();
		}
	}
};
// 调整tab页内容大小
function onActiveTabSize() {
	// 获取当前活动的tab页的body元素的宽度 (不含任何框架元素)
	var w = Ext.getCmp('MainTab').getActiveTab().getInnerWidth();
	// 获取当前活动的tab页的body元素的高度 (不含任何框架元素)
	var h = Ext.getCmp('MainTab').getActiveTab().getInnerHeight();
	// 获取当活动的tab页的id
	var Atab = Ext.getCmp('MainTab').getActiveTab().id;

	// 获取组件
	var submain = Ext.getCmp(Atab);

	if (submain) {
		submain.setWidth(w);
		submain.setHeight(h);
	}
};
Ext.onReady(function() {
	// 开启提示功能
	Ext.QuickTips.init();
	// 显示遮罩
	myMask.show();
	// 头部panel
	var head = new Ext.Panel({
				region : 'north',
				height : 85,
				border : false,
				html : '<iframe src="' + contextPath
						+ '/login!top.action" frameborder="0" width="100%" />'
			});
	// 脚部panel
	var foot = new Ext.Panel({
		region : 'south',
		border : true, // 要边框
		bodyBorder : true,
		frame : true, // 强制背景色
		height : 27,// 高度
		html : '<iframe src="common/footer.jsp" frameborder="0" width="100%" />'
	});
	// 折叠目录信息
	var menuItems = Ext.util.JSON.decode(menuJSON);

	// 导航菜单
	var leftmenu = new Ext.Panel({
				title : '综合代维系统',
				region : 'west',
				id : 'west-panel',
				split : true,
				collapsible : true,
				width : 200,
				height : 'auto',
				margins : '5 0 5 5',
				cmargins : '5 5 5 5',
				layout : 'accordion',
				text : '载入中...',
				layoutConfig : {
					animate : true
				},
				listeners : {
					'afterexpand' : function(_nowCmp) {
						onActiveTabSize();
					},
					'aftercollapse' : function(_nowCmp) {
						onActiveTabSize();
					}
				}
			});
	// 具体功能面板
	var mainTab = new Ext.TabPanel({
				region : 'center',
				enableTabScroll : true,
				activeTab : 0,
				id : 'MainTab',
				plugins : new Ext.ux.TabCloseMenu(),
				items : [{
					id : 'homePage',
					title : '首页',
					autoScroll : false,
					html : '测试测试'
						// html : '<iframe src="common/index.jsp"
						// frameborder="0" width="100%" />'
					}]
			});
	var viewport = new Ext.Viewport({
				layout : 'border',
				style : 'border:#024459 2px solid;',
				items : [head, foot, leftmenu, mainTab]
			});
	// 创建树
	createTree(menuItems);
});