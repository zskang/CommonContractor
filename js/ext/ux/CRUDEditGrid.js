CRUDEditGrid = Ext.extend(Ext.grid.EditorGridPanel, {
			clicksToEdit : 1,
			loadMask : true,
			removedRecords : [],
			insertedRecords : [],
			pageSize : 15,
			url : '',
			sortfield : '',
			groupfield : '',
			urlSubmit : '',
			saveparams : '',
			autoload : true,
			// 初始化
			initComponent : function() {
				this.buildColumnModel();
				this.buildRecord();
				this.buildDataStore();
				this.buildToolbar();
				Ext.apply(this, {
							layout : 'fit',
							border : false,
							cm : this.cm,
							sm : this.sm,
							store : this.store,
							viewConfig : {
								forceFit : true
							}
						});
				CRUDEditGrid.superclass.initComponent.call(this);

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
				var columnHeaders = new Array();
				columnHeaders[0] = new Ext.grid.RowNumberer();

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
				this.store = new Ext.data.Store({
							url : this.url,
							autoload : this.autoload,
							reader : new Ext.data.JsonReader({
										root : "root",
										totalProperty : "totalcount"
									}, this.dataRecord),
							remoteSort : true
						});
			},

			buildToolbar : function() {
				//
				this.tbar = new Ext.Toolbar([{
							text : '新增',
							iconCls : 'addIcon',
							tooltip : '新增记录',
							handler : this.add.createDelegate(this)
						}, {
							text : '删除',
							iconCls : 'deleteIcon',
							tooltip : '删除',
							handler : this.del.createDelegate(this)
						}, {
							text : '提交',
							iconCls : 'edit',
							tooltip : '提交修改',
							handler : this.save.createDelegate(this)
						}, {
							text : '取消',
							iconCls : 'go',
							tooltip : '取消修改',
							handler : this.cancel.createDelegate(this)
						}, {
							id : 'refreshMenu',
							text : '刷新',
							iconCls : 'refresh',
							tooltip : '刷新',
							handler : this.refresh.createDelegate(this)
						}, '->']);

				// 把分页工具条，放在页脚
				var paging = new Ext.PagingToolbar({
							pageSize : this.pageSize,
							store : this.store,
							displayInfo : true,
							displayMsg : '第 {0} - {1} 条  共 {2} 条',
							emptyMsg : "无记录"
						});
				if (this.autoload) {
					this.store.load({
								params : {
									start : 0,
									limit : paging.pageSize
								}
							});
				}
				this.bbar = paging;
			},

			// 添加一行
			add : function() {
				this.stopEditing();

				var p = new this.dataRecord();

				var initValue = {};
				for (var i in p.fields.items) {
					var item = p.fields.items[i];
					if (item.name) {
						initValue[item.name] = null;
					}
				}
				p = new this.dataRecord(initValue);
				this.stopEditing();
				this.store.insert(0, p);
				this.startEditing(0, 0);

				p.dirty = true;
				p.modified = initValue;
				if (this.store.modified.indexOf(p) == -1) {
					this.store.modified.push(p);
				}
				if (this.insertedRecords.indexOf(p) == -1) {
					this.insertedRecords.push(p);
				}
			},

			// 删除一行
			del : function() {
				this.stopEditing();

				Ext.Msg.confirm('信息', '确定要删除？', function(btn) {
							if (btn == 'yes') {
								var sm = this.getSelectionModel();
								var cell = sm.getSelectedCell();

								var record = this.store.getAt(cell[0]);
								if (this.store.modified.indexOf(record) != -1) {
									this.store.modified.remove(record);
								}
								// 记录删除了哪些id
								var id = record.get('id');
								if (id == null
										&& this.insertedRecords.indexOf(record) != -1) {
									this.insertedRecords.remove(record);
								} else if (id != null
										&& this.removedRecords.indexOf(record) == -1) {
									this.removedRecords.push(record);
								}

								this.store.remove(record);
							}
						}, this);
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

						var colIndex = this.getColumnModel()
								.findColumnIndex(name);
						if (colIndex == -1) {
							continue;
						}
						var rowIndex = this.store.indexOfId(record.id);
						var editor = this.getColumnModel()
								.getCellEditor(colIndex);

						if (editor
								&& !editor.field.validateValue(value
										? value
										: '')) {
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
									Ext.Msg.alert('信息', json.message,
											this.refresh.createDelegate(this));
								} else {
									Ext.Msg.alert('错误', json.message);
								}
							}.createDelegate(this),
							failure : function() {
								Ext.Msg.alert("错误", "与后台联系的时候出现了问题");
							},
							params : 'removedIds=' + removedIds + '&data='
									+ encodeURIComponent(Ext.encode(data))
									+ this.saveparams
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
Ext.reg('CRUDEditGrid', CRUDEditGrid);