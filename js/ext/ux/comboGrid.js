var filterField = "";
comboGrid = Ext.extend(Ext.form.ComboBox, {
	isRadio : true,
	url : '',
	gWidth : 200,
	gHeight : 350,
	onSelect : Ext.emptyFn,
	resizable : false,
	cVaule : '',
	value : '',
	cText : '',
	initComponent : function() {
		Ext.applyIf(this, {
					url : '',
					gWidth : 200,
					gHeight : 350,
					isRadio : true,
					pageSize : 10

				});
		this.buildColumnModel();
		this.buildRecord();
		this.buildDataStore();
		this.buildToolbar();

		this.buildGrid();
		this.bulidMenu();
		comboGrid.superclass.initComponent.call(this);
	},
	onRender : function(ct, position) {
		Ext.form.ComboBox.superclass.onRender.call(this, ct, position);
		var disValue = "";
		if (this.hiddenName) {
			this.hiddenField = this.el.insertSibling({
						tag : 'input',
						type : 'hidden',
						name : this.hiddenName,
						id : (this.hiddenId || this.hiddenName)
					}, 'before', true);
			var hvalue = this.hiddenValue !== undefined
					? this.hiddenValue
					: this.value !== undefined ? this.value : '';
			var hvalueArray = hvalue.split(this.valueSeparator);

			for (var i = 0; i < this.store.data.length; i++) {
				var r = this.store.getAt(i);
				var newValue = r.data[this.displayField];
				var v = r.data[this.valueField];
				for (var j = 0; j < hvalueArray.length; j++) {
					if (hvalueArray[j] == v) {
						disValue += newValue + this.displaySeparator;
					}
				}

			}
			this.hiddenField.value = this.hiddenValue !== undefined
					? this.hiddenValue
					: this.value !== undefined ? this.value : '';
			this.el.dom.removeAttribute('name');
		}
		if (Ext.isGecko) {
			this.el.dom.setAttribute('autocomplete', 'off');
		}

		if (!this.lazyInit) {
			this.initList();
		} else {
			this.on('focus', this.initList, this, {
						single : true
					});
		}

		if (!this.editable) {
			this.editable = true;
			this.setEditable(false);
		}
		this.setValue(disValue);
	},

	// 建立列模式
	buildColumnModel : function() {
		this.sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : this.isRadio
				});
		var columnHeaders = new Array();
		columnHeaders[0] = new Ext.grid.RowNumberer();
		columnHeaders[1] = this.sm;

		for (var i = 0; i < this.formConfig.length; i++) {
			var col = this.formConfig[i];
			if (col.hideGrid === true) {
				continue;
			}
			columnHeaders.push({
						header : col.fieldLabel,
						sortable : col.sortable,
						dataIndex : col.name,
						renderer : col.renderer,
						hidden : col.hidden
					});
		}
		this.cm = new Ext.grid.ColumnModel(columnHeaders);
		this.cm.defaultSortable = true;
		this.columnModel = this.cm;
	},
	buildRecord : function() {
		this.dataRecord = new Ext.data.Record.create(this.formConfig);
	},
	buildDataStore : function() {
		this.store = new Ext.data.Store({
					url : this.url,
					autoload : true,
					reader : new Ext.data.JsonReader({
								root : "root",
								totalProperty : "totalcount",
								id : this.cVaule
							}, this.dataRecord),
					remoteSort : true
				});
	},
	buildToolbar : function() {
		//
		var checkItems = new Array();
		for (var i = 0; i < this.formConfig.length; i++) {
			var meta = this.formConfig[i];
			if (meta.showInGrid === false) {
				continue;
			}
			var item = new Ext.menu.CheckItem({
						text : meta.Label,
						value : meta.name,
						checked : true,
						group : "filter",
						// hideParent : true,
						checkHandler : this.onItemCheck.createDelegate(this),
						listeners : {

							'click' : function(item, e) {
								filterField = item.value;
							}
						}
					});
			checkItems[checkItems.length] = item;
			filterField = this.formConfig[0].name;
		}

		this.filterButton = new Ext.Toolbar.SplitButton({
					iconCls : "refresh",
					id : 'filterButton',
					text : this.formConfig[0].Label,
					menu : checkItems,
					listeners : {

						'beforerender' : function(e) {
							this.menu.suspendEvents();
						}

					}
				});

		// 输入框
		this.filter = new Ext.form.TextField({
					'name' : 'filter'
				});
		this.tbar = new Ext.Toolbar([{
					id : 'select',
					text : '选择',
					iconCls : 'select',
					tooltip : '选择',
					handler : this.btnselect.createDelegate(this)
				}, {
					id : 'clear',
					text : '清除',
					iconCls : 'clear',
					tooltip : '清除',
					handler : this.clear.createDelegate(this)
				}, '->', this.filterButton, this.filter]);
		this.filter.on('specialkey', this.onFilterKey.createDelegate(this));
		// 把分页工具条，放在页脚
		var paging = new Ext.PagingToolbar({
					pageSize : this.pageSize,
					store : this.store,
					displayInfo : true,
					displayMsg : '第 {0} - {1} 条  共 {2} 条',
					emptyMsg : "无记录"
				});

		this.bbar = paging;
	},
	onItemCheck : function(item, checked) {
		if (checked) {
			this.filterButton.setText(item.value);
			this.filter.setValue('');
		}
	}, // 监听模糊搜索框里的按键
	onFilterKey : function(field, e) {
		this.suspendEvents();
		if (e.getKey() == e.ENTER && field.getValue().length > 0) {
			this.store.baseParams.fieldValue = filterField;
			this.store.baseParams.filterValue = field.getValue();
		} else if (e.getKey() == e.BACKSPACE && field.getValue().length() === 0) {
			this.store.baseParams.filterValue = '';
		} else {
			return;
		}
		this.store.reload();
		this.resumeEvents();
	},
	// 检测至少选择一个
	checkOne : function() {
		var selections = this.getSelections();
		if (selections.length == 0) {
			Ext.MessageBox.alert("提示", "请选择一条记录！");
			return false;
		} else if (selections.length != 1) {
			Ext.MessageBox.alert("提示", "不能选择多行！");
			return false;
		}
		return true;
	},

	// 检测必须选择一个
	checkMany : function() {
		var selections = this.getSelections();
		if (selections.length == 0) {
			Ext.MessageBox.alert("提示", "请至少选择一条记录！");
			return false;
		}
		return true;
	},
	// 弹出添加对话框，选择一条记录
	btnselect : function() {
		ishidden = true;
		this.showMenu.hide();
		var rowOptions = this.grid.getSelectionModel().getSelections();
		var ids = [];
		var names = [];

		if (this.getValue().length > 0 && this.getRawValue().length > 0
				&& !this.isRadio) {
			ids[ids.length] = this.getValue();
			names[names.length] = this.getRawValue();
		}
		for (var i = 0; i < rowOptions.length; i++) {
			var record = rowOptions[i];
			ids[ids.length] = rowOptions[i].get(this.cVaule);
			names[names.length] = rowOptions[i].get(this.cText);
		}
		if (ids.length <= 0) {
			this.setValue('');
			this.setRawValue('');
		} else {
			this.setValue(ids.join(','));
			this.setRawValue(names.join(','));
		};
	},
	clear : function() {

	},
	// 选中搜索属性选项时
	onItemCheck : function(item, checked) {
		if (checked) {
			this.filterButton.setText(item.text + ':');
			this.filterTxt = item.value;
		}
	},
	// 建立Grid
	buildGrid : function() {
		this.grid = new Ext.grid.GridPanel({
					border : false,
					cm : this.cm,
					sm : this.sm,
					frame : true,
					layout : 'fit',
					store : this.store,
					autoDestroy : true,
					loadMask : {
						msg : '数据加载中...',
						showMask : true
					},
					height : this.gHeight,
					width : this.gWidth,
					trackMouseOver : true,
					tbar : this.tbar,
					// 分页
					bbar : this.bbar
				});
	},
	// 建立menu
	bulidMenu : function() {
		this.showMenu = new Ext.menu.Menu({
					items : [this.grid],
					autoDestroy : true,
					// autoShow:true,
					listeners : {
		// 'beforehide' : function(showMenu) {
					//
					// return ishidden;
					// }

					}

				});
	},
	clearValue : function() {
		if (this.hiddenField) {
			this.hiddenField.value = '';
		}
		this.setRawValue('');
		this.lastSelectionText = '';
		this.applyEmptyText();
	},
	setValue : function(v) {
		var text = v;
		if (this.valueField) {
			var r = this.findRecord(this.valueField, v);
			if (r) {
				text = r.data[this.displayField];
			} else if (this.valueNotFoundText !== undefined) {
				text = this.valueNotFoundText;
			}
		}
		this.lastSelectionText = text;
		Ext.form.ComboBox.superclass.setValue.call(this, text);
		this.value = v;
	},
	getValue : function() {
		if (this.valueField) {
			return typeof this.value != 'undefined' ? this.value : '';
		} else {
			return Ext.form.ComboBox.superclass.getValue.call(this);
		}
	},
	listeners : {
		'expand' : function(combo) {
			if (this.menu == null) {
				this.menu = this.showMenu;
			}
			if (this.store == null) {
				this.grid.store.load({
							params : {
								start : 0,
								limit : this.pageSize
							}
						});
			}
			this.menu.show(this.el, "tl-bl?");
			// this.menu.show(combo.getEl());
			this.collapse();

		},
		'focus' : function(w, h) {
			this.collapse();
			if (this.menu != null) {
				this.menu.hide();
			}
		},
		'collapse' : function(cmp) {
			/**
			 * 防止当store的记录为0时不出现下拉的状况
			 */
			if (this.grid.store.getCount() == 0) {
				this.store.add(new Ext.data.Record([{}]));
			}
		},
		onDestroy : function() {
			if (this.rendered) {
				if (this.menu) {
					this.menu.destory();
				}
				if (this.grid) {
					this.grid.destroy();
				}
			}
			comboGrid.superclass.onDestroy.call(this);
		}

	}
});
Ext.reg('comboGrid', comboGrid);