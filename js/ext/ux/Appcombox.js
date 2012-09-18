Appcombox = Ext.extend(Ext.ux.form.SuperBoxSelect, {
			dataUrl : '',
			dataCode : 'code',
			dataText : 'text',
			single : true,
			initComponent : function() {
				Ext.QuickTips.init();
				Ext.apply(this, {
							emptyText : '选择',
							displayField : this.dataText,
							valueField : this.dataCode,
							singleMode : this.single,
							mode : 'remote',
							triggerAction : 'all',
							baseParams : '',
							extraItemCls : 'x-tag',
							width : 300,
							autoScroll : true,
							resizable : true,
							forceSelection : true
						});
				this.buildDataStore();
				Appcombox.superclass.initComponent.call(this);
			},
			buildDataStore : function() {
				this.store = new Ext.data.Store({
							url : this.dataUrl,
							autoload : true,
							reader : new Ext.data.JsonReader({}, [{
												name : this.dataCode
											}, {
												name : this.dataText
											}]),
							baseParams : this.baseParams

						})
				this.store.load();
			}

		});
Ext.reg('Appcombox', Appcombox);