Ext.onReady(function() {
	var equipmentGrid = new JsonGrid({
		title : '设备列表',
		sortfield : '',
		groupfield : '',
		queryname : 'equipmentname',
		allowGroup : false,
		formConfig : [ {
			fieldLabel : '主键',
			name : 'id',
			hidden : true
		}, {
			fieldLabel : '设备型号',
			name : 'departmentname'
		}, {
			fieldLabel : '设备编号',
			name : 'linkmaninfo'
		}, {
			fieldLabel : '生产厂家',
			name : 'parentname'

		}, {
			fieldLabel : '出厂时间',
			name : 'parentid'
		}, {
			fieldLabel : '购买时间',
			name : 'parentname'
		}],
		winowConfig : [{
			fieldLabel : '主键',
			name : 'id',
			hidden : true
		}, {
			fieldLabel : '设备型号',
			name : 'departmentname'
		}, {
			fieldLabel : '设备编号',
			name : 'linkmaninfo'
		}, {
			fieldLabel : '生产厂家',
			name : 'parentname'

		}, {
			fieldLabel : '出厂时间',
			name : 'parentid',
			xtype:'datefield'
		}, {
			fieldLabel : '购买时间',
			name : 'parentname',
			xtype:'datefield'
		}],
		urlPagedQuery : contextPath + '/authority/organize!alllist.action',
		urlSave : contextPath + '/authority/organize!save.action',
		urlLoadData : contextPath + '/authority/organize!view.action',
		urlRemove : contextPath + '/authority/organize!delete.action'
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
							items : [equipmentGrid]
						}]
			});
});