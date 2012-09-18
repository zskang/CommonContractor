if (!Global.platformOrgLoader) {
	Global.platformOrgLoader = new Ext.tree.TreeLoader({
		dataUrl : contextPath + '/authority/orgrel!getorgdeptstafftree.action',
		baseParams : {
			lv : 2,
			flag : 2
		}
	})
};
// 父菜组织
orgparenttree = new Ext.tree.TreePanel({
	tools : [ {
		id : "refresh",
		handler : function() {
			orgparenttree.root.reload();
		},
		scope : this
	} ],
	rootVisible: false,
	autoScroll : true,
	root : new Ext.tree.AsyncTreeNode({
		id : 'root',
		text : '所有组织',
		loader : Global.platformOrgLoader,
		iconCls : 'treeroot-icon'
	}),
	listeners : {
		click : function(n) {
			var orgtype = n.attributes.objtype;
			var orgid = n.attributes.orgid;
			Ext.getCmp('orgtype').setValue(orgtype);
			Ext.getCmp('orgid').setValue(orgid);
		}
	}

});
// 人员基本信息panel
var staffPanel = new Ext.FormPanel(
		{
			id : 'staffPanel',
			defaultType : 'textfield',
			labelAlign : 'right',
			title : '人员基本信息',
			labelWidth : 70,
			bodyStyle : 'padding:10px',
			loadMask : {
				msg : '数据加载中...'
			},
			reader : new Ext.data.JsonReader({}, [ 'parent', 'job', 'realname',
					'sex', 'birth', 'cardid', 'school', 'graduatedate',
					'educate', 'tel', 'orgid', 'id', 'orgname', 'deptname' ]),
			items : [
					{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					},
					{
						id : 'orgid',
						fieldLabel : '组织类型',
						name : 'orgid',
						hidden : true
					},
					{
						id : 'orgtype',
						fieldLabel : '组织类型',
						name : 'orgtype',
						hidden : true
					},
					{
						xtype : "treecombo",
						fieldLabel : "上级组织",
						name : "parent",
						hiddenName : "parentid",
						displayField : "text",
						valueField : "id",
						anchor : '95%',
						tree : orgparenttree
					},
					{
						fieldLabel : '姓名',
						name : 'realname',
						allowBlank : false,
						maxLength : 15,
						anchor : '95%'
					},
					{
						fieldLabel : '职务',
						name : 'job',
						allowBlank : true,
						maxLength : 30,
						anchor : '95%'
					},
					{
						xtype : 'combo',
						fieldLabel : '性别',
						mode : 'local',
						name : 'sex',
						editable : false,
						store : new Ext.data.SimpleStore({
							data : [ [ '男', '0' ], [ '女', '1' ] ],
							fields : [ 'text', 'value' ]
						}),
						displayField : 'text',
						valueField : 'value',
						mode : 'local',
						triggerAction : 'all',
						emptyText : '请选择性别',
						anchor : '95%'
					},
					{
						fieldLabel : '出生日期',
						xtype : 'datefield',
						name : 'birth',
						allowBlank : true,
						format : 'Y-m-d',
						anchor : '95%'
					},
					{
						fieldLabel : '身份证号码',
						name : 'cardid',
						allowBlank : true,
						maxLength : 18,
						regex : /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/,
						regexText : '输入正确的身份号码',
						anchor : '95%'
					},
					{
						fieldLabel : '毕业学校',
						name : 'school',
						maxLength : 36,
						anchor : '95%'
					},
					{
						fieldLabel : '最高学历',
						allowBlank : false,
						xtype : 'Appcombox',
						name : 'educate',
						emptyText : '请选择',
						single : true,
						resizable : true,
						dataUrl : contextPath
								+ '/authority/sysdictionary!getdictionary.action?type=EDUCATE',
						dataCode : 'id',
						dataText : 'lable',
						anchor : '95%'
					},
					{
						fieldLabel : '毕业时间',
						name : 'graduatedate',
						xtype : 'datefield',
						format : 'Y-m-d',
						allowBlank : true,
						anchor : '95%'
					},
					{
						fieldLabel : '联系电话',
						name : 'tel',
						regex : /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/,
						regexText : '请输入正确的联系电话',
						allowBlank : true,
						maxLength : 13,
						anchor : '95%'
					} ],
			buttonAlign : 'center',
			minButtonWidth : 60,
			listeners : {
				"close" : function() {
					Ext.getCmp('staffInfoPanel').store.reload();
				}
			},
			buttons : [
					{
						text : '提交',
						handler : function(btn) {
							var frm = staffPanel.getForm();
							if (frm.isValid()) {

								btn.disable();
								frm.submit({
									url : contextPath
											+ '/information/staff!save.action',
									waitTitle : "请稍候",
									waitMsg : '提交数据，请稍候...',
									success : function(form, action) {
										btn.enable();
										Ext.Msg.alert('提示', '操作成功！');
										Ext.getCmp('staffInfoPanel').store.reload();
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
							staffPanel.getForm().reset();
						}
					} ]
		});
// 人员证书信息Grid
var persioncertifyGrid = new CRUDEditGrid({
	title : '人员证书信息',
	sortfield : '',
	groupfield : '',
	queryname : '',
	disabled : true,
	allowGroup : false,
	autoload : false,
	formConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		hidden : true
	}, {
		fieldLabel : '人员id',
		name : 'personid',
		hidden : true
	}, {
		fieldLabel : '证书名称',
		name : 'certifyname',
		editor : new Ext.form.TextField()
	}, {
		fieldLabel : '证书编号',
		name : 'certifyid',
		editor : new Ext.form.TextField()
	}, {
		fieldLabel : '颁发机构',
		name : 'issue',
		editor : new Ext.form.TextField()
	}, {
		fieldLabel : '颁发时间',
		name : 'issuedate',
		renderer : Ext.util.Format.dateRenderer('Y-m-d'),
		editor : new Ext.form.DateField({
			format : 'Y-m-d'
		})
	}, {
		fieldLabel : '有效期',
		name : 'validaity',
		editor : new Ext.form.TextField()
	} ],
	url : contextPath + '/information/staff!allpersioncertifylist.action',
	urlSubmit : contextPath + '/information/staff!savecertify.action'

});
// 人员培训信息Grid
var persontrainGrid = new CRUDEditGrid({
	title : '人员培训信息',
	sortfield : '',
	groupfield : '',
	queryname : '',
	allowGroup : false,
	autoload : false,
	disabled : true,
	formConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		hidden : true
	}, {
		fieldLabel : '人员id',
		name : 'personid',
		hidden : true
	}, {
		fieldLabel : '开始时间',
		name : 'startdate',
		renderer : Ext.util.Format.dateRenderer('Y-m-d'),
		editor : new Ext.form.DateField({
			format : 'Y-m-d'
		})
	}, {
		fieldLabel : '结束时间',
		name : 'enddate',
		renderer : Ext.util.Format.dateRenderer('Y-m-d'),
		editor : new Ext.form.DateField({
			format : 'Y-m-d'
		})
	}, {
		fieldLabel : '培训机构',
		name : 'trainorg',
		editor : new Ext.form.TextField()
	}, {
		fieldLabel : '培训内容',
		name : 'train',
		editor : new Ext.form.TextField()
	}, {
		fieldLabel : '培训成绩',
		name : 'grade',
		editor : new Ext.form.TextField()
	}, {
		fieldLabel : '证书名称',
		name : 'certifyname',
		editor : new Ext.form.TextField()
	} ],
	url : contextPath + '/information/staff!allpersontrainlist.action',
	urlSubmit : contextPath + '/information/staff!savetrain.action'
});
// 人员tab
var staffTabPanel = new Ext.TabPanel({
	activeTab : 0,
	region : 'center',
	closable : false,
	defaults : {
		autoScroll : true
	},
	items : [ staffPanel, persioncertifyGrid, persontrainGrid ]
});
staffTabPanel.hideTabStripItem(persioncertifyGrid);
staffTabPanel.hideTabStripItem(persontrainGrid);

