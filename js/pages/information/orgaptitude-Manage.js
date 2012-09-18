var OrgaptitudeListPanel = Ext.extend(JsonGrid, {
	title : '资质信息列表',
	sortfield : '',
	groupfield : '',
	queryname : 'aptitudename',
	allowGroup : false,
	gridConfig : [{
				fieldLabel : '主键',
				name : 'id',
				hidden : true
			}, {
				fieldLabel : '单位名称',
				name : 'orgname'
			}, {
				fieldLabel : '资质类型',
				name : 'aptitudetypename'
			}, {
				fieldLabel : '资质等级',
				name : 'aptitudegradename'
			}, {
				fieldLabel : '证书名称',
				name : 'aptitudename'
			}, {
				fieldLabel : '发证日期',
				name : 'grantdate'
			}, {
				fieldLabel : '有效期',
				name : 'validity',
				renderer : function(val) {
					return val + '月'
				}
			}, {
				fieldLabel : '发证机构',
				name : 'certifyorg'
			}, {
				fieldLabel : '是否过期',
				renderer : function(val) {
					return parseInt(val) > 0
							? '未过期'
							: '<font color="red">过期<font>'
				},
				name : 'overdue'
			}],
	winowConfig : [{
				fieldLabel : '主键',
				name : 'id',
				hidden : true
			}, {
				fieldLabel : '资质类型',
				allowBlank : false,
				xtype : 'Appcombox',
				name : 'aptitudetype',
				emptyText : '请选择',
				single : true,
				dataUrl : contextPath
						+ '/authority/sysdictionary!getdictionary.action?type=APTITUDETYPE',
				dataCode : 'id',
				dataText : 'lable'
			}, {
				fieldLabel : '资质等级',
				allowBlank : false,
				xtype : 'Appcombox',
				name : 'aptitudegrade',
				emptyText : '请选择',
				single : true,
				dataUrl : contextPath
						+ '/authority/sysdictionary!getdictionary.action?type=APTITUDEGRADE',
				dataCode : 'id',
				dataText : 'lable',
				getListParent : function() {
					return this.ownerCt.getEl();
				}
			}, {
				fieldLabel : '证书名称',
				name : 'aptitudename'
			}, {
				fieldLabel : '发证日期',
				name : 'grantdate',
				xtype : 'datefield',
				format : 'Y-n-d'
			}, {
				fieldLabel : '有效期(月)',
				xtype : 'spinnerfield',
				minValue : 1,
				maxValue : 100,
				name : 'validity'
			}, {
				fieldLabel : '发证机构',
				name : 'certifyorg'
			}],
	urlPagedQuery : contextPath + '/information/orgaptitude!alllist.action',
	urlSave : contextPath + '/information/orgaptitude!save.action',
	urlLoadData : contextPath + '/information/orgaptitude!view.action',
	urlRemove : contextPath + '/information/orgaptitude!delete.action'
});

OrgaptitudePanel = function() {
	// 合同管理列表
	this.list = new OrgaptitudeListPanel({
				region : "center"
			});
	OrgaptitudePanel.superclass.constructor.call(this, {
				closable : true,
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.list]
			});
};
Ext.extend(OrgaptitudePanel, Ext.Panel, {});
Ext.onReady(function() {
			var orgaptitudePanel = new OrgaptitudePanel();
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
									items : [orgaptitudePanel]
								}]
					});
		})