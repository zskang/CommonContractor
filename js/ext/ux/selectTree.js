selectTree = Ext.extend(Ext.tree.TreePanel, {
			autoScroll : true,
			dataUrl : "getAllTree.do",// 获取所有树节点
			urlSaveTree : 'urlSaveTree.do',// 点击确定时保存到数据库
			ischecked : true,// 是否有选择框
			rootid : 'root',
			roottext : '选择',
			loadparams : {},
			saveparams : {},
			initComponent : function() {
				Ext.applyIf(this, {
							animate : false,
							collapsible : false,
							loadMask : {
								msg : '数据加载中...'
							},
							rootVisible : true,
							border : false,
							lines : false
						});
				Ext.applyIf(this, {
							loader : new Ext.tree.TreeLoader({
										dataUrl : this.dataUrl, // 调用controller的方法，加载树的数据项
										expanded : false,
										preloadChildren:true,
										baseAttrs : {
											uiProvider : Ext.ux.TreeCheckNodeUI
										},
										listeners : {
											"beforeload" : this.beforeload
													.createDelegate(this)
										}
									}),
							root : {
								nodeType : 'async',
								text : this.roottext,
								id : this.rootid
							},
							tbar : this.buildToolbar()
						});
				selectTree.superclass.initComponent.call(this);
			},
			buildToolbar : function() {
				var toolbar = [{
							text : '保存',
							iconCls : 'save',
							tooltip : '保存',
							handler : this.save.createDelegate(this)
						}, '-', {
							text : '展开',
							iconCls : 'expand',
							tooltip : '展开所有分类',
							handler : this.expandAll.createDelegate(this)
						}, {
							text : '收缩',
							iconCls : 'collapse',
							tooltip : '合拢所有分类',
							handler : this.collapseAll.createDelegate(this)
						}, {
							text : '刷新',
							iconCls : 'refresh',
							tooltip : '刷新所有节点',
							handler : this.refresh.createDelegate(this)
						}];
				return toolbar;
			},

			createChild : function() {
				var sm = this.getSelectionModel();
				var n = sm.getSelectedNode();
				if (!n) {
					n = this.getRootNode();
				} else {
					n.expand(false, false);
				}
				this.createNode(n);
			},
			beforeload : function(treeloader, node) {
				treeloader.baseParams = this.loadparams;
			},
			save : function() {
				// 向数据库发送一个json数组，保存排序信息
				var ids = "";
				if (this.ischecked) {
					var checkedNodes = this.getCheckedNodes();
					for (var i = 0; i < checkedNodes.length; i++) {
						ids += "," + checkedNodes[i].attributes.nodeid
					}
					if (ids != "") {
						ids = ids.substring(1, ids.length);
					}
				} else {
					var n = this.getSelectedNode();
					if (n == null) {
						Ext.Msg.alert('提示', "请选择一个节点");
						return;
					} else {
						ids = n.attributes.nodeid;

					}
				}
				if (ids != "") {
					Ext.Ajax.request({
								url : this.urlSaveTree + '?ids=' + ids,
								params : this.saveparams,
								method : 'POST',
								success : function() {
									Ext.Msg.alert('提示', '操作成功！');
									this.body.unmask();
									this.refresh();
								}.createDelegate(this),
								failure : function() {
									this.el.unmask();
									Ext.Msg.alert('提示', '操作失败！');
								}
							});
				}
			},

			collapseAll : function() {
				setTimeout(function() {
							var node = this.getSelectedNode();
							if (node == null) {
								this.getRootNode().eachChild(function(n) {
											n.collapse(true, false);
										});
							} else {
								node.collapse(true, false);
							}
						}.createDelegate(this), 10);
			},
			expandAll : function() {
				setTimeout(function() {
							var node = this.getSelectedNode();
							if (node == null) {
								this.getRootNode().eachChild(function(n) {
											n.expand(false, false);
										});
							} else {
								node.expand(false, false);
							}
						}.createDelegate(this), 10);
			},
			refresh : function() {
				//this.root.reload();
				//this.root.expand(false, false);
				alert(this.getChecked(null,this.getSelectedNode()));
			},

			// 返回当前选中的节点，可能为null
			getSelectedNode : function() {
				return this.getSelectionModel().getSelectedNode();
			},
			getCheckedNodes : function() {
				return this.getChecked();
			},
			onDestroy : function() {
				selectTree.superclass.onDestroy.call(this);
			}
		});
Ext.reg('selectTree', selectTree);
