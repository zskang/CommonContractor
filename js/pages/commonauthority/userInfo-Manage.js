if (!Global.platformOrgLoader) {
	Global.platformOrgLoader = new Ext.tree.TreeLoader({
				dataUrl : contextPath + '/authority/organize!getorgtree.action',
				baseParams : {
					pid : ''
				}
			})
};
// 人员Store
staffstore = new Ext.data.JsonStore({
	root : 'root',
	autoLoad : true,
	pageSize : 10,
	totalProperty : 'totalcount',
	url : contextPath + '/authority/userinfo!getstaffgrid.action',
	baseParams : {orgid : (userorg=='root'?'':userorg)},
	fields : ['id', 'realname', 'sex', 'deptid','deptname','orgid','parentname']
});
// 人员grid
staffgrid = new Ext.grid.GridPanel({
			store : staffstore,
			columns : [{
						dataIndex : 'id',
						header : '编号',
						hidden : true,
						hideable : false
					}, {
						dataIndex : 'realname',
						header : '姓名'
					}, {
						dataIndex : 'sex',
						header : '性别',
						renderer:function(value){
                			if (value == '02') {
                    			return "女";
                			} else {
                    			return "男";
                			}
                		}
					},{
						dataIndex : 'parentname',
						header : '组织'
					}, {
						dataIndex : 'deptname',
						header : '部门'
					}],
			bbar : new PagingComBo({
						rowComboSelect : true,
						displayInfo : true,
						store : staffstore
					})
		});
