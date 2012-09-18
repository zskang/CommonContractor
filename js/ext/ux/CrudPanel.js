CrudPanel = Ext.extend(Ext.grid.GridPanel, {
	closable : true,
	autoScroll : true,
	layout : "fit",
	gridViewConfig : {},
	linkRenderer : function(v) {
		if (!v)
			return "";
		else
			return String.format("<a href='{0}' target='_blank'>{0}</a>", v);
	},
	urlPagedQuery : "pagedQuery.do",
	urlLoadData : "loadData.do",
	loadparams : '',
	// 保存URL
	urlSave : "save.do",
	saveparams : '',
	// 删除URL
	urlRemove : "remove.do",
	rmoveparams : '',
	// 是否显示添加、查看、修改、删除、刷新、搜索、转excel等按钮
	allowAdd : true,
	allowEdit : true,
	allowDel : true,
	allowView : true,
	allowRefresh : true,
	allowToExcel : true,
	autoload : true,
	pageSize : 20,
	openWindowUrl : '',
	sortfield : '',
	stripeRows : true,
	groupfield : '',
	allowegroup : false,
	createHeader : true,
	viewConfig : {
		forceFit : true
	},
	initComponent : function() {
		Ext.QuickTips.init();
		if (this.allowegroup) {
			Ext.apply(this, {
				view : new Ext.grid.GroupingView({
					forceFit : true,
					groupTextTpl : '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})',
					getRowClass : function(r, idx, rowParams, ds) {
						if ((idx % 2) == 1) {
							return "x-orange-class";
						} else {
							return "x-yellow-class";
						}
					},
					emptyText : '没有找到任何数据',
					groupByText : '按此字段分组',
					showGroupsText : '在分组中显示'
				})
			})
		};

		this.buildColumnModel();
		this.buildRecord();
		this.buildDataStore();
		if (this.createHeader) {
			this.buildToolbar();
		}

		CrudPanel.superclass.initComponent.call(this);
		this.on('rowcontextmenu', this.contextmenu, this);
		if (this.autoload) {
			this.store.load({
						params : {
							start : 0,
							limit : this.pbar.pageSize
						}
					});
		}
	},
	// 初始化ColumnModel
	buildColumnModel : function() {
		this.sm = new Ext.grid.CheckboxSelectionModel();
		var columnHeaders = new Array();
		var actioncolumns = new Array();
		columnHeaders[0] = new Ext.grid.RowNumberer();
		columnHeaders[1] = this.sm;
		for (var i = 0; i < this.gridConfig.length; i++) {
			var col = this.gridConfig[i];
			if (col.hideGrid === true) {
				continue;
			}
			var column = {
				header : col.fieldLabel,
				sortable : col.sortable,
				dataIndex : col.name,
				menuDisabled : col.menuDisabled
			};
			if (col.renderer) {
				column.renderer = col.renderer;
			}
			if (col.menuDisabled) {
				column.menuDisabled = col.menuDisabled;
			}
			if (col.hidden) {
				column.hidden = col.hidden;
			}
			columnHeaders.push(column);
		}
		// if (this.allowEdit) {
		// var actioncolumnedit = {
		// tooltip : '编辑',
		// icon : contextPath + '/images/icons/edit.png',
		// handler : this.actionedit.createDelegate(this)
		// };
		// actioncolumns.push(actioncolumnedit);
		// }
		// if (this.allowDel) {
		// var actioncolumnDel = {
		// tooltip : '删除',
		// icon : contextPath + '/images/icons/delete.png',
		// handler : this.actiondel.createDelegate(this)
		// };
		// actioncolumns.push(actioncolumnDel);
		// }
		// if (actioncolumns.length > 0) {
		// var actioncolumn = {
		// xtype : 'actioncolumn',
		// width : 50,
		// align : 'center',
		// menuDisabled : true,
		// items : actioncolumns,
		// padding : 5,
		// margin : 10
		// };
		// columnHeaders.push(actioncolumn);
		// }
		this.cm = new Ext.grid.ColumnModel(columnHeaders);
		this.cm.defaultSortable = true;
		this.columnModel = this.cm;
	},

	buildRecord : function() {
		this.dataRecord = Ext.data.Record.create(this.gridConfig);
	},

	buildDataStore : function() {
		if (this.allowegroup) {
			this.store = new Ext.data.GroupingStore({
						scopte : this,
						autoload : this.autoload,
						url : this.urlPagedQuery,
						reader : new Ext.data.JsonReader({
									root : "root",
									totalProperty : "totalcount"
								}, this.buildRecord()),
						sortInfo : {
							field : this.sortfield,
							direction : "ASC"
						},
						groupField : this.groupfield,
						groupByText : '按此字段分组',
						showGroupsText : '在分组中显示'
					});
		} else {
			this.store = new Ext.data.Store({
						url : this.urlPagedQuery,
						autoload : this.autoload,
						reader : new Ext.data.JsonReader({
									root : "root",
									totalProperty : "totalcount"
								}, this.buildRecord()),
						remoteSort : true
					});

		}
	},
	buildToolbar : function() {
		this.tbbar = new Ext.Toolbar([{
					id : 'add' + this.id,
					text : '新增',
					iconCls : 'add',
					tooltip : '新增',
					hidden : !this.allowEdit,
					handler : this.create.createDelegate(this)
				}, {
					id : 'del' + this.id,
					text : '删除',
					iconCls : "delete",
					tooltip : '删除',
					hidden : !this.allowDel,
					handler : this.del.createDelegate(this)
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
					iconCls : 'search',
					handler : this.queryCatalogItem.createDelegate(this)

				}]);
		// 每页显示条数下拉选择框
		var pagesize_combo = new Ext.form.ComboBox({
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
					emptyText : '20',
					editable : false,
					width : 85,
					listeners : {
						"select" : this.selectpage.createDelegate(this)
					}
				});
		this.pageSize = parseInt(pagesize_combo.getValue());
		// 把分页工具条，放在页脚
		this.pbar = new Ext.PagingToolbar({
					id : 'pbar' + this.id,
					pageSize : this.pageSize,
					store : this.store,
					displayInfo : true,
					displayMsg : '显示{0}条到{1}条,共{2}条',
					// plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
					emptyMsg : "无记录",
					items : ['-', '&nbsp;&nbsp;', pagesize_combo]
				});
		this.bbar = this.pbar;
		this.tbar = this.tbbar;
	},
	specialkey : function(field, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			this.queryCatalogItem();
		}
	},
	// 查询条件
	queryCatalogItem : function() {
		this.grid.store.reload({
					params : {
						start : 0,
						limit : this.bbar.pageSize,
						queryname : Ext.getCmp(this.queryname).getValue()
					}
				});
	},
	// 改变每页显示条数reload数据
	selectpage : function(comboBox) {
		Ext.getCmp("pbar" + this.id).pageSize = parseInt(comboBox.getValue());
		this.pageSize = parseInt(comboBox.getValue());
		this.store.reload({
					params : {
						start : 0,
						limit : this.pageSize
					}
				});
	},

	// 检测必须选择一个
	checkMany : function() {
		var selections = this.selModel.getSelections();
		if (selections.length == 0) {
			Ext.MessageBox.alert("提示", "请至少选择一条的记录！");
			return false;
		}
		return true;
	},
	// 批量删除
	batchSubmit : function(url) {
		if (this.checkMany()) {
			Ext.Msg.confirm("提示", "是否确定删除该记录？", function(btn, text) {
						if (btn == 'yes') {
							var ids = "";
							var selections = this.selModel.getSelections();
							for (var i = 0; i < selections.length; i++) {
								ids += "," + selections[i].get('id')
							}
							if (ids != "") {
								ids = ids.substring(1, ids.length);
							}
							this.body.mask('提交数据，请稍候...', 'x-mask-loading');
							Ext.Ajax.request({
										url : this.urlRemove,
										method : 'POST',
										params : 'ids=' + ids
												+ this.rmoveparams,
										success : function() {
											Ext.Msg.alert('提示', '操作成功！');
											this.body.unmask();
											this.refresh();
										}.createDelegate(this),
										failure : function() {
											this.el.unmask();
											Ext.Msg.alert('提示', '操作失败！');
										}
									});
						}
					}.createDelegate(this));
		}
	},
	search : function() {
	},
	refresh : function() {
		this.store.removeAll();
		this.store.reload();
	},
	initWin : function(width, height, title) {
		var win = new Ext.Window({
					width : width,
					height : height,
					buttonAlign : "center",
					title : title,
					modal : true,
					shadow : true,
					closeAction : "hide",
					items : [this.fp],
					buttons : [{
								text : "保存",
								handler : this.save,
								scope : this
							}, {
								text : "清空",
								handler : this.reset,
								scope : this
							}, {
								text : "取消",
								handler : this.closeWin,
								scope : this
							}]
				});
		return win;
	},
	showWin : function() {
		if (!this.win) {
			if (!this.fp) {
				this.fp = this.createForm();
			}
			this.win = this.createWin();
			this.win.on("close", function() {
						this.win = null;
						this.fp = null;
					}, this);
		}
		this.win.show();
	},
	create : function() {
		this.showWin();
		this.reset();
	},
	save : function() {
		if (this.fp.form.isValid()) {
			this.fp.form.submit({
						waitMsg : '正在保存。。。',
						params : this.saveparams,
						url : this.urlSave,
						method : 'POST',
						success : function() {
							Ext.Msg.alert('提示', '操作成功！');
							this.closeWin();
							this.store.reload();
						},
						scope : this
					});
		}
	},
	reset : function() {
		if (this.win)
			this.fp.form.reset();
	},
	closeWin : function() {
		if (this.win)
			this.win.close();
		this.win = null;
	},
	edit : function() {
		var record = this.grid.getSelectionModel().getSelected();
		if (!record) {
			Ext.Msg.alert("提示", "请先选择要编辑的行!");
			return;
		}
		var id = record.get("id");
		this.showWin();
		Ext.Ajax.request({
					url : this.urlLoadData,
					params : 'id=' + id + this.loadparams,
					waitMsg : "正在加载数据,请稍侯...",
					callback : function(options, success, response) {

						var r = Ext.decode(response.responseText);
						this.fp.form.setValues(r);
					},
					scope : this
				});
	},
	// 删除记录
	del : function() {
		this.batchSubmit(this.urlRemove);
	},
	// 弹出右键菜单
	// 修改，和批量删除的功能
	// 多选的时候，不允许修改就好了
	contextmenu : function(grid, rowIndex, e) {
		// e.preventDefault();
		// e.stopEvent();
		e.preventDefault();
		if (rowIndex < 0) {
			return;
		}
		this.selModel.selectRow(rowIndex);
		var menuList = [];
		var updateMenu, removeMenu;
		if (this.allowEdit) {
			updateMenu = new Ext.menu.Item({
						id : 'updateMenu',
						text : '修改',
						iconCls : "edit",
						handler : this.edit.createDelegate(this)
					});
			menuList.push(updateMenu);
		}
		if (this.allowDel) {
			removeMenu = new Ext.menu.Item({
						id : 'removeMenu',
						iconCls : "delete",
						text : '删除',
						handler : this.del.createDelegate(this)
					});
			menuList.push(removeMenu);
		}
		var selections = this.grid.selModel.getSelections();

		if (selections.length > 1) {
			updateMenu.disable();
		}
		if (menuList.length > 0) {
			if (!this.grid_menu) {
				this.grid_menu = new Ext.menu.Menu({
							id : 'mainMenu'
						});
			}
			this.grid_menu.removeAll();
			this.grid_menu.add(menuList);
			menuList.remove();
			var coords = e.getXY();
			this.grid_menu.showAt(coords);
		}
	}
});
Ext.reg('CrudPanel', CrudPanel);