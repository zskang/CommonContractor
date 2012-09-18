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
	autoScroll : true,
	rootVisible: false,
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
// 部门显示列表
DepartmentListPanel = Ext.extend(JsonGrid, {
	title : '部门列表',
	sortfield : '',
	groupfield : '',
	queryname : 'deptname',
	allowGroup : false,
	gridConfig : [ {
		fieldLabel : '组织主键',
		name : 'orgid',
		hidden : true
	}, {
		fieldLabel : '组织名称',
		name : 'orgname',
		hidden : true
	}, {
		fieldLabel : '主键',
		name : 'id',
		hidden : true
	}, {
		fieldLabel : '部门名称',
		name : 'deptname'
	}, {
		fieldLabel : '负责人',
		name : 'officer'
	}, {
		fieldLabel : '部门职责',
		name : 'remark'

	}, {
		fieldLabel : '上级部门',
		name : 'parentname'
	} ],
	winowConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		xtype : 'hidden'
	}, {
		fieldLabel : '部门名称',
		maxLength : 18,
		allowBlank : false,
		name : 'deptname'
	}, {
		fieldLabel : '负责人',
		maxLength : 18,
		allowBlank : false,
		name : 'officer'
	}, {
		fieldLabel : '部门职责',
		maxLength : 150,
		name : 'remark',
		xtype : 'textarea'
	}, {
		id : 'orgid',
		fieldLabel : '组织类型',
		name : 'orgid',
		hidden : true
	}, {
		id : 'orgtype',
		fieldLabel : '组织类型',
		name : 'orgtype',
		hidden : true
	}, {
		xtype : "treecombo",
		fieldLabel : "上级组织",
		name : "parent",
		hiddenName : "parentid",
		displayField : "text",
		valueField : "id",
		anchor : '95%',
		tree : orgparenttree
	} ],
	urlPagedQuery : contextPath + '/information/department!alllist.action',
	urlSave : contextPath + '/information/department!save.action',
	urlLoadData : contextPath + '/information/department!view.action',
	urlRemove : contextPath + '/information/department!delete.action'
});
// 部门panel
DepartmentPanel = function() {
	this.list = new DepartmentListPanel({
		region : "center"
	});
	this.staffGrid = new JsonGrid({
		title : '部门人员',
		allowGroup : false,
		region : 'east',
		allowEdit : false,
		width : 400,
		gridConfig : [ {
			fieldLabel : '主键',
			name : 'id',
			hidden : true,
			menuDisabled : true
		}, {
			fieldLabel : '姓名',
			name : 'staffname'
		}, {
			fieldLabel : '手机',
			name : 'tel'
		} ],
		autoload : false,
		urlPagedQuery : contextPath
				+ '/information/department!alllistoid.action',
		urlRemove : contextPath
				+ '/information/department!deleteorganizeregion.action'
	});
//	this.list.on('rowdblclick', function(g, r, e) {
//		this.staffGrid.store.load({
//			params : {
//				start : 0,
//				limit : this.staffGrid.bbar.pageSize,
//				orgid : g.selModel.getSelections()[0].id
//			}
//		});
//	}, this);
	DepartmentPanel.superclass.constructor.call(this, {
		closable : true,
		border : false,
		autoScroll : true,
		layout : "border",
		items : [ this.list],
		onDestroy:function() {
			if (this.rendered) {
				if (this.list) {
					this.list.destroy();
					this.list=null;
					delete list;
				}
			}
			DepartmentPanel.superclass.onDestroy.call(this);
		}
	});
};
Ext.extend(DepartmentPanel, Ext.Panel, {});
Ext.onReady(function() {
	var departmentPanel = new DepartmentPanel();
	var viewport = new Ext.Viewport({
		layout : 'border',
		frame : true,
		loadMask : {
			msg : '数据加载中...',
			showMask : true
		},
		items : [ {
			region : 'center',
			layout : 'fit',
			items : [ departmentPanel ]
		} ]
	});
})