SystemUserListPanel = Ext.extend(JsonGrid, {
			dlgWidth : 400,
			dlgHeight : 400,
			sortfield : 'username',
			title : '用户列表',
			groupfield : '',
			// 显示列表配置
			gridConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {
						fieldLabel : '登陆名称',
						mapping : 'userid',
						name : 'userid'
					}, {
						fieldLabel : '人员姓名',
						name : 'staffname'
					}, {
						fieldLabel : '所属组织',
						name : 'orgname'
					}],
			winowConfig : [{
						fieldLabel : '主键',
						name : 'id',
						hidden : true
					}, {    
						   id:'optyoe_radiogroup',
						   xtype: 'radiogroup',  
						   fieldLabel: '操作类型',  
						   name: 'rb-auto', 
						   items: [           
						           {boxLabel: '新增', name: 'addstaff', inputValue: 2,checked:true},
						           {boxLabel: '选择', name: 'addstaff', inputValue: 1,listeners:{'check':function(r,b){
						        	  if(b){
						        		  Ext.getCmp('staffcombox').show();
						        		  Ext.getCmp("staffcombox").allowBlank=false;
						        		  
						        		  Ext.getCmp("system_user_orgid").hide();
						        		  Ext.getCmp("system_user_orgid").setComboValue('','');
						        		  Ext.getCmp("system_user_orgid").allowBlank=true;
						        		  
						        		  Ext.getCmp('system_user_name').hide();
						        		  Ext.getCmp("system_user_name").setValue('');
						        		  Ext.getCmp("system_user_name").allowBlank=true;
						        		  
						        	  }else{//xz
						        		  Ext.getCmp('staffcombox').hide();
						        		  Ext.getCmp("staffcombox").setValue('');
						        		  Ext.getCmp("staffcombox").allowBlank=true;
						        		  
						        		  Ext.getCmp("system_user_orgid").show();
						        		  Ext.getCmp("system_user_orgid").allowBlank=false;
						        		  
						        		  Ext.getCmp('system_user_name').show();
						        		  Ext.getCmp("system_user_name").allowBlank=false;
						        	  }
						           }} }
						   ]
						}, {
						id:'staffcombox',
						fieldLabel : '人员姓名',
						name : 'staff',
						xtype : 'popupwinfield',
						returnObject : true,
						hidden:true,
						hiddenName:'username',
						valueField : "id",
						editable:true,
						displayField : "realname",
						win : new GridSelectWin({
									title : '选择人员',
									grid : staffgrid
								}),
						choice : function(data, win) {
							this.setValue(data && data.length ? data[0] : data);
							// Ext.getCmp("system_user_orgid").setComboValue(data[0].orgid,data[0].parentname);
							this.fireEvent('select', data, win);
						}
					}, {
						id:'system_user_name',
						fieldLabel : '人员姓名',
						maxLength:18,
						allowBlank:false,
						name : 'staffname'
					}, {
						id:'userid_textfield',
						fieldLabel : '登陆名称',
						maxLength:18,
						allowBlank:false,
						name : 'userid'
					}, {
						fieldLabel : '登陆密码',
						maxLength:18,
						allowBlank:false,
						inputType: 'password',    // 密码
						name : 'password'
					}, // {
						// fieldLabel : '电话',
						// regex :
						// /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/,
						// regexText : '请输入正确的联系电话',
						// name : 'phone'
					// }, {
					// fieldLabel : '电子邮件',
					// vtype:'email',
					// maxLength:30,
					// name : 'email'
					// },
					{
						id:"system_user_orgid",
						xtype : "treecombo",
						fieldLabel : "上级组织",
						editable:true,
						allowBlank:false,
						name : "org",
						hiddenName : "orgid",
						displayField : "text",
						valueField : "id",
						tree : new Ext.tree.TreePanel({
									autoScroll : true,
									root : new Ext.tree.AsyncTreeNode({
												id : 'root',
												text : '所有组织',
												loader : new Ext.tree.TreeLoader({
													dataUrl : contextPath + '/authority/organize!getownerorgtree.action',
													baseParams : {
													pnode : userorg
													}
												}),
												iconCls : 'treeroot-icon'
											})
						})
					}],
			urlPagedQuery : contextPath + '/authority/userinfo!alllist.action',
			urlSave : contextPath + '/authority/userinfo!save.action',
			urlLoadData : contextPath + '/authority/userinfo!view.action',
			urlRemove : contextPath + '/authority/userinfo!delete.action',
			// 打开对话框
			openDialog : function(id, title, isload) {

				if (this.openWindowUrl.length == 0) {
					if (!this.dialog) {
						this.createDialog();
					}
					this.dialog.show();
					this.dialog.setTitle(title);
					this.formPanel.getForm().reset();
					if (isload) {
						Ext.Ajax.request({
									url : this.urlLoadData,
									params : 'id=' + id + this.loadparams,
									waitMsg : "正在加载数据,请稍侯...",
									callback : function(options, success, response) {
										var r = Ext.decode(response.responseText);
										this.formPanel.getForm().setValues(r);
										
									},
									scope : this
								});
						// this.formPanel.load({
						// url : this.urlLoadData,
						// params : 'id=' + id + this.loadparams
						// });
						//disable
					}
				} else {
					window.showModalDialog(this.openWindowUrl + "?id=" + id,
							this.digModel)
				}
				//修改时  禁用 相关录入项
				if(id){
					Ext.getCmp('optyoe_radiogroup').hide();
					Ext.getCmp('system_user_name').disable();
					Ext.getCmp('userid_textfield').disable();
					Ext.getCmp('system_user_orgid').disable();
				}else{
					Ext.getCmp('optyoe_radiogroup').show();
					Ext.getCmp('system_user_name').enable();
					Ext.getCmp('userid_textfield').enable();
					Ext.getCmp('system_user_orgid').enable();
				}
				
			}


		});

// 系统用户管理
SystemUserPanel = function() {
	this.list = new SystemUserListPanel({
				id : 'SystemUserListPanel',
				region : "center"
			});
	SystemUserPanel.superclass.constructor.call(this, {
				id : "SystemUserPanel",
				closable : true,
				title : '用户管理',
				border : false,
				autoScroll : true,
				layout : "border",
				items : [this.list],
				onDestroy:function() {
					if (this.rendered) {
						if (this.list) {
							this.list.destroy();
							this.list=null;
							delete list;
						}
					}
					SystemUserPanel.superclass.onDestroy.call(this);
				}
			});

};
Ext.extend(SystemUserPanel, Ext.Panel, {});
