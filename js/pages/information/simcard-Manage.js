// SIM信息列表
var SIMListGrid = Ext.extend(JsonGrid, {
	title : 'SIM信息列表',
	sortfield : '',
	groupfield : '',
	queryname : 'simcode',
	allowGroup : false,
	gridConfig : [{
				fieldLabel : '主键',
				name : 'id',
				hidden : true
			}, {
				fieldLabel : 'SIM卡类型',
				name : 'simtype'
			}, {
				fieldLabel : 'SIM卡号',
				name : 'simcode'
			}, {
				fieldLabel : '所属部门',
				name : 'deptname'
			}, {
				fieldLabel : '办理时间',
				name : 'registdate'
			}],
	winowConfig : [{
				fieldLabel : '主键',
				name : 'id',
				hidden : true
			}, {
				allowBlank : false,
				xtype : 'Appcombox',
				name : 'simtype',
				fieldLabel : 'SIM卡类型',
				emptyText : '请选择',
				single : true,
				dataUrl : contextPath
						+ '/authority/sysdictionary!getdictionary.action?type=SIMTYPE',
				dataCode : 'id',
				dataText : 'lable'
			}, {
				fieldLabel : 'SIM卡号',
				name : 'simcode'
			}, {
				id : 'simservice',
				fieldLabel : '开通服务',
				allowBlank : false,
				xtype : 'Appcombox',
				name : 'simservice',
				emptyText : '请选择',
				single : false,
				resizable : true,
				dataUrl : contextPath
						+ '/authority/sysdictionary!getdictionary.action?type=SIMSERVICE',
				dataCode : 'id',
				dataText : 'lable'
			}, {
				id : 'deptid',
				fieldLabel : '所属部门',
				xtype : 'Appcombox',
				name : 'deptid',
				emptyText : '请选择',
				single : true,
				resizable : true,
				dataUrl : contextPath
						+ '/information/department!getdept.action',
				dataCode : 'id',
				dataText : 'deptname'
			}, {
				fieldLabel : '办理时间',
				xtype : 'datefield',
				name : 'registdate',
				format : 'Y-m-d'
			}],
	urlPagedQuery : contextPath + '/information/simcard!alllist.action',
	urlSave : contextPath + '/information/simcard!save.action',
	urlLoadData : contextPath + '/information/simcard!view.action',
	urlRemove : contextPath + '/information/simcard!delete.action'
});
SIMPanel = function() {
	// SIM卡管理列表
	this.list = new SIMListGrid({
				id : "SIMListGrid",
				region : "center"
			});
	SIMPanel.superclass.constructor.call(this, {
				id : "SIMPanel",
				closable : true,
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.list]
			});
};
Ext.extend(SIMPanel, Ext.Panel, {});
Ext.onReady(function() {
			var sIMPanel = new SIMPanel();
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
									items : [sIMPanel]
								}]
					});
		})