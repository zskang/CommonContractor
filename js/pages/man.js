Ext.onReady(function() {
	var westPanel = new Ext.tree.TreePanel({
				width : 180,
				id : 'homeTree',
				region : 'west',
				minSize : 100,
				maxSize : 300,
				animate : true,
				collapsible : true,
				loadMask : {
					msg : '数据加载中...'
				},
				border : false,
				rootVisible : false,
				lines : false,
				autoScroll : false,
				tools : [{
							id : 'refresh', // 刷新按钮
							handler : onRefreshTreeNodes,
							scope : this
						}],
				root : new Ext.tree.AsyncTreeNode({
							id : 'root',
							loader : new Ext.tree.TreeLoader({
										dataUrl : contextPath
												+ '/authority/userinfo!menu.action', // 调用controller的方法，加载树的数据项
										listeners : {
											"beforeload" : function(treeloader,
													node) {
												treeloader.baseParams = {
													method : 'POST',
													nodeid : node.id
												};
											}
										}
									})
						}),
				listeners : {
					"click" : function(node, event) {
						// 叶子节点点击不进入链接
						if (node.isLeaf()) {
							// 显示叶子节点菜单
							event.stopEvent();
							if (node.attributes.href == "") {
								var obj = eval(node.attributes.modulecode);
								obj(node);
							} else {
								var tab = contentPanel
										.getItem('tab_' + node.id);

								if (!tab) {
									var tab = contentPanel.add({
										id : 'tab_' + node.id,
										xtype : "htmlpanel",
										title : node.text,
										closable : true,
										layout : "fit",
										loadMask : {},
										closable : true,
										defaultSrc : contextPath
												+ node.attributes.href
											// html : "<iframe src='"
											// +
											// + "' scrolling='auto'
											// frameborderj=0 width=100%
											// height=100%></iframe>"

										});
								}
								contentPanel.setActiveTab(tab);
							}
						} else {
							// 不是叶子节点不触发事件
							event.stopEvent();
							// 点击时展开
							node.toggle();
						}

					}

				},
				'afterexpand' : function(_nowCmp) {
					onActiveTabSize();
				},
				'aftercollapse' : function(_nowCmp) {
					onActiveTabSize();
				}
			});
	function onRefreshTreeNodes() {
		Ext.getCmp("homeTree").root.reload();

	};
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
	// 上部页面Head部局
	var northPanel = new Ext.Panel({
		region : 'north',
		bodyBorder : true,
		height : 85,
		border : true,
		html:'<iframe src="'+contextPath+'/login!top.action" frameborder="0" width="100%" />'
		//html : '<div class="top"><div class="top_left"><div class="top_sys_name">综合代维管理系统</div></div><div class="top_right_bgimg"></div></div>'
	});
	// 右边具体功能面板区
	var contentPanel = new Ext.TabPanel({
		region : 'center',
		enableTabScroll : true,
		activeTab : 0,
		id : 'MainTab',
		plugins : new Ext.ux.TabCloseMenu(),
		items : [{
			id : 'homePage',
			title : '首页',
			autoScroll : false,
			html : '<div style="position:absolute;color:#ff0000;top:40%;left:40%;">通用权限平台DEMO</div>'
		}]
	});
	new Ext.Viewport({
				layout : 'border', // 使用border布局
				defaults : {
					activeItem : 0
				},
				items : [northPanel, westPanel, contentPanel, {
						region : "south", // 南方布局
						xtype : "panel", // 用panel作为容器
						border : true, // 要边框
						bodyBorder : true,
						frame : true, // 强制背景色
						height : 27,// 高度
						html:'<iframe src="common/footer.jsp" frameborder="0" width="100%" />'
						//html : "<div align=\"right\"><font color=\"#15428b\">Copyright? 2004-2011 北京鑫干线网络科技发展有限公司</font></div>"
					}]
			});
})