if (!Global.platformResourceLoader) {
	Global.platformResourceLoader = new Ext.tree.TreeLoader({
				dataUrl : contextPath
						+ '/authority/permissionitem!getpermissiontree.action'

			})
};
// 系统资源列表
SystemResourceListPanel = Ext.extend(JsonGrid, {
			dlgWidth : 400,
			dlgHeight : 400,
			title : '资源列表',
			groupfield : '',
			gridConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '资源名称',
						name : 'permissionname'
					}, {
						fieldLabel : '资源代码',
						name : 'permissioncode'
					}, {
						fieldLabel : '备注',
						name : 'remark'
					}],
			winowConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '资源名称',
						maxLength:18,
						allowBlank:false,
						name : 'permissionname'
					}, {
						fieldLabel : '资源代码',
						maxLength:18,
						allowBlank:false,
						name : 'permissioncode'
					}
					, {
						fieldLabel : '备注',
						maxLength:150,
						name : 'remark'
					}],
			urlPagedQuery : contextPath
					+ '/authority/permissionitem!alllist.action',
			urlSave : contextPath + '/authority/permissionitem!save.action',
			urlLoadData : contextPath + '/authority/permissionitem!view.action',
			urlRemove : contextPath + '/authority/permissionitem!delete.action'
		});

// 系统资源管理管理
SystemResourcePanel = function() {
	this.list = new SystemResourceListPanel({
				id : 'SystemResourceListPanel ',
				region : "center"
			});
	this.tree = new Ext.tree.TreePanel({
				title : "所有资源",
				region : "west",
				autoScroll : true,
				width : 200,
				border : false,
				margins : '0 2 0 0',
				tools : [{
							id : "refresh",
							handler : function() {
								this.tree.root.reload();
							},
							scope : this
						}],
				root : new Ext.tree.AsyncTreeNode({
							id : "root",
							text : "所有资源",
							iconCls : 'treeroot-icon',
							expanded : true,
							loader : Global.platformResourceLoader
						})
			});
	this.tree.on("click", function(node, eventObject) {
				var id = (node.id != 'root' ? node.id : "");
				this.list.store.baseParams.parentId = id;
				this.list.store.removeAll();
				this.list.store.load();
			}, this);
	SystemResourcePanel.superclass.constructor.call(this, {
				id : "SystemResourcePanel",
				closable : true,
				title : '资源管理',
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.list],
				onDestroy:function() {
					if (this.rendered) {
						if (this.tree) {
							this.tree.destroy();
							this.tree=null;
							delete this.tree;
						}
					}
					SystemResourcePanel.superclass.onDestroy.call(this);
				}
			});

};
Ext.extend(SystemResourcePanel, Ext.Panel, {});
