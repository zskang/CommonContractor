EditGrid = Ext.extend(Ext.grid.EditorGridPanel, {
	clicksToEdit : 1,
	loadMask : true,
	stripeRows : true, // 双色表格
	// 初始化
	initComponent : function() {
		Ext.applyIf(this, {
					stripeRows : true,
					removedRecords : [],
					insertedRecords : [],
					url : '',
					allowegroup : false,
					autoScroll : true,
					groupfield : '',
					urlSubmit : '',
					allowsave : true,
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
		this.buildToolbar();

		EditGrid.superclass.initComponent.call(this);

		this.store.on('load', function() {
					this.removedRecords = [];
					this.insertedRecords = [];
				}, this);

		this.store.on('beforeload', function() {

					if (this.isDirty()) {
						Ext.MessageBox.show({
									title : '提示',
									msg : '是否保存本页的修改',
									buttons : Ext.MessageBox.YESNOCANCEL,
									fn : function(btn) {
										if (btn == 'yes') {
											this.save();
										} else if (btn == 'no') {
											this.cancel();
										} else {
										}
									},
									scope : this
								});
						return false;
					}
				}, this);
	},

	// 初始化ColumnModel
	buildColumnModel : function() {
		this.sm = new Ext.grid.CheckboxSelectionModel();
		var columnHeaders = new Array();
		columnHeaders[0] = new Ext.grid.RowNumberer();
		columnHeaders[1] = this.sm;
		for (var i = 0; i < this.formConfig.length; i++) {
			var col = this.formConfig[i];
			if (col.hideGrid === true) {
				continue;
			}
			var column = {
				header : col.fieldLabel,
				sortable : col.sortable,
				dataIndex : col.name
			};
			if (typeof(col.editor) != 'undefined') {
				column.editor = new Ext.grid.GridEditor(col.editor);
			}
			if (typeof(col.xtype) != 'undefined') {
				column.xtype = col.xtype
			}
			if (col.renderer) {
				column.renderer = col.renderer;
			}
			if (col.hidden) {
				column.hidden = col.hidden;
			}
			if (col.menuDisabled) {
				column.menuDisabled = col.menuDisabled;
			}
			columnHeaders.push(column);
		}
		this.cm = new Ext.grid.ColumnModel(columnHeaders);
		this.cm.defaultSortable = true;
		this.columnModel = this.cm;
	},

	buildRecord : function() {
		this.dataRecord = Ext.data.Record.create(this.formConfig);
	},

	buildDataStore : function() {
		if (this.allowegroup) {
			this.store = new Ext.data.GroupingStore({
						scopte : this,
						url : this.url,
						reader : new Ext.data.JsonReader({
									root : "root",
									totalProperty : "totalcount"
								}, this.dataRecord),
						groupField : this.groupfield,
						groupByText : '按此字段分组',
						showGroupsText : '在分组中显示',
						remoteSort : false,
						pruneModifiedRecords : true
					});
		} else {
			this.store = new Ext.data.Store({
						url : this.url,
						autoload : true,
						reader : new Ext.data.JsonReader({
									root : "root",
									totalProperty : "totalcount"
								}, this.dataRecord),
						remoteSort : false,
						pruneModifiedRecords : true
					});
		}
	},

	buildToolbar : function() {
		this.tbar = new Ext.Toolbar([{
					id : 'save',
					text : '保存',
					iconCls : 'acceptIcon',
					tooltip : '保存',
					hidden : !this.allowsave,
					handler : this.save.createDelegate(this)
				}, {
					id : 'refresh',
					text : '刷新',
					iconCls : 'page_refreshIcon',
					tooltip : '刷新',
					handler : this.refresh.createDelegate(this)
				}, '->']);
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
						limit : paging.pageSize
					}
				});
		this.bbar = paging;
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
	// 提交修改
	save : function() {
		this.stopEditing();

		var m = this.store.modified.slice(0);

		for (var i = 0; i < m.length; i++) {
			var record = m[i];
			var fields = record.fields.keys;

			for (var j = 0; j < fields.length; j++) {
				var name = fields[j];
				var value = record.data[name];

				var colIndex = this.getColumnModel().findColumnIndex(name);
				if (colIndex == -1) {
					continue;
				}
				var rowIndex = this.store.indexOfId(record.id);
				var editor = this.getColumnModel().getCellEditor(colIndex);

				if (editor && !editor.field.validateValue(value ? value : '')) {
					Ext.Msg.alert('提示', '请确保输入的数据正确。', function() {
								this.startEditing(rowIndex, colIndex);
							}, this);
					return;
				}
			}
		}

		// 进行到这里，说明数据都是有效的
		var data = [];
		Ext.each(m, function(p) {
					var value = {};
					for (var i in p.fields.items) {
						var item = p.fields.items[i];
						if (item.name) {
							value[item.name] = p.get(item.name);
						}
					}
					data.push(value);
				});
		var removedIds = [];
		Ext.each(this.removedRecords, function(item) {
					removedIds.push(item.get('id'));
				});

		if (!this.isDirty()) {
			Ext.Msg.alert('信息', '没有需要保存的信息!');
			// 没有修改，不需要提交
			return;
		}

		this.loadMask.show();
		Ext.Ajax.request({
					method : 'POST',
					url : this.urlSubmit,
					success : function(response) {
						var json = Ext.decode(response.responseText)
						this.loadMask.hide();
						if (json.success) {

							Ext.Msg.alert('信息', "保存数据成功!", this.refresh
											.createDelegate(this));
							this.store.rejectChanges();
						} else {
							Ext.Msg.alert('错误', json.message);
						}
					}.createDelegate(this),
					failure : function() {
						Ext.Msg.alert("错误", "与后台联系的时候出现了问题");
					},
					params : 'removedIds=' + removedIds + '&data='
							+ encodeURIComponent(Ext.encode(data))
				});
	},
	// 取消修改
	cancel : function() {
		this.stopEditing();

		// 返还修改
		this.store.rejectChanges();
		// 删除添加
		if (this.insertedRecords.length > 0) {
			for (var i = 0; i < this.insertedRecords.length; i++) {
				var p = this.insertedRecords[i];
				this.store.remove(p);
			}
			this.insertedRecoreds = [];
		}
		// 回复删除
		if (this.removedRecords.length > 0) {
			for (var i = 0; i < this.removedRecords.length; i++) {
				var p = this.removedRecords[i];
				this.store.add(p);
			}
			this.removedRecords = [];
		}
	},

	// 刷新表格数据
	refresh : function() {
		this.cancel();
		this.store.reload();
	},

	// 是否有改动
	isDirty : function() {
		return this.store.modified.length != 0
				|| this.removedRecords.length != 0;
	}
});
Ext.reg('EditGrid', EditGrid);