/*
 * 封装的综合的Grid控件，继承新增、修改、删除、检索、分页，过滤等功能。
 */
Ext.namespace('Cabletech.Ext');
Cabletech.Ext.CrudGridPanel = Ext.extend(Ext.grid.GridPanel, {
	/**
	 * @cfg {Boolean} exportData 业务是否支持导出Excel功能（是否显示导出excel按钮）。默认不显示。
	 */
	exportData : false,
	/**
	 * @cfg {Boolean} importData 业务是否支持导入excel数据功能（是否显示导入excel按钮）。默认不显示。
	 */
	importData : false,
	/**
	 * @cfg {Boolean} printData 业务是否支持列表打印功能（是否显示打印列表按钮）。默认不显示。
	 */
	printData : false,
	/**
	 * @cfg {Boolean} clearData 业务是否支持清除上次查询功能（是否显示清除查询按钮）。默认不显示。
	 */
	clearData : false,
	/**
	 * @cfg {Boolean} allowSearch 业务是否支持查询功能（是否显示查询按钮）。默认支持。
	 */
	allowSearch : true,
	/**
	 * @cfg {Boolean} showMenu 业务是否支持在列表页中支持右键功能菜单。默认支持。
	 */
	showMenu : true,
	/**
	 * @cfg {Boolean} showAdd 业务是否支持添加功能（是否显示添加按钮）。默认支持。
	 */
	showAdd : true,
	/**
	 * @cfg {Boolean} showAdd 业务是否支持编辑功能（是否显示编辑按钮）。默认支持。
	 */
	showEdit : true,
	/**
	 * @cfg {Boolean} showRemove 业务是否支持删除功能（是否显示删除按钮）。默认支持。
	 */
	showRemove : true,
	/**
	 * @cfg {Boolean} showView 业务是否支持查看明细功能（是否显示查看按钮）。默认支持。
	 */
	showView : true,
	/**
	 * @cfg {Boolean} showRefresh 业务是否支持页面列表刷新功能（是否显示刷新按钮）。默认支持。
	 */
	showRefresh : true,
	/**
	 * @cfg {Boolean} showSearchField 业务是否支持内容查询功能（是否显示内容查询组件）。默认支持。
	 */
	showSearchField : true,
	/**
	 * @cfg {Boolean} batchRemoveMode 业务是否支持批量删除模式。默认支持。
	 */
	batchRemoveMode : false,
	/**
	 * @cfg {Boolean} autoLoadGridData 是否在列表加载后自动加载表格数据。默认支持。
	 */
	autoLoadGridData : true,

	/**
	 * @cfg {Boolean} summaryGrid 是否开启列表统计功能。默认不支持。
	 */
	summaryGrid : false,
	/**
	 * @cfg {Boolean} dirtyFormCheck 是否自动检查编辑表单中的数据项已经修改。默认支持。
	 */
	dirtyFormCheck : true,
	/**
	 * @cfg {Integer} winWidth 默认的【添加/修改/查看】窗口的宽度
	 */
	winWidth : 500,
	/**
	 * @cfg {Integer} winHeight 默认的【添加/修改/查看】窗口的高度
	 */
	winHeight : 400,
	/**
	 * @cfg {Integer} winHeight 默认的【添加/修改/查看】窗口的名称
	 */
	winTitle : "数据管理",
	/**
	 * @cfg {Integer} pageSize 业务列表中默认的分页页数。
	 */
	pageSize : 10,
	/**
	 * @cfg {Boolean} pagingToolbar 在业务列表中是否显示分页工具栏。
	 */
	pagingToolbar : true,
	/**
	 * @cfg {Function} viewSave 用来处理视图查看时，保存按钮的回调函数。
	 */
	viewSave : Ext.emptyFn,
	initComponent : Ext.emptyFn,
	/**
	 * @cfg {linkRender} linkRender
	 *      默认的linkRender，方便在grid中直接使用renderer:this.linkRender。
	 */
	linkRender : Cabletech.Ext.Util.linkRenderer,
	/**
	 * @cfg {imgRender} imgRender
	 *      默认的imgRender，方便在grid中直接使用renderer:this.imgRender。
	 */
	imgRender : Cabletech.Ext.Util.imgRender,
	/**
	 * @cfg {booleanRender} booleanRender
	 *      默认的booleanRender，方便在grid中直接使用renderer:this.booleanRender。
	 */
	booleanRender : Cabletech.Ext.Util.booleanRender,
	/**
	 * @cfg {dateRender} dateRender
	 *      默认的dateRender，方便在grid中直接使用renderer:this.dateRender。
	 */
	dateRender : Cabletech.Ext.Util.dateRender,
	/**
	 * @cfg {objectRender} objectRender
	 *      默认的objectRender，方便在grid中直接使用renderer:this.objectRender。
	 */
	objectRender : Cabletech.Ext.Util.objectRender,
	/**
	 * @cfg {typesRender} typesRender
	 *      默认的typesRender，方便在grid中直接使用renderer:this.typesRender。
	 */
	typesRender : Cabletech.Ext.Util.typesRender,
	/**
	 * @cfg {readOnlyRender} readOnlyRender
	 *      默认的readOnlyRender，方便在grid中直接使用renderer:this.readOnlyRender。
	 */
	readOnlyRender : Cabletech.Ext.Util.readOnlyRender,
	/**
	 * @cfg {operaterRender} operaterRender
	 *      默认的operaterRender，方便在grid中直接使用renderer:this.operaterRender。
	 */
	operaterRender : Cabletech.Ext.Util.operaterRender,
	/**
	 * @type {String} gridSelModel grid的选择模式(checkbox/row)<br/>
	 *       checkbox使用Ext.grid.CheckBoxSelectionModel<br/>
	 *       row使用Ext.grid.RowSelectionModel<br/>
	 */
	gridSelModel : 'row',
	/**
	 * @type Boolean gridRowNumberer grid是否是否显示序号列<br/>
	 */
	gridRowNumberer : false,
	// private
	border : false,
	// private
	layout : 'fit',
	// private
	closable : true,
	// private
	autoScroll : true,
	/**
	 * @cfg {Object} viewWin 如果开启了查看业务流程，则该对象定义了查看窗口的样式。
	 *      <ul>
	 *      <li>{Integer} width 窗口宽度</li>
	 *      <li>{Integer} height 窗口高度</li>
	 *      <li>{String} title 窗口标题</li>
	 *      </ul>
	 */
	viewWin : {
		width : 650,
		height : 410,
		title : "详情查看"
	},
	/**
	 * @cfg {Object} searchWin 如果开启了高级查询业务流程，则该对象定义了高级查询窗口的样式。
	 *      <ul>
	 *      <li>{Integer} width 窗口宽度</li>
	 *      <li>{Integer} height 窗口高度</li>
	 *      <li>{String} title 窗口标题</li>
	 *      </ul>
	 */
	searchWin : {
		width : 630,
		height : 300,
		title : "高级查询"
	},
	/**
	 * @cfg {Boolean} gridForceFit 业务对象列表页面列表是否支持宽度自适应。
	 */
	gridForceFit : true,
	/**
	 * @cfg {Object} gridViewConfig 自定义的业务对象列表表格的视图样式配置。
	 *      比如经常会自定义表格视图的getRowClass属性来在列表中控制不同状态的业务对象的显示方式。
	 */
	gridViewConfig : {},
	/**
	 * @cfg {Object} baseQueryParameter 定义的查询初始化参数
	 *      该参数会一直绑定在业务对象列表的store上。在实际的开发中，一般用来区分类似于销售出库单，报损单等相同模型，近似逻辑的单据。
	 */
	baseQueryParameter : {},
	/**
	 * @cfg {Object} gridConfig 自定义的业务对象列表表格的配置。
	 */
	gridConfig : {},
	/**
	 * @cfg {Object} buildColumnModel 创建ColumnModel
	 */
	buildColumnModel : function() {
		this.sm = new Ext.grid.CheckboxSelectionModel();
		var columnHeaders = new Array();
		if (this.gridRowNumberer) {
			columnHeaders.push(new Ext.grid.RowNumberer({
						header : '序号',
						width : 36
					}));
		}
		if (this.gridSelModel == 'checkbox') {
			columnHeaders.push(this.sm);
		}
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
		this.cm = new Ext.grid.ColumnModel(columnHeaders);
		this.cm.defaultSortable = true;
		this.columnModel = this.cm;
	},
	/**
	 * @cfg {Object} buildRecord 创建Grid数据集
	 */
	buildRecord : function() {
		this.dataRecord = Ext.data.Record.create(this.gridConfig);
	},
	/**
	 * @cfg {Object} bulidGridStore 创建Grid数据源
	 */
	buildGridStore : function() {
		if (this.allowegroup) {
			this.store = new Ext.data.GroupingStore({
						scopte : this,
						autoload : this.autoLoadGridData,
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
	/**
	 * @cfg {Object} bulidGridStore 创建Grid工具栏
	 */
	buildToolbar : function() {
		this.tbbar = new Ext.Toolbar([{
					name : "btn_add",
					text : "添加(<u>A</u>)",
					iconCls : 'add',
					tooltip : '添加',
					hidden : !this.showAdd,
					handler : this.add.createDelegate(this)
				}, {
					name : "btn_edit",
					text : "编辑(<u>E</u>)",
					iconCls : "edit",
					tooltip : '编辑',
					hidden : !this.showEdit,
					handler : this.edit.createDelegate(this)
				}, {
					name : "btn_view",
					text : "查看(<u>V</u>)",
					iconCls : "view",
					tooltip : '查看',
					hidden : !this.showView,
					handler : this.view.createDelegate(this)
				}, {
					name : "btn_remove",
					text : "删除(<u>D</u>)",
					iconCls : "delete",
					tooltip : '删除',
					hidden : !this.showRemove,
					handler : this.del.createDelegate(this)
				}, {
					name : "btn_refresh",
					text : "刷新",
					iconCls : "refresh",
					tooltip : '刷新',
					hidden : !this.showRefresh,
					handler : this.refresh.createDelegate(this)
				}, {
					name : "btn_advancedSearch",
					text : "高级查询(<u>S</u>)",
					iconCls : "srsearch",
					method : "advancedSearch",
					hidden : true
				}, {
					name : "btn_print",
					text : "打印(<u>P</u>)",
					iconCls : "print-icon",
					hidden : true
				}, {
					name : "btn_export",
					text : "导出Excel(<u>O</u>)",
					iconCls : 'export-icon',
					method : "exportExcel",
					hidden : true
				}, {
					name : "btn_import",
					text : "导入数据(<u>I</u>)",
					iconCls : 'import-icon',
					method : "importExcel",
					hidden : true
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
	/**
	 * @cfg {Object} batchSubmit 批量删除
	 */
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
	/**
	 * @event saveobject 当保存或者修改业务对象成功后抛出的事件
	 * 
	 * @param {EasyJF.Ext.Util.CrudPanel}
	 *            this CrudPanel自身
	 * @param {Ext.form.BasicForm}
	 *            form 提交的表单
	 * @param {Ext.form.Action}
	 *            action 提交表单绑定的acion对象。
	 */
	/**
	 * @event removeobject 当删除业务对象成功后抛出的事件
	 * 
	 * @param {EasyJF.Ext.Util.CrudPanel}
	 *            this CrudPanel自身
	 * @param {Ext.data.Record}
	 *            r 删除的对象在列表中对应的record对象。
	 * @param {Object}
	 *            option 提交请求绑定的option对象。
	 */
	// private
	initComponent : function() {
		this.store = this.bulidGridStore();

		this.addEvents("saveobject", "removeobject");// 增加saveobject及removeobject事件
		EasyJF.Ext.CrudPanel.superclass.initComponent.call(this);

		var buttons = this.buildCrudOperator();

		var viewConfig = Ext.apply({
					forceFit : this.gridForceFit
				}, this.gridViewConfig);
		var gridConfig = Ext.apply(this.gridConfig, {
					store : this.store,
					stripeRows : true,
					trackMouseOver : false,
					loadMask : true,
					viewConfig : viewConfig,
					tbar : buttons,
					border : false,
					bbar : this.gridBbar
							|| (this.pagingToolbar ? new Ext.ux.PagingComBo({
										rowComboSelect : true,
										pageSize : this.pageSize,
										store : this.store,
										displayInfo : true
									}) : null)
				});

		if (this.summaryGrid) {
			if (gridConfig.plugins) {
				if (typeof gridConfig.plugins == "object")
					gridConfig.plugins = [gridConfig.plugins];
			} else
				gridConfig.plugins = [];
			gridConfig.plugins[gridConfig.plugins.length] = new Ext.ux.grid.GridSummary();
		}
		var columns = this.columns, cfg = {};
		columns = columns || this.cm.config;
		delete gridConfig.cm;

		columns = [].concat(columns);
		if (this.gridRowNumberer) {
			columns.unshift(new Ext.grid.RowNumberer({
						header : '序号',
						width : 36
					}));
		}

		if ((!gridConfig.sm && !gridConfig.selModel)
				&& this.gridSelModel == 'checkbox') {
			cfg.sm = new Ext.grid.CheckboxSelectionModel();
			if (columns[0] instanceof Ext.grid.RowNumberer) {
				columns.splice(1, 0, cfg.sm);
			} else {
				columns.unshift(cfg.sm);
			}
		}
		cfg.columns = columns;

		gridConfig = Ext.applyIf(cfg, gridConfig);

		if (this.columnLock && Ext.grid.LockingGridPanel) {
			this.grid = new Ext.grid.LockingGridPanel(gridConfig);
		} else
			this.grid = new Ext.grid.GridPanel(gridConfig);

		// this.grid.colModel.defaultSortable = true;// 设置表格默认排序
		this.loadOperatorsPermission();
		// 双击表格行进入编辑状态
		this.initCrudEventHandler();
		this.add(this.grid);
		if (this.autoLoadGridData)
			this.store.load();
	}

})