var OrgcontractListPanel = Ext.extend(JsonGrid, {
	title : '合同信息列表',
	sortfield : '',
	groupfield : '',
	queryname : 'aptitudename',
	allowGroup : false,
	dlgHeight : 500,
	gridConfig : [{
				fieldLabel : '主键',
				name : 'id',
				hidden : true
			}, {
				fieldLabel : '合同名称',
				name : 'contractname'
			}, {
				fieldLabel : '添加单位',
				name : 'orgname'
			}, {
				fieldLabel : '签订单位',
				name : 'signorgname'
			}, {
				fieldLabel : '合同类型',
				name : 'contracttypename'
			}, {
				fieldLabel : '签订时间',
				name : 'signdate'
			}, {
				fieldLabel : '签订地点',
				name : 'signaddress'
			}, {
				fieldLabel : '签订金额',
				name : 'contractfee'
			}, {
				fieldLabel : '合同有效期',
				name : 'contractlife'
			}, {
				fieldLabel : '甲方签订人',
				name : 'signera'
			}, {
				fieldLabel : '甲方联系电话',
				name : 'tela'
			}, {
				fieldLabel : '乙方签订人',
				name : 'signerb'
			}, {
				fieldLabel : '乙方联系电话',
				name : 'telb'
			}, {
				fieldLabel : '备注',
				name : 'remark'
			}],
	winowConfig : [{
				fieldLabel : '主键',
				name : 'id',
				hidden : true
			}, {
				fieldLabel : '合同名称',
				name : 'contractname'
			}, {
				fieldLabel : '签订单位',
				allowBlank : false,
				xtype : 'Appcombox',
				name : 'signorgid',
				emptyText : '请选择',
				single : true,
				resizable : true,
				dataUrl : contextPath + '/authority/organize!getorg.action',
				dataCode : 'id',
				dataText : 'organizename'
			}, {
				fieldLabel : '合同类型',
				allowBlank : false,
				xtype : 'Appcombox',
				name : 'contracttype',
				emptyText : '请选择',
				single : true,
				resizable : true,
				dataUrl : contextPath
						+ '/authority/sysdictionary!getdictionary.action?type=AGREEMENTTYPE',
				dataCode : 'id',
				dataText : 'lable'
			}, {
				name : 'signdate',
				fieldLabel : '签订时间',
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : '签订地点',
				name : 'signaddress'
			}, {
				fieldLabel : '签订金额',
				xtype : 'numberfield',
				allowBlank : false,
				invalidText : '请录入数字',
				name : 'contractfee'
			}, {
				fieldLabel : '合同有效期',
				name : 'contractlife'
			}, {
				fieldLabel : '甲方签订人',
				name : 'signera'
			}, {
				fieldLabel : '甲方电话',
				name : 'tela'
			}, {
				fieldLabel : '乙方签订人',
				name : 'signerb'
			}, {
				fieldLabel : '乙方电话',
				name : 'telb'
			}, {
				fieldLabel : '备注',
				xtype : 'textarea',
				name : 'remark'
			}],
	urlPagedQuery : contextPath + '/information/orgcontract!alllist.action',
	urlSave : contextPath + '/information/orgcontract!save.action',
	urlLoadData : contextPath + '/information/orgcontract!view.action',
	urlRemove : contextPath + '/information/orgcontract!delete.action'
});
OrgcontractPanel = function() {
	// 合同管理列表
	this.list = new OrgcontractListPanel({
				region : "center"
			});
	OrgcontractPanel.superclass.constructor.call(this, {
				closable : true,
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.list]
			});
};
Ext.extend(OrgcontractPanel, Ext.Panel, {});
Ext.onReady(function() {
			var orgcontractPanel = new OrgcontractPanel();
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
									items : [orgcontractPanel]
								}]
					});
		})