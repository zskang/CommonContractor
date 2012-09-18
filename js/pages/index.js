Ext.onReady(function() {

			// 列1panel
			var cpanel1 = new Ext.Panel({
						id : 'cpanel1',
						layout : 'column',
						border : false,
						rowHeight : .5,
						items : [{
									xtype : "panel",
									title : '待办任务',
									columnWidth : .5

								}, {
									xtype : "panel",
									title : '通知',
									columnWidth : .5
								}]
					});
			var cpanel2 = new Ext.Panel({
						id : 'cpanel2',
						layout : 'column',
						border : false,
						rowHeight : .5,
						items : [{
									xtype : "panel",
									title : '铁塔数量统计',
									columnWidth : .5

								}, {
									xtype : "panel",
									title : '铁塔类型统计',
									columnWidth : .5

								}]
					});
			var hpanel = new Ext.Panel({
						region : 'center',
						border : false,
						layout : 'ux.row',
						items : [cpanel1, cpanel2]
					});
			var viewport = new Ext.Viewport({
						layout : 'border',
						border : false,
						items : [hpanel]
					});
		})