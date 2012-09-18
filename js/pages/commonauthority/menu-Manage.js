if (!Global.platformMenuLoader) {
	Global.platformMenuLoader = new Ext.tree.TreeLoader({
		dataUrl : contextPath + '/authority/menu!getmenutree.action'

	})
};
// 父菜单树
menuparenttree = new Ext.tree.TreePanel({
	tools : [ {
		id : "refresh",
		handler : function() {
			menuparenttree.root.reload();
		},
		scope : this
	} ],
	autoScroll : true,
	root : new Ext.tree.AsyncTreeNode({
		id : 'root',
		text : '所有菜单',
		loader : Global.platformMenuLoader,
		iconCls : 'treeroot-icon'
	})
});
// 菜单列表
SystemMenuListPanel = Ext.extend(JsonGrid, {
	sortfield : 'parentname',
	groupfield : 'parentname',
	allowegroup : false,
	id : 'SystemMenuListPanel',
	title : '菜单列表',
	gridConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		hidden : true
	}, {
		fieldLabel : '菜单名称',
		name : 'text'
	}, {
		fieldLabel : '菜单链接',
		name : 'hrefurl'
	}, {
		fieldLabel : '上级菜单',
		name : 'parentname'

	}, {
		fieldLabel : '上级菜单ID',
		name : 'parentid',
		hidden : true
	}, {
		fieldLabel : '菜单样式',
		name : 'itemcls'
	}, {
		fieldLabel : '应用程序类',
		name : 'appclass'
	} ],
	winowConfig : [ {
		fieldLabel : '主键',
		name : 'id',
		hidden : true
	}, {
		fieldLabel : '菜单名称',
		maxLength : 18,
		allowBlank : false,
		name : 'text'
	}, {
		fieldLabel : '菜单链接',
		maxLength : 200,
		name : 'hrefurl'
	}, {

		xtype : "treecombo",
		fieldLabel : "父菜单",
		name : "parent",
		hiddenName : "parentid",
		displayField : "text",
		valueField : "id",
		tree : menuparenttree
	}, {
		fieldLabel : '菜单样式',
		maxLength : 25,
		name : 'itemcls'
	}, {
		fieldLabel : '排列顺序',
		xtype : 'numberfield',
		name : 'ordernum',
		value : 0
	}, {
		fieldLabel : '应用程序类',
		maxLength : 30,
		name : 'appclass'
	}, {
		fieldLabel : '备注',
		maxLength : 150,
		name : 'remark'
	} ],
	urlPagedQuery : contextPath + '/authority/menu!alllist.action',
	urlSave : contextPath + '/authority/menu!save.action',
	urlLoadData : contextPath + '/authority/menu!view.action',
	urlRemove : contextPath + '/authority/menu!delete.action'
});
// 系统菜单管理
SystemMenuPanel = function() {
	this.list = new SystemMenuListPanel({
		region : "center"
	});
	var topbar = this.list.getTopToolbar();
	var btn_grant = new Ext.Button({
		text : '分配资源',
		iconCls : 'intro',
		disabled : true
	});
	// 点击授权按钮事件
	btn_grant.on('click', function(b, e) {
		if (this.list.selModel) {
			ShowGrantTab(this.list.selModel.getSelections()[0].id);
		}
	}, this);
	topbar.insert(2, btn_grant);
	this.tree = new Ext.tree.TreePanel({
		title : "菜单树",
		region : "west",
		autoScroll : true,
		width : 200,
		border : false,
		margins : '0 2 0 0',
		tools : [ {
			id : "refresh",
			handler : function() {
				this.tree.root.reload();
			},
			scope : this
		} ],
		root : new Ext.tree.AsyncTreeNode({
			id : "root",
			text : "所有菜单",
			iconCls : 'treeroot-icon',
			expanded : true,
			loader : Global.platformMenuLoader
		})
	});
	this.tree.on("click", function(node, eventObject) {
		//var id = (node.id != 'root' ? node.id : "");
		this.list.store.baseParams.parentId = node.id;
		this.list.store.removeAll();
		this.list.store.load();
	}, this);
	SystemMenuPanel.superclass.constructor.call(this, {
		id : "SystemMenuPanel",
		closable : true,
		title : '菜单管理',
		border : false,
		autoScroll : true,
		layout : "border",
		items : [ this.tree, this.list ],
		onDestroy:function() {
			if (this.rendered) {
				if (this.list) {
					this.list.destroy();
					this.list=null;
					delete list;
				}
				if (this.tree) {
					this.tree.destroy();
					this.tree=null;
					delete this.tree;
				}
			}
			SystemMenuPanel.superclass.onDestroy.call(this);
		}
	});
	this.list.on('rowclick', function(g, r, e) {
		if (g.selModel.getSelections().length == 1) {
			btn_grant.setDisabled(false);
		} else {
			btn_grant.setDisabled(true);
		}
	}, this);
};
Ext.extend(SystemMenuPanel, Ext.Panel, {});
function ShowGrantTab(id) {
	permissiontree = new selectTree({
		region : "east",
		autoScroll : true,
		title : '分配资源',
		width : 250,
		border : false,
		checkModel : 'cascade', // 对树的级联多选
		margins : '0 2 0 0',
		rootVisible : false,
		dataUrl : contextPath
				+ '/authority/menu!getmenuresourcetree.action?menuid=' + id,
		ischecked : true,
		rootVisible : true,
		expanded : true,
		roottext : '所有操作',
		save : function() {
			// 向数据库发送一个json数组，保存排序信息
			// 菜单主键列表
			var pds = "";
			if (this.ischecked) {
				var checkedNodes = this.getCheckedNodes();
				for ( var i = 0; i < checkedNodes.length; i++) {
					if (checkedNodes[i].isLeaf()) {
						pds += "," + checkedNodes[i].attributes.nodeid;

					}
				}
				if (pds != "") {
					pds = pds.substring(1, pds.length);
				}
			}
			if (pds != "") {
				Ext.Ajax.request({
					url : contextPath
							+ '/authority/menu!savemenuresource.action',
					params : {
						permissionids : pds,
						menuid : id
					},
					method : 'POST',
					success : function() {
						Ext.Msg.alert('提示', '操作成功！');
					},
					failure : function() {
						this.el.unmask();
						Ext.Msg.alert('提示', '操作失败！');
					}
				});
			} else {
				Ext.Msg.alert('提示', '请选择要分配的资源！');
			}
		}
	});
	// 菜单分配资源windows
	var menuGrantwidow = new Ext.Window({
		layout : 'fit',
		width : 500,
		height : 480,
		draggable : true,
		modal : true,
		frame : true,
		autoScroll : false,
		closeAction : 'hide',
		items : [ permissiontree ],
		buttons : [ {
			text : '关闭',
			iconCls : 'deleteIcon',
			handler : function() {
				menuGrantwidow.close();
			}
		} ]
	});
	menuGrantwidow.show();
}