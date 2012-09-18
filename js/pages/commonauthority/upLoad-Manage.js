Ext.onReady(function() {

	// 复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
				header : '下载', // 列标题
				dataIndex : 'download',
				width : 35,
				renderer : downloadColumnRender
			}, {
				header : '标题',
				dataIndex : 'title'
			}, {
				header : '大小(byte)',
				dataIndex : 'filesize'
			}, {
				header : '存储路径',
				dataIndex : 'path',
				width : 280
			}, {
				header : '上传日期',
				dataIndex : 'uploaddate',
				width : 130
			}, {
				header : '描述',
				dataIndex : 'remark'
			}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : 'otherDemo.ered?reqCode=queryFileDatas'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'totalcount',
							root : 'root'
						}, [{
									name : 'fileid'
								}, {
									name : 'title'
								}, {
									name : 'path'
								}, {
									name : 'uploaddate'
								}, {
									name : 'filesize'
								}, {
									name : 'remark'
								}])
			});

	// 翻页排序时带上查询条件
	store.on('beforeload', function() {
				this.baseParams = {
					title : Ext.getCmp('filetitle').getValue()
				};
			});
	// 每页显示条数下拉选择框
	var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				triggerAction : 'all',
				mode : 'local',
				store : new Ext.data.ArrayStore({
							fields : ['value', 'text'],
							data : [[10, '10条/页'], [20, '20条/页'],
									[50, '50条/页'], [100, '100条/页'],
									[250, '250条/页'], [500, '500条/页']]
						}),
				valueField : 'value',
				displayField : 'text',
				value : '20',
				editable : false,
				width : 85
			});
	var number = parseInt(pagesize_combo.getValue());
	// 改变每页显示条数reload数据
	pagesize_combo.on("select", function(comboBox) {
				bbar.pageSize = parseInt(comboBox.getValue());
				number = parseInt(comboBox.getValue());
				store.reload({
							params : {
								start : 0,
								limit : bbar.pageSize
							}
						});
			});

	// 分页工具栏
	var bbar = new Ext.PagingToolbar({
				pageSize : number,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
			});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
				items : [{
							text : '上传',
							iconCls : 'uploadIcon',
							handler : function() {
								win_swfupload.show();
							}
						}, '-', {
							text : '删除文件',
							iconCls : 'deleteIcon',
							handler : function() {
								delFiles();
							}
						}, '->', {
							xtype : 'textfield',
							id : 'filetitle',
							name : 'filetitle',
							emptyText : '请输入文件标题',
							width : 150,
							enableKeyEvents : true,
							// 响应回车键
							listeners : {
								specialkey : function(field, e) {
									if (e.getKey() == Ext.EventObject.ENTER) {
										queryFiles();
									}
								}
							}
						}, {
							text : '查询',
							iconCls : 'page_findIcon',
							handler : function() {
								queryFiles();
							}
						}, {
							text : '刷新',
							iconCls : 'page_refreshIcon',
							handler : function() {
								store.reload();
							}
						}]
			});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
				title : '<span style="font-weight:normal">文件列表</span>',
				height : 500,
				frame : true,
				autoScroll : true,
				region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
				store : store, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				sm : sm, // 复选框
				tbar : tbar, // 表格工具栏
				bbar : bbar,// 分页工具栏
				viewConfig : {
	// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
				// forceFit : true
				},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});

	grid.on("cellclick", function(pGrid, rowIndex, columnIndex, e) {
				var store = pGrid.getStore();
				var record = store.getAt(rowIndex);
				var fieldName = pGrid.getColumnModel()
						.getDataIndex(columnIndex);
				// columnIndex为小画笔所在列的索引,缩阴从0开始
				// 这里要非常注意!!!!!
				if (fieldName == 'download' && columnIndex == 2) {
					var fileid = record.get("fileid");
					// 通过iFrame实现类ajax文件下载
					// 这个很重要
					var downloadIframe = document.createElement('iframe');
					downloadIframe.src = '' + fileid;
					downloadIframe.style.display = "none";
					document.body.appendChild(downloadIframe);
				}
			});

	// 页面初始自动查询数据
	store.load({
				params : {
					start : 0,
					limit : bbar.pageSize
				}
			});

	// 布局模型
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
			});

	// SWFUpload窗口
	var win_swfupload = new Ext.Window({
				title : '<span style="font-weight:normal">上传</span>',
				width : 500,
				height : 500,
				resizable : false,
				layout : 'fit',
				constrain : true,
				closeAction : 'hide',
				maximizable : true,
				listeners : {
					'hide' : function(obj) {
						store.reload();
					}
				},
				items : [{
					xtype : 'uploadpanel',
					uploadUrl : contextPath
							+ '/authority/fileload!uploadFiles.action',
					filePostName : 'myUpload',
					flashUrl : contextPath
							+ '/js/ext/ux/swfupload.swf',
					fileSize : '500MB',
					height : 400,
					border : false,
					fileTypes : '*.*', // 在这里限制文件类型:'*.jpg,*.png,*.gif'
					fileTypesDescription : '所有文件',
					postParams : {
						path : contextPath+'upload\\' //这只是个参数,由后台来读取;也可以直接由后台来分配路径
					}
				}]
			});

	// 查询表格数据
	function queryFiles() {
		store.load({
					params : {
						start : 0,
						limit : bbar.pageSize,
						title : Ext.getCmp('filetitle').getValue()
					}
				});
	}

	// 获取选择行
	function getCheckboxValues() {
		// 返回一个行集合JS数组
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// 将JS数组中的行级主键，生成以,分隔的字符串
		var strChecked = jsArray2JsString(rows, 'fileid');
		Ext.MessageBox.alert('提示', strChecked);
		// 获得选中数据后则可以传入后台继续处理
	}

	// 生成一个下载图标列
	function downloadColumnRender(value) {
		return "<a href='javascript:void(0);'><img src='" + webContext
				+ "/resource/image/ext/download.png'/></a>";;
	}

	/**
	 * 删除文件
	 */
	function delFiles() {
		var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.Msg.alert('提示', '请先选中要删除的文件!');
			return;
		}
		var strChecked = jsArray2JsString(rows, 'fileid');
		Ext.Msg.confirm('请确认', '你真的要删除选中的文件吗?', function(btn, text) {
					if (btn == 'yes') {
						showWaitMsg();
						Ext.Ajax.request({
									url : 'otherDemo.ered?reqCode=delFiles',
									success : function(response) {
										var resultArray = Ext.util.JSON
												.decode(response.responseText);
										Ext.Msg.alert('提示', resultArray.msg);
										store.reload();
									},
									failure : function(response) {
										Ext.Msg.alert('提示', "文件删除失败");
									},
									params : {
										strChecked : strChecked
									}
								});
					}
				});
	}

});