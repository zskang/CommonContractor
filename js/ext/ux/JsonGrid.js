/*
 * 封装的综合的Grid控件，继承新增、修改、删除、检索、分页，过滤等功能。
 */

JsonGrid = Ext.extend(Ext.grid.GridPanel, {
	loadMask : true,
	stripeRows : true,
	// 初始化
	initComponent : function() {
		Ext.QuickTips.init();
		Ext.applyIf(this, {
					urlPagedQuery : "pagedQuery.do",
					urlLoadData : "loadData.do",
					loadparams : '',
					queryname : 'queryname',
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
					dlgWidth : 400,
					dlgHeight : 300,
					digModel : 'dialogWidth=420px;dialogHeight=300px;center=yes;',
					viewConfig : {
						forceFit : true
					}
				});
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
		}
		this.buildColumnModel();
		this.buildRecord();
		this.buildDataStore();
		if (this.createHeader) {
			this.buildToolbar();
		}

		JsonGrid.superclass.initComponent.call(this);
		// 双击弹出编辑框
		// this.on('rowdblclick', this.edit, this);

		// 右键菜单
		this.on('rowcontextmenu', this.contextmenu, this);
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
			if (col.hideable) {
				column.hideable = col.hideable;
			}
			columnHeaders.push(column);
		}
		if (this.allowEdit) {
			var actioncolumnedit = {
				tooltip : '编辑',
				icon : contextPath + '/images/icons/edit.png',
				handler : this.actionedit.createDelegate(this)
			};
			actioncolumns.push(actioncolumnedit);
		}
		if (this.allowDel) {
			var actioncolumnDel = {
				tooltip : '删除',
				icon : contextPath + '/images/icons/delete.png',
				handler : this.actiondel.createDelegate(this)
			};
			actioncolumns.push(actioncolumnDel);
		}
		if (actioncolumns.length > 0) {
			var actioncolumn = {
				xtype : 'actioncolumn',
				width : 50,
				align : 'center',
				menuDisabled : true,
				items : actioncolumns,
				padding : 5,
				margin : 10
			};
			columnHeaders.push(actioncolumn);
		}
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
								}, this.dataRecord),
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
								}, this.dataRecord),
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
					handler : this.add.createDelegate(this)
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
					iconCls : 'srsearch',
					handler : this.queryCatalogItem.createDelegate(this)

				}]);
		this.bbar = new Ext.ux.PagingComBo({
					rowComboSelect : true,
					pageSize : this.pageSize,
					store : this.store,
					displayInfo : true
				});
		this.tbar = this.tbbar;
		if (this.autoload) {
			this.store.load({
						params : {
							start : 0,
							limit : this.bbar.pageSize
						}
					});
		}
	},
	specialkey : function(field, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			this.queryCatalogItem();
		}
	},
	// 查询条件
	queryCatalogItem : function() {
		this.store.reload({
					params : {
						start : 0,
						limit : this.bbar.pageSize,
						queryname : Ext.getCmp(this.queryname).getValue()
					}
				});
	},
	// 检测至少选择一个
	checkOne : function() {
		var selections = this.selModel.getSelections();
		if (selections.length == 0) {
			Ext.MessageBox.alert("提示", "请选择一条的记录！");
			return false;
		} else if (selections.length != 1) {
			Ext.MessageBox.alert("提示", "不能选择多行！");
			return false;
		}
		return true;
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

	// 弹出添加对话框，添加一条新记录
	add : function() {
		this.openDialog('', '新增', false);
	},

	// 弹出修改对话框
	edit : function() {
		if (this.selModel) {
			id = this.selModel.getSelections()[0].id;
			this.openDialog(id, '修改', true);
		}
	},
	// action 编辑 弹出对话框
	actionedit : function(grid, rowIndex, colIndex) {
		var rec = grid.getStore().getAt(rowIndex);
		this.openDialog(rec.get("id"), '修改', true);

	},
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

								// this.formPanel.getForm().clearDirty();
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
	},
	actiondel : function(grid, rowIndex, colIndex) {
		Ext.Msg.confirm("提示", "是否确定删除该记录？", function(btn, text) {
					if (btn == 'yes') {
						var rec = grid.getStore().getAt(rowIndex);
						this.body.mask('提交数据，请稍候...', 'x-mask-loading');
						Ext.Ajax.request({
									url : this.urlRemove,
									method : 'POST',
									params : 'ids=' + rec.get("id")
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
	},
	// 删除记录
	del : function() {
		this.batchSubmit(this.urlRemove);
	},

	// 创建弹出式对话框
	createDialog : function() {
		var items = this.winowConfig;
		Ext.each(items, function(item) {
					Ext.applyIf(item, {
								anchor : '90%'
							});
				});
		var reader = new Ext.data.JsonReader({}, items);
		this.formPanel = new Ext.form.FormPanel({
					defaultType : 'textfield',
					labelAlign : 'right',
					labelWidth : 70,
					bodyStyle : 'padding:10px',
					loadMask : {
						msg : '数据加载中...'
					},
					reader : reader,
					items : items,
					buttons : [{
								text : '确定',
								iconCls : 'save',
								handler : function() {
									if (this.formPanel.getForm().isValid()) {
										this.formPanel.getForm().submit({
													waitTitle : "请稍候",
													url : this.urlSave,
													params : this.saveparams,
													waitMsg : '提交数据，请稍候...',
													success : function() {
														this.dialog.hide();
														Ext.Msg.alert('提示',
																'操作成功！');
														this.refresh();
													},
													failure : function() {
													},
													scope : this
												});
									}
								}.createDelegate(this)
							}, {
								text : '取消',
								iconCls : 'delete',
								handler : function() {
									this.dialog.hide();
								}.createDelegate(this)
							}]
				});
		this.dialog = new Ext.Window({
					layout : 'fit',
					width : this.dlgWidth,
					height : this.dlgHeight,
					draggable : true,
					loadMask : {
						msg : '数据加载中...'
					},
					constrain : true,
					modal : true,
					frame : true,
					autoScroll : false,
					closeAction : 'hide',
					items : [this.formPanel]
				});
	},

	// 选中搜索属性选项时
	onItemCheck : function(item, checked) {
		if (checked) {
			this.filterButton.setText(item.text + ':');
			this.filterTxt = item.value;
		}
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
						id : 'updateMenu' + this.id,
						text : '修改',
						iconCls : "edit",
						handler : this.edit.createDelegate(this)
					});
			menuList.push(updateMenu);
		}
		if (this.allowDel) {
			removeMenu = new Ext.menu.Item({
						id : 'removeMenu' + this.id,
						iconCls : "delete",
						text : '删除',
						handler : this.del.createDelegate(this)
					});
			menuList.push(removeMenu);
		}
		var selections = this.selModel.getSelections();

		if (selections.length > 1) {
			updateMenu.disable();
		}
		if (menuList.length > 0) {
			if (!this.grid_menu) {
				this.grid_menu = new Ext.menu.Menu({
							id : 'mainMenu' + this.id
						});
			}
			this.grid_menu.removeAll();
			this.grid_menu.add(menuList);
			menuList.remove();
			var coords = e.getXY();
			this.grid_menu.showAt(coords);
		}
	},
	// 刷新表格数据
	refresh : function() {
		this.store.reload();
	},
	onDestroy : function() {
		if (this.rendered) {
			if (this.grid_menu) {
				this.grid_menu.destroy();
				this.grid_menu=null;
				delete this.grid_menu;
			}
			if (this.dialog) {
				this.dialog.destroy();
				this.dialog=null;
				delete this.dialog;
			}
			if (this.tbbar) {
				this.tbbar.destroy();
				this.tbbar=null;
				delete this.tbbar;
			}
		}
	 JsonGrid.superclass.onDestroy.call(this);
	}
});
Ext.reg('JsonGrid', JsonGrid);