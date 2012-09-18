// 用户组列表
var SystemUserGroupListPanel = Ext.extend(JsonGrid, {
			id : 'userGroupGrid',
			title : '用户组列表',
			groupfield : '',
			queryname : 'usergroupname',
			allowEdit : true,
			allowDel : true,
			allowGroup : false,// 不允许分组
			// 列表显示字段
			gridConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '用户组名称',
						name : 'usergroupname'
					}, {
						fieldLabel : '备注',
						name : 'remark'
					}],
			// 编辑显示字段
			winowConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '用户组名称',
						name : 'usergroupname'
					}, {
						fieldLabel : '所属组织',
						name : 'orgid'
					}, {
						fieldLabel : '备注',
						name : 'remark'
					}],
			urlPagedQuery : contextPath + '/authority/usergroup!alllist.action',
			urlSave : contextPath + '/authority/usergroup!save.action',
			urlLoadData : contextPath + '/authority/usergroup!view.action',
			urlRemove : contextPath + '/authority/usergroup!delete.action'
		});

SystemUserGroupPanel = function() {
	// 用户组管理列表
	this.list = new SystemUserGroupListPanel({
				id : "SystemUserGroupListPanel",
				region : "center"
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
							this.grantuserGrid, this.grantroleGrid);
				}
			}, this);
	topbar.insert(2, btn_grant);
	// 分配用户列表
	this.grantuserGrid = new JsonGrid({
				queryname : 'usergroupnameuser',
				allowGroup : false,
				allowEdit : false,
				title : '已分配用户',
				autoload : false,
				gridConfig : [{
							fieldLabel : '主键',
							name : 'id',
							hidden : true
						}, {
							fieldLabel : '用户主键',
							name : 'userid',
							hidden : true
						}, {
							fieldLabel : '用户名称',
							name : 'username'
						}, {
							fieldLabel : '所属组织',
							name : 'orgname'
						}],
				winowConfig : [{
							fieldLabel : '主键',
							name : 'id',
							hidden : true
						}, {
							fieldLabel : '用户组名称',
							name : 'usergroupname'
						}, {
							fieldLabel : '用户名称',
							name : 'username'
						}, {
							fieldLabel : '备注',
							name : 'remark'
						}],
				urlPagedQuery : contextPath
						+ '/authority/usergroupuserrole!alllistuserforgid.action',
				urlRemove : contextPath
						+ '/authority/usergroupuserrole!deleteusergroupuser.action'
			});
	// 分配角色列表
	this.grantroleGrid = new JsonGrid({
				queryname : 'usergroupnamerole',
				allowGroup : false,
				allowEdit : false,
				autoload : false,
				title : '已分配角色',
				gridConfig : [{
							fieldLabel : '主键',
							name : 'id',
							hidden : true
						}, {
							fieldLabel : '用户组主键',
							name : 'usergroupid',
							hidden : true
						}, {
							fieldLabel : '角色主键',
							name : 'roleid',
							hidden : true
						}, {
							fieldLabel : '角色名称',
							name : 'rolename'
						}],
				winowConfig : [{
							fieldLabel : '主键',
							name : 'id',
							hidden : true
						}, {
							fieldLabel : '用户组名称',
							name : 'usergroupname'
						}, {
							fieldLabel : '用户名称',
							name : 'username'
						}],
				urlPagedQuery : contextPath
						+ '/authority/usergroupuserrole!alllistroleforgid.action',
				urlRemove : contextPath
						+ '/authority/usergroupuserrole!deleteusergrouprole.action'
			});
	this.list.on('rowclick', function(g, r, e) {
				btn_grant.setDisabled(false);
			}, this)
	this.list.on('rowdblclick', function(g, r, e) {
				if (this.list.selModel) {
					this.grantuserGrid.store.load({
								params : {
									usergroupid : g.selModel.getSelections()[0].id
								}
							});
					this.grantroleGrid.store.load({
								params : {
									usergroupid : g.selModel.getSelections()[0].id
								}
							});
				}
			}, this);
	// 分配tab
	this.grantTabPanel = new Ext.TabPanel({
				frame : true,
				region : "east",
				plain : true,// True表示为不渲染tab候选栏上背景容器图片,
				activeTab : 0,
				width : 350,
				defaults : {
					autoScroll : true
				},
				items : [this.grantuserGrid, this.grantroleGrid]
			});
	SystemUserGroupPanel.superclass.constructor.call(this, {
				id : "SystemUserGroupPanel",
				closable : true,
				title : '用户组管理',
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.list, this.grantTabPanel]
			});
};
Ext.extend(SystemUserGroupPanel, Ext.Panel, {});
function ShowGrantTab(id, ugrid, rgrid) {
	// 所有用户grid,继承jsongrid,overwirte buildToolbar，保存事件
	var user_grid = Ext.extend(JsonGrid, {
				title : '选择人员',
				allowegroup : false,
				selectid : 'userid',
				queryname : 'username',
				allowEdit : false,
				allowDel : false,
				urlPagedQuery : contextPath
						+ '/authority/usergroupuserrole!alllistuser.action',
				urlSave : contextPath
						+ '/authority/usergroupuserrole!saveusergroupuser.action',
				gridConfig : [{
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
						}],
				buildToolbar : function() {
					this.tbar = new Ext.Toolbar([{
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
									"specialkey" : this.specialkey
											.createDelegate(this)
								}
							}, {
								text : '查询',
								iconCls : 'srsearch',
								handler : this.queryCatalogItem
										.createDelegate(this)

							}]);
					// 每页显示条数下拉选择框
					this.pagesize_combo = new Ext.form.ComboBox({
								name : 'pagesize',
								triggerAction : 'all',
								mode : 'local',
								store : new Ext.data.ArrayStore({
											fields : ['value', 'text'],
											data : [[10, '10条/页'],
													[20, '20条/页'],
													[50, '50条/页'],
													[100, '100条/页'],
													[250, '250条/页'],
													[500, '500条/页']]
										}),
								valueField : 'value',
								displayField : 'text',
								value : '20',
								editable : false,
								width : 85,
								listeners : {
									"select" : this.selectpage
											.createDelegate(this)
								}
							});
					var number = parseInt(this.pagesize_combo.getValue());

					// 把分页工具条，放在页脚
					var paging = new Ext.PagingToolbar({
								pageSize : number,
								store : this.store,
								displayInfo : true,
								displayMsg : '第 {0} - {1} 条  共 {2} 条',
								emptyMsg : "无记录",
								items : ['-', '&nbsp;&nbsp;',
										this.pagesize_combo]
							});

					this.store.load({
								params : {
									start : 0,
									limit : paging.pageSize
								}
							});
					this.bbar = paging;
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
									limit : this.pagesize_combo.getValue(),
									queryname : Ext.getCmp(this.queryname)
											.getValue()
								}
							});
				},
				// 改变每页显示条数reload数据
				selectpage : function(comboBox) {
					this.bbar.pageSize = parseInt(comboBox.getValue());
					number = parseInt(comboBox.getValue());
					this.store.reload({
								params : {
									start : 0,
									limit : this.bbar.pageSize
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

						for (var i = 0; i < selections.length; i++) {
							ids += "," + selections[i].get(this.selectid)
						}
						if (ids != "") {
							ids = ids.substring(1, ids.length);
						}
						Ext.Ajax.request({
									url : this.urlSave,
									params : 'usergroupid=' + id + '&ids='
											+ ids,
									method : 'POST',
									success : function() {
										Ext.Msg.alert('提示', '操作成功！');
										ugrid.store.reload();
										rgrid.store.reload();
									},
									failure : function() {
										this.el.unmask();
										Ext.Msg.alert('提示', '操作失败！');
									}
								});
					}
				}
			});


	var rolegrid = Ext.extend(user_grid, {
				title : '选择角色',
				allowegroup : false,
				selectid : 'roleid',
				allowEdit : false,
				allowDel : false,
				queryname : 'rolename',
				urlPagedQuery : contextPath
						+ '/authority/usergroupuserrole!alllistrole.action',
				urlSave : contextPath
						+ '/authority/usergroupuserrole!saveusergrouprole.action',
				gridConfig : [{
							fieldLabel : '角色id',
							name : 'roleid',
							hidden : true,
							menuDisabled : true
						}, {
							fieldLabel : '角色名称',
							name : 'rolename'
						}, {
							fieldLabel : '角色描述',
							name : 'remark'
						}]
			});
	// 用户组授权tab
	var userGroupGrantTabPanel = new Ext.TabPanel({
				frame : true,
				plain : true,// True表示为不渲染tab候选栏上背景容器图片,
				activeTab : 0,
				width : 500,
				defaults : {
					autoScroll : true
				},
				items : [new rolegrid(),new user_grid()]
			});
	// 用户组授权windows
	var userGroupGrantwidow = new Ext.Window({
				layout : 'fit',
				width : 500,
				height : 480,
				draggable : true,
				modal : true,
				frame : true,
				title : '授权',
				autoScroll : false,
				closeAction : 'hide',
				items : [userGroupGrantTabPanel],
				buttons : [{
							text : '关闭',
							iconCls : 'deleteIcon',
							handler : function() {
								userGroupGrantwidow.close();
							}
						}]
			});
	userGroupGrantwidow.show();
}