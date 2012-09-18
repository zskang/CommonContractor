// 维户组列表
var PatrolGroupListPanel = Ext.extend(JsonGrid, {
			title : '维护组列表',
			sortfield : 'parentname',
			groupfield : 'parentname',
			queryname : 'organizename',
			allowGroup : true,
			gridConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '维护组名称',
						name : 'patrolgroupname'
					}, {
						fieldLabel : '维护业务',
						name : 'patrolservice'
					}, {
						fieldLabel : '维护区域',
						name : 'regionid'
					}],
			winowConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '维护组名称',
						name : 'patrolgroupname'
					}, {
						fieldLabel : '维护业务',
						name : 'patrolservice'
					}, {
						fieldLabel : '维护区域',
						name : 'regionid'
					}],
			urlPagedQuery : contextPath
					+ '/information/patrolgroup!alllist.action',
			urlSave : contextPath + '/information/patrolgroup!save.action',
			urlLoadData : contextPath + '/information/patrolgroup!view.action',
			urlRemove : contextPath + '/information/patrolgroup!delete.action'
		});

PatrolGroupPanel = function() {
	// 维护组管理列表
	this.list = new PatrolGroupListPanel({
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
							this.terminalinfoGrid, this.deppersonGrid);
				}
			}, this);
	topbar.insert(2, btn_grant);

	// 分配设备列表
	this.terminalinfoGrid = new JsonGrid({
				queryname : 'usergroupnameuser',
				allowGroup : false,
				allowEdit : false,
				autoload : false,
				title : '已分配设备',
				gridConfig : [{
							fieldLabel : '主键',
							name : 'id',
							hidden : true,
							menuDisabled : true
						}, {
							fieldLabel : '所属维护组',
							name : 'patrolgroupname'
						}, {
							fieldLabel : '设备编号',
							name : 'deviceid'
						}, {
							fieldLabel : '设备型号',
							name : 'devicetype'
						}, {
							fieldLabel : '所属单位',
							name : 'orgname'
						}],
				urlPagedQuery : contextPath
						+ '/information/patrolgroup!terbypat.action',
				urlRemove : contextPath
						+ '/information/patrolgroup!deleteterinfo.action'
			});
	// 分配人员列表
	this.deppersonGrid = new JsonGrid({
				queryname : 'realname',
				allowGroup : false,
				allowEdit : false,
				title : '已分配人员',
				autoload : false,
				gridConfig : [{
							fieldLabel : '主键',
							name : 'id',
							hidden : true,
							menuDisabled : true
						}, {
							fieldLabel : '单位名称',
							name : 'orgname'
						}, {
							fieldLabel : '部门名称',
							name : 'deptname'
						}, {
							fieldLabel : '姓名',
							name : 'realname'
						}, {
							fieldLabel : '职务',
							name : 'job'
						}],
				urlPagedQuery : contextPath
						+ '/information/patrolgroup!patmentls.action',
				urlRemove : contextPath
						+ '/information/patrolgroup!deletepatrolman.action'
			});

	this.list.on('rowclick', function(g, r, e) {
				btn_grant.setDisabled(false);
			}, this);
	this.list.on('rowdblclick', function(g, r, e) {
				if (this.list.selModel) {
					this.terminalinfoGrid.store.load({
								params : {
									orgid : g.selModel.getSelections()[0].id
								}
							});
					this.deppersonGrid.store.load({
								params : {
									orgid : g.selModel.getSelections()[0].id
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
				items : [this.terminalinfoGrid, this.deppersonGrid]
			});
	PatrolGroupPanel.superclass.constructor.call(this, {
				closable : true,
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.list, this.grantTabPanel]
			});
};
Ext.extend(PatrolGroupPanel, Ext.Panel, {});

function ShowGrantTab(id, tgrid, dgrid) {
	// 所有用户grid,继承jsongrid,overwirte buildToolbar，保存事件
	var dp_grid = Ext.extend(JsonGrid, {
		title : '选择人员',
		allowegroup : false,
		selectid : 'id',
		queryname : 'regionname',
		urlPagedQuery : contextPath
				+ '/information/patrolgroup!deptmentls.action',
		urlSave : contextPath + '/information/patrolgroup!savepatrolman.action',
		allowEdit : false,
		allowDel : false,
		gridConfig : [{
					fieldLabel : '主键',
					name : 'id',
					hidden : true,
					menuDisabled : true
				}, {
					fieldLabel : '单位名称',
					name : 'orgname'
				}, {
					fieldLabel : '部门名称',
					name : 'deptname'
				}, {
					fieldLabel : '姓名',
					name : 'realname'
				}, {
					fieldLabel : '职务',
					name : 'job'
				}],
		buildToolbar : function() {
			this.tbar = new Ext.Toolbar([{
						id : this.id+'save',
						text : '保存',
						iconCls : 'acceptIcon',
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
						iconCls : 'page_findIcon',
						handler : this.queryCatalogItem.createDelegate(this)

					}]);
			// 每页显示条数下拉选择框
			this.pagesize_combo = new Ext.form.ComboBox({
						name : 'pagesize',
						triggerAction : 'all',
						mode : 'local',
						store : new Ext.data.ArrayStore({
									fields : ['value', 'text'],
									data : [[10, '10条/页'], [20, '20条/页'],
											[50, '50条/页'], [100, '100条/页'],
											[250, '250条/页'], [500, '500条/页']]
								}),
						valueField : 'value',
						displayField : 'text',
						value : '20',
						editable : false,
						width : 85,
						listeners : {
							"select" : this.selectpage.createDelegate(this)
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
						items : ['-', '&nbsp;&nbsp;', this.pagesize_combo]
					});

			this.store.load({
						params : {
							start : 0,
							limit : paging.pageSize,
							patrolgroupid : id
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
							queryname : Ext.getCmp(this.queryname).getValue()
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
							params : 'patrolid=' + id + '&ids=' + ids,
							method : 'POST',
							success : function() {
								Ext.Msg.alert('提示', '操作成功！');
							},
							failure : function() {
								this.el.unmask();
								Ext.Msg.alert('提示', '操作失败！')
							}
						});
			}
		}
	});

	var t_grid = Ext.extend(dp_grid, {
				title : '选择设备',
				allowegroup : false,
				selectid : 'id',
				queryname : 'deviceid',
				urlPagedQuery : contextPath
						+ '/information/patrolgroup!terinfols.action',
				urlSave : contextPath
						+ '/information/patrolgroup!saveterinfo.action',
				allowEdit : false,
				allowDel : false,
				gridConfig : [{
							fieldLabel : '主键',
							name : 'id',
							hidden : true,
							menuDisabled : true
						}, {
							fieldLabel : '设备编号',
							name : 'deviceid'
						}, {
							fieldLabel : '设备型号',
							name : 'devicetype'
						}, {
							fieldLabel : '所属单位',
							name : 'orgname'
						}]
			});
	// 用户组授权tab
	var patrolGroupGrantTabPanel = new Ext.TabPanel({
				frame : true,
				plain : true,// True表示为不渲染tab候选栏上背景容器图片,
				activeTab : 0,
				width : 500,
				defaults : {
					autoScroll : true
				},
				items : [new dp_grid(), new t_grid()]
			});
	// 用户组授权windows
	var patrolGroupGrantwidow = new Ext.Window({
				layout : 'fit',
				width : 500,
				height : 480,
				draggable : true,
				modal : true,
				frame : true,
				title : '选择',
				autoScroll : false,
				closeAction : 'hide',
				items : [patrolGroupGrantTabPanel],
				buttons : [{
							text : '关闭',
							iconCls : 'deleteIcon',
							handler : function() {
								patrolGroupGrantwidow.close();
							}
						}]
			});
	patrolGroupGrantwidow.show();
}
Ext.onReady(function() {
			var patrolGroupPanel = new PatrolGroupPanel();
			var viewport = new Ext.Viewport({
						layout : 'border',
						frame : false,
						loadMask : {
							msg : '数据加载中...',
							showMask : true
						},
						items : [{
									region : 'center',
									layout : 'fit',
									items : [patrolGroupPanel]
								}]
					});
		})