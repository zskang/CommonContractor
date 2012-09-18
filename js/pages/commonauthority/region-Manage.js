if (!Global.platformRegionLoader) {
	Global.platformRegionLoader = new Ext.tree.TreeLoader({
				dataUrl : contextPath
						+ '/authority/region!getregiontree.action'
			})
};
SystemRegionListPanel = Ext.extend(JsonGrid, {
			sortfield : 'regionid',
			groupfield : 'parentname',
			allowegroup : false,
			allowEdit : false,
			allowDel : false,
			title : '区域列表',
			queryname : 'regionname',
			gridConfig : [{
						fieldLabel : '区域编号',
						name : 'regionid'
					}, {
						fieldLabel : '区域名称',
						name : 'regionname'
					}, {
						fieldLabel : '上级区域',
						name : 'parentname'

					}, {
						fieldLabel : '上级区域ID',
						name : 'parentid',
						hidden : true
					}, {
						fieldLabel : '备注',
						name : 'remark'
					}],
			winowConfig : [{
						fieldLabel : '区域编号',
						name : 'regionid'
					}, {
						fieldLabel : '区域名称',
						name : 'regionname'
					}, {
						xtype : "treecombo",
						fieldLabel : "上级区域",
						name : "parent",
						hiddenName : "parentid",
						displayField : "text",
						valueField : "id",
						tree : new Ext.tree.TreePanel({
									autoScroll : true,
									root : new Ext.tree.AsyncTreeNode({
												id : '000000',
												text : '所有区域',
												loader : Global.platformRegionLoader,
												iconCls : 'treeroot-icon'
											}),
									baseParams : {
										parentId : node.id
									}
								})
					}, {
						fieldLabel : '备注',
						name : 'remark'
					}],
			urlPagedQuery : contextPath + '/authority/region!alllist.action',
			urlSave : contextPath + '/authority/region!save.action',
			urlLoadData : contextPath + '/authority/region!view.action',
			urlRemove : contextPath + '/authority/region!delete.action'
		});
// 系统菜单管理
SystemRegionPanel = function() {
	this.list = new SystemRegionListPanel({
				id : "SystemRegionListPanel",
				region : "center"
			});
	this.tree = new Ext.tree.TreePanel({
				title : "区域树",
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
							id : "000000",
							text : "中国",
							iconCls : 'treeroot-icon',
							expanded : true,
							loader : Global.platformRegionLoader
						})
			});
	this.tree.on("click", function(node, eventObject) {
				var id = (node.id != '000000' ? node.id : "");
				this.list.store.baseParams.pnode = id;
				this.list.store.removeAll();
				this.list.store.load();
			}, this);
	SystemRegionPanel.superclass.constructor.call(this, {
				id : "SystemRegionPanel",
				closable : true,
				title : '区域管理',
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.tree, this.list],
				onDestroy:function() {
					if (this.rendered) {
						if (this.list) {
							this.list.destroy();
							this.list=null;
							delete list;
						}
						if (this.tree) {
							this.tree.destroy();
							this.tree=null;
							delete this.tree;
						}
					}
					SystemRegionPanel.superclass.onDestroy.call(this);
				}
			});

};
Ext.extend(SystemRegionPanel, Ext.Panel, {});
