if (!Global.platformRegionLoader) {
	Global.platformRegionLoader = new Ext.tree.TreeLoader({
		dataUrl : contextPath + '/authority/region!getregiontree.action'
	})
};
if (!Global.platformOrgLoader) {
	Global.platformOrgLoader = new Ext.tree.TreeLoader({
		dataUrl : contextPath + '/authority/organize!getorgtree.action',
		baseParams : {
			pid : ''
		}
	})
};
//所属区域
locationregiontree = new Ext.tree.TreePanel({
	tools : [ {
		id : "refresh",
		handler : function() {
			orgparenttree.root.reload();
		},
		scope : this
	} ],
	autoScroll : true,
	root : new Ext.tree.AsyncTreeNode({
		id : '000000',
		text : '所属区域',
		loader : new Ext.tree.TreeLoader({
			dataUrl : contextPath + '/authority/region!getorgregiontree.action',
			baseParams : {
				pnode : userregion
		    }
		}),
		iconCls : 'treeroot-icon'
	})
});
// 父菜组织
orgparenttree = new Ext.tree.TreePanel({
	tools : [ {
		id : "refresh",
		handler : function() {
			orgparenttree.root.reload();
		},
		scope : this
	} ],
	autoScroll : true,
	root : new Ext.tree.AsyncTreeNode({
		id : "root",
		text : '所有组织',
		loader : new Ext.tree.TreeLoader({
			dataUrl : contextPath + '/authority/organize!getownerorgtree.action',
			baseParams : {
			pnode : userorg
			}
		}),
		iconCls : 'treeroot-icon'
	})
});
function changeOrgType(val) {
	if (val == 1) {
		return '內部组织';
	} else if (val == 2) {
		return '外部组织';
	}
	return val;
};
var SystemOrgListPanel = Ext.extend(JsonGrid, {
	title : '组织列表',
	sortfield : 'parentname',
	groupfield : 'parentname',
	queryname : 'organizename',
	allowGroup : true,
	gridConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		hidden : true
	}, {
		fieldLabel : '组织名称',
		name : 'organizename'
	}, {
		fieldLabel : '联系人',
		name : 'linkmaninfo'
	}, {
		fieldLabel : '联系电话',
		name : 'linkmantel'
	}, {
		fieldLabel : '所属区域',
		name : 'regionname'
	}, {
		fieldLabel : '上级组织',
		name : 'parentname'

	}, {
		fieldLabel : '上级组织ID',
		name : 'parentid',
		hidden : true
	}, {
		fieldLabel : '组织类型',
		name : 'orgtypelabel'
	}, {
		fieldLabel : '备注',
		name : 'remark'
	} ],
	winowConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		hidden : true
	}, {
		fieldLabel : '组织名称',
		maxLength : 18,
		allowBlank : false,
		name : 'organizename'
	}, {
		fieldLabel : '联系人',
		maxLength : 18,
		allowBlank : false,
		name : 'linkmaninfo'
	}, {
		fieldLabel : '联系电话',
		maxLength : 11,
		allowBlank : false,
		name : 'linkmantel'
	},{
		id:"locationcombo",
		xtype : "treecombo",
		fieldLabel : "所属区域",
		name : "region",
		hiddenName : "regionid",
		displayField : "text",
		valueField : "id",
		tree : locationregiontree
	}, {
		xtype : "treecombo",
		fieldLabel : "上级组织",
		name : "parent",
		hiddenName : "parentid",
		displayField : "text",
		valueField : "id",
		tree : orgparenttree
	}, {
		fieldLabel : '组织类型',
		allowBlank : false,
		xtype : 'Appcombox',
		name : 'orgtype',
		emptyText : '请选择',
		single : true,
		resizable : true,
		dataUrl : contextPath+ '/authority/sysdictionary!getdictionary.action?type=orgtype',
		dataCode : 'codevalue',
		dataText : 'lable',
		anchor : '90%'
	}, {
		fieldLabel : '备注',
		maxLength : 150,
		name : 'remark'
	} ],
	urlPagedQuery : contextPath + '/authority/organize!alllist.action',
	urlSave : contextPath + '/authority/organize!save.action',
	urlLoadData : contextPath + '/authority/organize!view.action',
	urlRemove : contextPath + '/authority/organize!delete.action',
	// 打开对话框
	openDialog : function(id, title, isload) {
		if (this.openWindowUrl.length == 0) {
			if (!this.dialog) {
				this.createDialog();
			}
			this.dialog.show();
			this.dialog.setTitle(title);
			this.formPanel.getForm().reset();
			if (isload) {
				Ext.Ajax.request({
							url : this.urlLoadData,
							params : 'id=' + id + this.loadparams,
							waitMsg : "正在加载数据,请稍侯...",
							callback : function(options, success, response) {
								var r = Ext.decode(response.responseText);
								this.formPanel.getForm().setValues(r);
								Ext.getCmp("locationcombo").setComboValue(r.regionid,r.regionname);
							},
							scope : this
						});
				// this.formPanel.load({
				// url : this.urlLoadData,
				// params : 'id=' + id + this.loadparams
				// });

			}
		} else {
			window.showModalDialog(this.openWindowUrl + "?id=" + id,
					this.digModel)
		}
	}
});
SystemOrgPanel = function() {
	// 组织管理列表
	this.list = new SystemOrgListPanel({
		region : "center"
	});
	var topbar = this.list.getTopToolbar();
	var btn_grant = new Ext.Button({
		text : '分配区域',
		iconCls : 'intro',
		disabled : true
	});
	btn_grant.on('click', function(b, e) {
		if (this.list.selModel) {
			ShowRegionTree(this.list.selModel.getSelections()[0].id,
					this.grantregionGrid);
		}
	}, this);
	// topbar.insert(2, btn_grant);  mod wangjie 2011-11-09
	// 已分配区域列表
	this.grantregionGrid = new JsonGrid({
		allowGroup : false,
		allowEdit : false,
		region : 'east',
		width : 480,
		title : '已分配区域',
		gridConfig : [ {
			fieldLabel : '主键',
			name : 'id',
			hidden : true,
			menuDisabled : true
		}, {
			fieldLabel : '组织名称',
			name : 'organizename'
		}, {
			fieldLabel : '区域名称',
			name : 'regionname'
		} ],
		urlPagedQuery : contextPath
				+ '/authority/organizeregion!alllistoid.action',
		urlRemove : contextPath
				+ '/authority/organizeregion!deleteorganizeregion.action'
	});
	this.list.on('rowclick', function(g, r, e) {
		if (g.selModel.getSelections().length == 1) {
			//btn_grant.setDisabled(false);  mod wangjie 2011-11-09
		} else {
			//btn_grant.setDisabled(true);   mod wangjie 2011-11-09
		}
	}, this)
	this.list.on('rowdblclick', function(g, r, e) {
		this.grantregionGrid.store.load({
			params : {
				start : 0,
				limit : this.grantregionGrid.bbar.pageSize,
				orgid : g.selModel.getSelections()[0].id
			}
		});
	}, this);
	SystemOrgPanel.superclass.constructor.call(this, {
		id : "SystemOrgPanel",
		closable : true,
		title : '组织管理',
		border : false,
		autoScroll : true,
		layout : "border",
		items : [ this.list ],
		onDestroy:function() {
			if (this.rendered) {
				if (this.list) {
					this.list.destroy();
					this.list=null;
					delete list;
				}
				if (this.grantregionGrid) {
					this.grantregionGrid.destroy();
					this.grantregionGrid=null;
					delete this.grantregionGrid;
				}
			}
			SystemOrgPanel.superclass.onDestroy.call(this);
		}
	});
};
Ext.extend(SystemOrgPanel, Ext.Panel, {});
function ShowRegionTree(id, grid) {
	regiontree = new Ext.tree.TreePanel({
		title : "区域树",
		region : "west",
		autoScroll : true,
		width : 150,
		border : false,
		margins : '0 2 0 0',
		tools : [ {
			id : "refresh",
			handler : function() {
				this.tree.root.reload();
			},
			scope : this
		} ],
		root : new Ext.tree.AsyncTreeNode({
			id : "000000",
			text : "所有区域",
			iconCls : 'treeroot-icon',
			expanded : true,
			loader : Global.platformRegionLoader
		})
	});

	// 所有用户grid,继承jsongrid,overwirte buildToolbar，保存事件
	var region_grid = Ext.extend(JsonGrid, {
		id : 'region_grid',
		title : '选择区域',
		allowegroup : false,
		allowEdit : false,
		allowDel : false,
		selectid : 'regionid',
		queryname : 'regionname',
		urlPagedQuery : contextPath + '/authority/region!alllist.action',
		urlSave : contextPath + '/authority/organizeregion!save.action',
		gridConfig : [ {
			fieldLabel : '区域编号',
			name : 'regionid'
		}, {
			fieldLabel : '区域名称',
			name : 'regionname'

		}, {
			fieldLabel : '上级区域',
			name : 'parentname'

		} ],
		buildToolbar : function() {
			this.tbar = new Ext.Toolbar([ {
				id : 'save',
				text : '保存',
				iconCls : 'save',
				tooltip : '保存',
				handler : this.save.createDelegate(this)
			}, '->', {
				xtype : 'textfield',
				id : this.queryname,
				name : this.queryname,
				emptyText : '请输入名称进行模糊查询',
				width : 150,
				enableKeyEvents : true,
				// 响应回车键
				listeners : {
					"specialkey" : this.specialkey.createDelegate(this)
				}
			}, {
				text : '查询',
				iconCls : 'srsearch',
				handler : this.queryCatalogItem.createDelegate(this)

			} ]);
			this.bbar = new Ext.ux.PagingComBo({
				rowComboSelect : true,
				pageSize : this.pageSize,
				store : this.store,
				displayInfo : true
			});
			this.store.load({
				params : {
					start : 0,
					limit : this.bbar.pageSize
				}
			});
		},
		specialkey : function(field, e) {
			if (e.getKey() == Ext.EventObject.ENTER) {
				this.queryCatalogItem();
			}
		},
		// 查询条件
		queryCatalogItem : function() {
			this.store.load({
				params : {
					start : 0,
					limit : this.bbar.pageSize,
					queryname : Ext.getCmp(this.queryname).getValue()
				}
			});
		},
		save : function() {
			var selections = this.selModel.getSelections();
			if (selections.length <= 0) {
				Ext.MessageBox.alert('提示', '请选择至少一条数据操作！');
				return;
			} else {
				var ids = "";

				for ( var i = 0; i < selections.length; i++) {
					ids += "," + selections[i].get(this.selectid)
				}
				if (ids != "") {
					ids = ids.substring(1, ids.length);
				}
				Ext.Ajax.request({
					url : this.urlSave,
					params : 'orgid=' + id + '&ids=' + ids,
					method : 'POST',
					success : function() {
						Ext.Msg.alert('提示', '操作成功！');
						grid.store.reload();
					},
					failure : function() {
						this.el.unmask();
						Ext.Msg.alert('提示', '操作失败！')
					}
				});
			}
		}
	});
	regiongrid = new region_grid({
		region : "center"
	});
	regiontree.on("click", function(node, eventObject) {
		var id = (node.id != '000000' ? node.id : "");
		regiongrid.store.baseParams.pnode = id;
		regiongrid.store.removeAll();
		regiongrid.store.load();
	}, this);
	var region_winodw = new Ext.Window({
		layout : 'border',
		width : 650,
		height : 500,
		draggable : true,
		modal : true,
		frame : true,
		title : '分配区域',
		autoScroll : false,
		closeAction : 'hide',
		items : [ regiontree, regiongrid ],
		buttons : [ {
			text : '关闭',
			iconCls : 'deleteIcon',
			handler : function() {
				region_winodw.close();
			}
		} ]
	});
	region_winodw.show();
}
