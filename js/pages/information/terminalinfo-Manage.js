// 设备信息列表
var TerminalinfoListGrid = Ext.extend(JsonGrid, {
			title : '设备信息列表',
			sortfield : '',
			groupfield : '',
			queryname : 'simcode',
			allowGroup : false,
			gridConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '设备编号',
						name : 'deviceid'
					}, {
						fieldLabel : '设备型号',
						name : 'devicetype'
					}, {
						fieldLabel : '生产厂家',
						name : 'factory'
					}, {
						fieldLabel : '出厂时间',
						name : 'producedate'
					}, {
						fieldLabel : '购买时间',
						name : 'buydate'
					}, {
						fieldLabel : 'SIM卡号',
						name : 'simid'
					}, {
						fieldLabel : '所属单位',
						name : 'orgname'
					}, {
						fieldLabel : '所属维护组',
						name : 'patrolgroupname'
					}

			],
			winowConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '设备编号',
						name : 'deviceid'
					}, {
						fieldLabel : '设备型号',
						name : 'devicetype'
					}, {
						fieldLabel : '生产厂家',
						name : 'factory'
					}, {
						fieldLabel : '出厂时间',
						name : 'producedate',
						xtype : 'datefield',
						format : 'Y-n-d'
					}, {
						fieldLabel : '购买时间',
						name : 'buydate',
						xtype : 'datefield',
						format : 'Y-n-d'
					}, {
						fieldLabel : 'SIM卡号',
						allowBlank : false,
						xtype : 'Appcombox',
						name : 'simid',
						emptyText : '请选择',
						single : true,
						resizable : true,
						dataUrl : contextPath
								+ '/information/terminalinfo!tersimlist.action',
						dataCode : 'simcode',
						dataText : 'simcode'
					}],
			urlPagedQuery : contextPath
					+ '/information/terminalinfo!alllist.action',
			urlSave : contextPath + '/information/terminalinfo!save.action',
			urlLoadData : contextPath + '/information/terminalinfo!view.action',
			urlRemove : contextPath + '/information/terminalinfo!delete.action'
		});
TerminalinfoPanel = function() {
	// 设备管理列表
	this.list = new TerminalinfoListGrid({
				region : "center"
			});
	TerminalinfoPanel.superclass.constructor.call(this, {
				closable : true,
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.list]
			});
};
Ext.extend(TerminalinfoPanel, Ext.Panel, {});
Ext.onReady(function() {
			var terminalinfoPanel = new TerminalinfoPanel();
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
									items : [terminalinfoPanel]
								}]
					});
		})