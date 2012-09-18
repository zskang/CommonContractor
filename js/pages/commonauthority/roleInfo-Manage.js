SystemRoleListPanel = Ext.extend(JsonGrid, {
	sortfield : 'parentname',
	groupfield : 'parentname',
	queryname : 'rolename',
	title : '角色列表',
	gridConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		hidden : true,
		menuDisabled : true
	}, {
		fieldLabel : '角色名称',
		name : 'rolename'
	}, {
		fieldLabel : '角色描述',
		name : 'remark'
	}],
	// 配置编辑时弹出界面,name对应数据库字段
	winowConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		hidden : true
	// 隐藏不显示
	}, {
		fieldLabel : '角色名称',
		maxLength : 18,
		allowBlank : false,
		name : 'rolename'
	}, {
		fieldLabel : '角色描述',
		maxLength : 150,
		name : 'remark'
	} ],
	urlPagedQuery : contextPath + '/authority/roleinfo!alllist.action',
	urlSave : contextPath + '/authority/roleinfo!save.action',
	urlLoadData : contextPath + '/authority/roleinfo!view.action',
	urlRemove : contextPath + '/authority/roleinfo!delete.action'
});

// 系统角色管理
SystemRolePanel = function() {
	this.list = new SystemRoleListPanel({
		region : "center",
		width : 500
	});
	var topbar = this.list.getTopToolbar();
	var btn_grant = new Ext.Button({
		text : '授权',
		iconCls : 'intro',
		disabled : true
	});
	// 点击授权按钮事件
	btn_grant.on('click', function(b, e) {
		if (this.list.selModel) {
			ShowGrantTab(this.list.selModel.getSelections()[0].id,
					this.list.selModel.getSelections()[0].get("orgid"),
					this.grantuserGrid);
		}
	}, this);
	topbar.insert(2, btn_grant);

	// 已分配用户列表
	this.grantuserGrid = new JsonGrid({
		allowGroup : false,
		allowEdit : false,
		autoload : true,
		width : 350,
		queryname : 'username',
		title : '已分配用户',
		gridConfig : [ {
			fieldLabel : '主键',
			name : 'id',
			hidden : true,
			menuDisabled : true
		}, {
			fieldLabel : '角色名称',
			name : 'staffname'
		}, {
			fieldLabel : '姓名',
			name : 'username'
		}, {
			fieldLabel : '所属组织',
			name : 'orgname'
		} ],
		urlPagedQuery : contextPath+ '/authority/permissionscope!userforrole.action?orgid='+(userorg=='root'?'':userorg),
		urlRemove : contextPath+ '/authority/permissionscope!deleteuserrole.action'
	});
	this.list.on('rowclick', function(g, r, e) {
		if (g.selModel.getSelections().length == 1) {
			btn_grant.setDisabled(false);
		} else {
			btn_grant.setDisabled(true);
		}
	}, this);
	this.list.on('rowdblclick', function(g, r, e) {
		this.grantuserGrid.store.load({
			params : {
				start : 0,
				limit : this.grantuserGrid.bbar.pageSize,
				roleid : g.selModel.getSelections()[0].id
			}
		});
	}, this);
	this.grantTabPanel = new Ext.TabPanel({
		frame : true,
		region : "east",
		plain : true,// True表示为不渲染tab候选栏上背景容器图片,
		activeTab : 0,
		width : 480,
		defaults : {
			autoScroll : true
		},
		items : [ this.grantuserGrid ]
	});

	SystemRolePanel.superclass.constructor.call(this, {
		id : "SystemRoleListPanel",
		closable : true,
		title : '角色管理',
		border : false,
		autoScroll : true,
		layout : "border",
		items : [ this.list, this.grantTabPanel ],
		onDestroy:function() {
			if (this.rendered) {
				if (this.list) {
					this.list.destroy();
					this.list=null;
					delete list;
				}
				if (this.grantTabPanel) {
					this.grantTabPanel.destroy();
					this.grantTabPanel=null;
					delete this.grantTabPanel;
				}
			}
			SystemRolePanel.superclass.onDestroy.call(this);
		}
	});
	
};
Ext.extend(SystemRolePanel, Ext.Panel, {});
function ShowGrantTab(id, orgid, ugrid) {
	menutree = new selectTree(
			{
				autoScroll : true,
				title : '选择菜单',
				width : 250,
				border : false,
				margins : '0 2 0 0',
				rootVisible : true,
				dataUrl : contextPath
						+ '/authority/permissionscope!getrolemenupermission.action?roleid='
						+ id,
				ischecked : true,
				animate : false,
				checkModel : 'cascade', // 对树的级联多选
				expanded : false,
				save : function() {
					// 向数据库发送一个json数组，保存排序信息
					// 菜单主键列表
					var mds = "";
					var rds = "";
					if (this.ischecked) {
						var checkedNodes = this.getCheckedNodes();
						for ( var i = 0; i < checkedNodes.length; i++) {
								// 如果根结点是菜单，取最低层菜单id
								if (checkedNodes[i].attributes.objtype == "Menu") {
									mds += ","
											+ checkedNodes[i].attributes.nodeid;
								} else {
									// 如果根结点是资源,取资源id
									rds += ","
											+ checkedNodes[i].attributes.nodeid;
								}
						}
						if (mds != "") {
							mds = mds.substring(1, mds.length);
						}
						if (rds != "") {
							rds = rds.substring(1, rds.length);
						}
					}
					if (mds != "") {
						Ext.Ajax
								.request({
									url : contextPath
											+ '/authority/permissionscope!saverolemenu.action',
									params : {
										menuids : mds,
										resids : rds,
										roleid : id
									},
									method : 'POST',
									success : function() {
										Ext.Msg.alert('提示', '操作成功！');
										this.body.unmask();
										grid.store.load({
											params : {
												start : 0,
												limit : grid.bbar.pageSize,
												roleid : id
											}
										})
										// this.refresh();
									}.createDelegate(this),
									failure : function() {
										this.el.unmask();
										Ext.Msg.alert('提示', '操作失败！');
									}
								});
					} else {
						Ext.Msg.alert('提示', '请选择要分配的资源！');
					}
				}
			});
	// 所有用户grid,继承jsongrid,overwirte buildToolbar，保存事件
	var user_grid = Ext.extend(JsonGrid, {
		title : '选择人员',
		allowegroup : false,
		selectid : 'userid',
		queryname : 'username',
		allowEdit : false,
		allowDel : false,
		urlPagedQuery : contextPath
				+ '/authority/permissionscope!alllistuser.action?orgid='
				+ orgid,
		urlSave : contextPath
				+ '/authority/permissionscope!saveuserrole.action',
		gridConfig : [ {
			fieldLabel : '主键',
			name : 'userid',
			hidden : true,
			menuDisabled : true
		}, {
			fieldLabel : '姓名',
			name : 'username'
		}, {
			fieldLabel : '所属组织',
			name : 'orgname'

		}, {
			fieldLabel : '所属组织主键',
			name : 'orgid',
			hidden : true
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
			this.store.baseParams = {
				roleid : id
			};
			this.store.load();
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
					queryname : Ext.getCmp(this.queryname).getValue(),
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
					params : 'roleid=' + id + '&ids=' + ids,
					method : 'POST',
					success : function() {
						Ext.Msg.alert('提示', '操作成功！');
						this.store.reload();
					},
					failure : function() {
						this.el.unmask();
						Ext.Msg.alert('提示', '操作失败！');
					}
				});
			}
		}
	});

	// 角色授权tab
	var roleGrantTabPanel = new Ext.TabPanel({
		frame : true,
		plain : true,// True表示为不渲染tab候选栏上背景容器图片,
		activeTab : 0,
		width : 500,
		defaults : {
			autoScroll : true
		},
		items : [ menutree, new user_grid() ]
	});
	// 角色授权windows
	var roleGrantwidow = new Ext.Window({
		layout : 'fit',
		width : 500,
		height : 480,
		draggable : true,
		modal : true,
		frame : true,
		title : '授权',
		autoScroll : false,
		closeAction : 'hide',
		items : [ roleGrantTabPanel ],
		buttons : [ {
			text : '关闭',
			iconCls : 'deleteIcon',
			handler : function() {
				roleGrantwidow.close();
			}
		} ]
	});
	roleGrantwidow.show();
};