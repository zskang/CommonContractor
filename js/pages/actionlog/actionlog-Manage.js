Ext.onReady(function() {
	var actionloggrid=new JsonGrid({
			id:'actionloggrid',
					dlgWidth : 400,
					dlgHeight : 400,
					sortfield : 'userid',
					groupfield : '',
					allowDel:false,
					formConfig : [{
								fieldLabel : '主键',
								name : 'id',
								hidden : true
							}, {
								fieldLabel : '登陆名称',
								mapping : 'userid',
								name : 'userid'
							}, {
								fieldLabel : '操作时间',
								name : 'actdate'
							}, {
								fieldLabel : '操作内容',
								name : 'actmethod'
							}, {
								fieldLabel : '登录IP',
								name : 'actip'
							}],
					winowConfig : [{
								fieldLabel : '主键',
								name : 'id',
								hidden : true
							}, {
								fieldLabel : '操作人',
								name : 'userid'
							}, {
								fieldLabel : '操作时间',
								name : 'actdate'
							}, {
								fieldLabel : '操作内容',
								name : 'actmethod'
							}, {
								fieldLabel : '登录IP',
								name : 'actip'
							}],
					urlPagedQuery : contextPath + '/actionlog!alllist.action',
					urlSave : contextPath + '/authority/userinfo!save.action',
					urlLoadData : contextPath
							+ '/authority/userinfo!view.action',
					urlRemove :  contextPath
							+ '/authority/userinfo!delete.action'
				});
	var viewport = new Ext.Viewport({
				layout : 'fit',
				frame : false,
				loadMask : {
					msg : '数据加载中...',
					showMask : true
				},
				items : actionloggrid				
			});

});