StaffListPanel = Ext.extend(JsonGrid, {
	title : '人员列表',
	allowGroup : false,
	gridConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		hidden : true
	}, {
		fieldLabel : '姓名',
		name : 'realname'
	}, {
		fieldLabel : '性别',
		name : 'sex'
	}, {
		fieldLabel : '出生年月',
		name : 'birth'

	}, {
		fieldLabel : '所属单位',
		name : 'orgname'
	}, {
		fieldLabel : '所属部门',
		name : 'deptname'
	}, {
		fieldLabel : '身份证号码',
		name : 'cardid'
	}, {
		fieldLabel : '学历',
		name : 'educate'
	}, {
		fieldLabel : '手机',
		name : 'tel'
	} ],
	urlRemove : contextPath + '/information/staff!delete.action',
	urlPagedQuery : contextPath + '/information/staff!alllist.action',
	// 弹出添加对话框，添加一条新记录
	add : function() {
		this.openDialog('新增')
		Ext.getCmp("staffPanel").getForm().reset();
		staffTabPanel.setActiveTab(0);
		persioncertifyGrid.setDisabled(true);
		persontrainGrid.setDisabled(true);
	},
	// 弹出修改对话框
	edit : function() {
		this.openDialog('修改')
		Ext.getCmp("staffPanel").getForm().load(
				{
					url : contextPath + '/information/staff!view.action?id='
							+ this.selModel.getSelections()[0].id,
					waitMsg : '数据加载中...'
				});
		persioncertifyGrid.setDisabled(false);
		persontrainGrid.setDisabled(false);
		persioncertifyGrid.store.reload({
			params : {
				start : 0,
				limit : this.pageSize,
				id : this.selModel.getSelections()[0].id
			}
		});
		persontrainGrid.store.reload({
			params : {
				start : 0,
				limit : this.pageSize,
				id : this.selModel.getSelections()[0].id
			}
		});
		persioncertifyGrid.saveparams = '&personid='
				+ this.selModel.getSelections()[0].id;
		persontrainGrid.saveparams = '&personid='
				+ this.selModel.getSelections()[0].id;
	},
	// action 编辑 弹出对话框
	actionedit : function(grid, rowIndex, colIndex) {
		var rec = grid.getStore().getAt(rowIndex);

		this.openDialog('修改')
		Ext.getCmp("staffPanel").getForm().load(
				{
					url : contextPath + '/information/staff!view.action?id='
							+ rec.get("id")
				});
		persioncertifyGrid.setDisabled(false);
		persontrainGrid.setDisabled(false);
		persioncertifyGrid.store.reload({
			params : {
				start : 0,
				limit : this.pageSize,
				id : rec.get("id")
			}
		});
		persontrainGrid.store.reload({
			params : {
				start : 0,
				limit : this.pageSize,
				id : rec.get("id")
			}
		});
		persioncertifyGrid.saveparams = '&personid=' + rec.get("id");
		persontrainGrid.saveparams = '&personid=' + rec.get("id");
	},
	// 打开对话框
	openDialog : function(title) {
		if (!this.dialog) {
			this.createDialog();
		}
		this.dialog.setTitle(title);
		this.dialog.show();
	},
	// 创建弹出式对话框
	createDialog : function() {
		this.dialog = new Ext.Window({
			layout : 'fit',
			width : 450,
			height : 420,
			draggable : true,
			constrain : true,// 是否可以溢出父窗体
			loadMask : {
				msg : '数据加载中...'
			},
			modal : true,
			frame : true,
			autoScroll : false,
			closeAction : 'hide',
			items : [ staffTabPanel ]
		});
	}
});
StaffInfoPanel = function() {
	this.list = new StaffListPanel({
		id:'staffInfoPanel',
		queryname : 'staffname',
		region : "center"
	});
	StaffInfoPanel.superclass.constructor.call(this, {
		closable : true,
		border : false,
		autoScroll : true,
		layout : "border",
		items : [ this.list ],
		onDestroy:function() {
			if (this.rendered) {
				if (this.list) {
					this.list.destroy();
					this.list=null;
					delete list;
				}
			}
			StaffInfoPanel.superclass.onDestroy.call(this);
		}
	});
}
Ext.extend(StaffInfoPanel, Ext.Panel, {});
Ext.onReady(function() {
	var staffInfoPanel = new StaffInfoPanel();
	var viewport = new Ext.Viewport({
		layout : 'border',
		frame : false,
		loadMask : {
			msg : '数据加载中...',
			showMask : true
		},
		items : [ {
			region : 'center',
			layout : 'fit',
			items : [ staffInfoPanel ]
		} ]
	});
})