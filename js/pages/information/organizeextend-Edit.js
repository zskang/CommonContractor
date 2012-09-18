Ext.onReady(function() {
	var organizeForm = new Ext.Panel({
		border : false,
		layout : 'border',
		items : {
			region : 'center',
			xtype : 'form',
			labelWidth : 70,
			labelAlign : 'right',
			align : 'center',
			border : false,
			anchor : '98%',
			autoHeight : true,
			waitMsgTarget : true,
			defaults : {
				width : 233
			},
			reader : new Ext.data.JsonReader({}, Ext.data.Record.create([{
								name : 'id'
							}, {
								name : 'orgid'
							}, {
								name : 'orgname'
							}, {
								name : 'shortname'
							}, {
								name : 'legalperson'
							}, {
								name : 'regdate',
								type : 'date',
								mapping : 'regdate',
								dateFormat : 'Y-m-d'
							}, {
								name : 'capital'
							}, {
								name : 'address'
							}, {
								name : 'contract'
							}, {
								name : 'tel'
							}, {
								name : 'fax'
							}, {
								name : 'url'
							}])),
			defaultType : 'textfield',
			items : [{
						fieldLabel : '主键',
						name : 'id',
						xtype : 'hidden'
					}, {
						fieldLabel : '单位id',
						name : 'orgid',
						xtype : 'hidden'
					}, {
						fieldLabel : '单位名称',
						name : 'orgname',
						editable : false
					}, {
						fieldLabel : '英文缩写',
						name : 'shortname',
						maxLength : 70
					}, {
						fieldLabel : '法人代表',
						name : 'legalperson',
						allowBlank : false,
						maxLength : 50
					}, {
						fieldLabel : '登记日期',
						name : 'regdate',
						xtype : 'datefield',
						format : 'Y-n-d',
						allowBlank : false
					}, {
						fieldLabel : '注册资金',
						name : 'capital',
						xtype : 'numberfield'
					}, {
						fieldLabel : '单位地址',
						name : 'address',
						maxLength : 150
					}, {
						fieldLabel : '联系人',
						name : 'contract',
						allowBlank : false,
						maxLength : 50
					}, {
						fieldLabel : '联系电话',
						name : 'tel',
						allowBlank : false,
						maxLength : 50
					}, {
						fieldLabel : '传真',
						name : 'fax',
						maxLength : 50
					}, {
						fieldLabel : '公司网站',
						name : 'url',
						maxLength : 200
					}],
			buttonAlign : 'center',
			minButtonWidth : 60,
			buttons : [{
				text : '提交',
				handler : function(btn) {
					var frm = organizeForm.getForm();
					if (frm.isValid()) {
						btn.disable();
						frm.submit({
							url : contextPath
									+ '/information/organizeextend!save.action',
							waitTitle : '请稍候',
							waitMsg : '正在提交表单数据,请稍候...',
							success : function(form, action) {
								btn.enable();
							},
							failure : function() {
								Ext.Msg.show({
											title : '错误提示',
											msg : '联系后台失败',
											buttons : Ext.Msg.OK,
											fn : function() {
												btn.enable();
											},
											icon : Ext.Msg.ERROR
										});
							}
						});
					}
				}
			}, {
				text : '重置',
				handler : function() {
					organizeForm.getForm().reset();
				}
			}]
		}
	});
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
							items : [organizeForm]
						}]
			});
	organizeForm.getForm().load({
				url : contextPath + '/information/organizeextend!view.action',
				waitMsg : '载入中'
			});
});