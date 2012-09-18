// 系统字典列表
SystemDictionaryListPanel = Ext.extend(JsonGrid, {
			title : '字典列表',
			// 配置列表显示界面，name对应数据库字段
			gridConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hideable : false,
						hidden : true
					}, {
						fieldLabel : '代码编号',
						name : 'codevalue'
					}, {
						fieldLabel : '代码名称',
						name : 'lable'
					}, {
						fieldLabel : '代码类型',
						name : 'columntype'
					}, {
						fieldLabel : '备注',
						name : 'remark'
					}],
			// 配置编辑时弹出界面,name对应数据库字段
			winowConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '代码编号',
						maxLength:18,
						allowBlank:false,
						name : 'codevalue'
					}, {
						fieldLabel : '代码名称',
						maxLength:18,
						allowBlank:false,
						name : 'lable'
					}, {
						fieldLabel : '代码类型',
						maxLength:18,
						allowBlank:false,
						name : 'columntype'
					}, {
						fieldLabel : '备注',
						maxLength:150,
						name : 'remark'
					}],
			urlPagedQuery : contextPath
					+ '/authority/sysdictionary!alllist.action',
			urlSave : contextPath + '/authority/sysdictionary!save.action',
			urlLoadData : contextPath + '/authority/sysdictionary!view.action',
			urlRemove : contextPath + '/authority/sysdictionary!delete.action'
		});

// 系统资源管理管理
SystemDictionaryPanel = function() {
	this.list = new SystemDictionaryListPanel({
				region : "center"
			});
	SystemDictionaryPanel.superclass.constructor.call(this, {
				id : "SystemDictionaryPanel",
				closable : true,
				title : '字典管理',
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.list],
				onDestroy:function() {
					if (this.rendered) {
						if (this.list) {
							this.list.destroy();
							this.list=null;
							delete list;
						}
					}
					SystemDictionaryPanel.superclass.onDestroy.call(this);
				}
			});

};
Ext.extend(SystemDictionaryPanel, Ext.Panel, {});
