/*
 * Ext JS Library 3.2.1
 * http://www.lanyotech.com/
 * 对ExtJs扩展和增强
 */
/**
 * @class Ext
 * @singleton
 */
Ext.apply(Ext, {
			clone : function(obj) {
				return Ext.apply({}, obj);
			},
			/**
			 * 拷贝源对象中的属性到目标对象中,不会拷贝notFields中的属性
			<pre>
			<code>	 
			//例子：
			var target = {name:'张三',age:20};
			var source = {name:'李四',age:22,sex:'男',remark:'我是李四里面remark属性的值'}};
			Ext.copyToIf(target,source,"name,age");
			console.dir(target); //out : {name:'张三',age:20,sex:'男',remark:'我是source里面remark属性的值'}}
			</code>
			</pre>
			 *
			 * @param {Object} target 拷贝的目标对象 
			 * @param {Object} source 拷贝的源对象
			 * @param {String/Array} notFields {String/Array} 不会拷贝的字段 
			 *  
			 */
			copyToIf : function(target, source, notFields) {
				notFields = notFields || [];
				for (var p in source) {
					if (notFields.indexOf(p) < 0) {
						target[p] = source[p];
					}
				}
				return target;
			},
			extendX : function(supr, fn, scope) {
				return Ext.extend(supr, fn
								.call(scope || window, supr.prototype));
			},
			/**
			 * 删除对象中的某个属性
			 * <pre>
			 * <code>
			 * //例子： 
			 * var o = {name:'zhangsan',age:20,sex:'男'};
			 * Ext.del(o,'age','sex');
			 * 
			 * console.debug(o); // age和sex被删除了 
			 * //out : {name:'zhangsan'}
			 * </code>
			 * </pre>
			 *   	 
			 * @param {Object} o 目标对象
			 * @param {String/Array} args 需要删除的属性
			 * 
			 */
			del : function(o, args/*,arg,arg...*/) {
				var ps = Array.prototype.splice.call(arguments, 1);
				Ext.each(ps, function(p) {
							delete o[p];
						});
			},
			args : function() {
				var args = arguments.callee.caller.arguments;
				if (Ext.isArray(args[0])) {
					return args[0];
				} else {
					return Array.prototype.slice.call(args, 0)
				}
				return args;
			},
			/**
			 * 获取Record数组中 每个Record某字段的值
			 * <pre>
			 * <code>
			 * //例子:
			 * var records=grid.getStore().getRanage();
			 * var props=Ext.pluckRecord(records,"id");
			 * console.debug(props);
			 * </pre>
			 * </code>
			 * 
			 * @param {Array} arr Ext.data.Record 数组
			 * @param {String} prop Record中的某字段
			 * 
			 * @return {Array}
			 */
			pluckRecord : function(arr, prop) {
				var ret = [], val;
				Ext.each(arr, function(v) {
							if (v.get) {
								ret.push(v.get(prop));
							} else {
								ret.push(window.undefined);
							}
						});
				return ret;
			},

			/**
			 * 获取对象中的某个属性值,  v 支持以“.”导航
			 * 
			 * <pre>
			 * <code>
			 * //例子: 
			 * var user = {name:'张三',dept:{name:'开发部'}}
			 * var name = Ext.getObjVal(user,'dept.name');
			 * alert(name); // '开发部'
			 * </code>
			 * </pre>
			 * 
			 * @param {Object} o 目标对象
			 * @param {String} v 要获取的属性名称，支持对象.导航
			 * @return {Mixed} 得到的属性值
			 * 
			 */
			getObjVal : function(o, v) {
				try {
					if (!o)
						return null;
					if (!v)
						return o;
					var ps = v.split('.'), val = o;
					for (var i = 0; i < ps.length; i++) {
						if (!val)
							return null;
						val = val[ps[i]];
					}
					return val;
				} catch (e) {
					return null
				}
			},

			/**
			 * 获取一个对象拥有属性的个数
			 * <pre>
			 * <code>
			 * //例子 : 
			 * var o = {name:'sss',age:29}
			 * alert(Ext.objPcount(o));//2
			 * </pre>
			 * </code>
			 * 
			 * @param {Object} o 待查找的对象
			 * @return {Number} 拥有属性的个数
			 * 
			 */
			objPcount : function(o) {
				var count = 0;
				if (typeof o == 'object') {
					for (var p in o) {
						if (o.hasOwnProperty(p)) {
							count++;
						}
					}
				}
				return count;
			},
			urlAppend : function(url, s) {
				if (!Ext.isEmpty(s)) {
					if (Ext.isObject(s))
						s = Ext.urlEncode(s);
					return url + (url.indexOf('?') === -1 ? '?' : '&') + s;
				}
				return url;
			},
			/**
			 * 格式化金额
			 * 
			 * @param {Number} value 要格式的数字
			 * @param {Number} num 保留几位小数
			 * @return {Number} 
			 */
			formatMoney : function(v, num) {
				if (typeof v !== 'number') {
					var v = parseFloat(v);
					if (isNaN(v))
						return 0;
				}
				num = num || 0
				return parseFloat(Math.round(v * Math.pow(10, num))
						/ Math.pow(10, num).toFixed(num));
			},
			arr2Map : function(key) {
				var arr = Ext.combine.apply(Ext, Array.prototype.slice.call(
								arguments, 1));
				var obj = {};
				if (arr.length) {
					Ext.each(arr, function(o) {
								if (Ext.isDefined(o[key])) {
									obj[o[key]] = o;
								}
							});
				}
				return obj;
			},
			arr2obj : function(arr, valPrefix, fields, filterFn) {
				var values = {};
				var getV = function(v) {
					if (v && v.value !== undefined)
						v = v.value;// 根据value属性来得到
					else if (v && v.id !== undefined)
						v = v.id;// 根据id属性来得到
					if (v && typeof v == "object" && v.clearTime)
						v = v.format("Y-m-d");
					return v;
				}

				if (Ext.isArray(valPrefix)) {
					valPrefix = '';
					if (Ext.isFunction(fields)) {
						filterFn = fields;
						fields = null;
					}
					fields = valPrefix;
				}
				valPrefix = valPrefix || '';
				if (Ext.isArray(arr)) {
					Ext.each(arr, function(data, i) {
								if (data instanceof Ext.data.Record) {
									data = data.data;
								}
								if (fields && fields.length) {
									if (!Ext.isFunction(filterFn)
											|| filterFn(data) !== false) {
										for (var j = 0; j < fields.length; j++) {
											var p = fields[j];
											var k = valPrefix + p;
											values[k] = values[k] || [];
											values[k][i] = getV(data[p]);
										}
									}
								} else {
									if (!Ext.isFunction(filterFn)
											|| filterFn(data) !== false) {
										for (var p in data) {
											var k = valPrefix + p;
											values[k] = values[k] || [];
											values[k][i] = getV(data[p]);
										}
									}
								}
							});
				}
				return values;
			}
		});

/**
 * @class Array
 */
Ext.applyIf(Array.prototype, {
			/**
			 * 拷贝数组
			 * @return {Array}
			 */
			copy : function() {
				return this.slice();
			},
			/**
			 * 判断数组是否为空
			 * 
			 * @return {Boolean}
			 */
			isEmpty : function() {
				if (this.length && this.length > 0) {
					return false;
				}
				return true;
			},

			/**
			 * 根据数组索引删除数组中的元素
			 * @param {Number} index
			 */
			removeAt : function(index) {
				this.splice(index, 1);
			},

			/**
			 * 根据数组中对象元素的某字段值删除数组中的元素
			 * <pre>
			 * <code>
			 * //例子：
			 * var arr = [{id:1,name:'zhangsan'},{id:2,name:'wangwu'},{id:3,name:'lisi'}];
			 * arr.removeKey(3,'id');//现在要删除lishi 
			 * </pre>
			 * </code>
			 * 
			 * @param {String/Number} keyValue 删除对应属性的值
			 * @param {String/Number} keyName 删除对应属性
			 */
			removeKey : function(keyValue, keyName) {
				keyName = keyName || 'id';
				Ext.each(this, function(o, i) {
							if (o[keyName] == keyValue) {
								this.removeAt(i);
								return;
							}
						}, this);
			},

			/**
			 * 判断obj在数组中是否存在
			 * 
			 * @param {Mixed} obj 需要查找的值
			 * @return {Boolean}
			 */
			contains : function(obj) {
				return (this.indexOf(obj) >= 0);
			},

			/**
			 * 过滤掉数组中重复的对象，返回过滤后的新数组
			 * <pre>
			 * <code>
			 * //例子：
			 * var arr = ['abc','abc','123','234','',''];
			 * var newarr = arr.distinct(true);
			 * console.debug(newarr);//out:["abc", "123", "234"]
			 * </pre>
			 * </code>
			 * 
			 * @param {Boolean} valid 是否过滤掉数组中的空对象
			 * @return {Array} 返回一个全新的数组
			 */
			distinct : function(valid) {
				var ArrayObj = {};
				var returnArray = [];
				for (var i = 0; i < this.length; i++) {
					if (ArrayObj[this[i]] || (valid && Ext.isEmpty(this[i])))
						continue;
					ArrayObj[this[i]] = this[i];
					returnArray.push(this[i])
				}
				return returnArray
			}
		});

/**
 * @class Cabletech.Ext.Util
 * @single
 * Cabletech实用工具 
 */
Ext.namespace('Cabletech.Ext.Util');
Ext.apply(Cabletech.Ext.Util, {
	NormalClass : {},
	/**
	 * 常用作双状态下拉框的内容
	 * @type Array
	 */
	theStatus : [["启用", 0], ["停用", -1]],
	/**
	 * 在EditorGridPanel中用来渲染只读列的背景色
	 * @type String
	 */
	readOnlyGridCellColor : "#F2F2F2",
	/**
	 * 在GridPanel中用来renderer勾选（√）
	 * @type String
	 */
	successTag : "<font color=green>&#8730;</font>",
	/**
	 * 在GridPanel中用来renderer叉选（X）
	 * @type String
	 */
	failureTag : "<font color=red>X</font>",
	/**
	 * 在GridPanel中用来renderer超链接。
	 * <pre>
	 * <code>
	{
	id: 'col1',
	header: 'Column1',
	dataIndex: 'col1',
	width: 220,
	renderer:Cabletech.Ext.Util.linkRenderer
	}
	 * </code>
	 * </pre>
	 * @param {Object} v 要renderer的值
	 */
	linkRenderer : function(v) {
		if (!v)
			return "";
		else
			return String
					.format(
							"<a style=\"color:blue;font-weight:800;\" title=\"点击后将在新窗口中打开{0}\" href='{0}' target='_blank'>{0}</a>",
							v);
	},
	/**
	 * 在GridPanel中用来renderer 布尔值（是|否）。
	 * <pre>
	 * <code>
	{
	id: 'col1',
	header: 'Column1',
	dataIndex: 'col1',
	width: 220,
	renderer:Cabletech.Ext.Util.booleanRender
	}
	 * </code>
	 * </pre>
	 * @param {Object} v 要renderer的值
	 */
	booleanRender : function(value, p, record) {
		return value
				? "<span style=\"color:green;\">是</span>"
				: "<span style=\"color:red;\">否</span>";
	},

	/**
	 * 在GridPanel中用来renderer 日期。
	 * <pre>
	 * <code>
	{
	id: 'col1',
	header: 'Column1',
	dataIndex: 'col1',
	width: 220,
	renderer:Cabletech.Ext.Util.dateRender('Y-m-d G:i:s')
	}
	 * </code>
	 * </pre>
	 * @param {String} format renderer的日期格式
	 */
	dateRender : function(format) {
		format = format || "Y-m-d G:i";
		return Ext.util.Format.dateRenderer(format);
	},

	imgRender : function(v) {
		if (!v)
			return "";
		else
			return String
					.format(
							"<a style=\"color:green;font-weight:800\" title=\"点击后将在新窗口中打开{0}\" href='{0}' target='_blank'>查看</a>",
							v)
	},

	/**
	 * 在GridPanel中用来renderer 金额。
	 * <pre>
	 * <code>
	{
	id: 'col1',
	header: 'Column1',
	dataIndex: 'col1',
	width: 220,
	renderer:Cabletech.Ext.Util.moneyRender
	}
	 * </code>
	 * </pre>
	 * @param {Number} v renderer的金额
	 */
	moneyRender : function(v) {
		if (v) {
			if (v.toFixed) {
				if (v < 0)
					return "<font color=red>" + v.toFixed(2) + "<font>";
				else
					return v.toFixed(2);
			} else
				return v;
		}
	},
	/**
	 * 在GridPanel中用来renderer 对象中的某个属性。
	 * <pre>
	 * <code>
	//例如：col1对应的对象是:{a:{b:1}}
	{
	id: 'col1',
	header: 'Column1',
	dataIndex: 'col1',
	width: 220,
	renderer:Cabletech.Ext.Util.objectRender("a.b",Cabletech.Ext.Util.readOnlyGridCellColor)
	}
	 * </code>
	 * </pre>
	 * @param {String} p renderer的对象的属性路径，支持用'.'来导航
	 * @param {String} backgroundColor renderer的column的背景色
	 */
	objectRender : function(p, backgroundColor) {
		return function(v, meta) {
			if (backgroundColor)
				meta.attr = 'style="background-color:' + backgroundColor + ';"';
			var s = "";
			try {
				s = v ? eval("v." + p) : ""
			} catch (e) {
			}
			return s;
		}
	},

	/**
	 * 在GridPanel中用来renderer 下拉列表对应的对象。Combox对应的对象一般格式：{text:'text',value:'value'}或者{title:'text',value:'value'}
	 * <pre>
	 * <code>
	{
	id: 'col1',
	header: 'Column1',
	dataIndex: 'col1',
	width: 220,
	editor:new MyCombox(),
	renderer:Cabletech.Ext.Util.comboxRender
	}
	 * </code>
	 * </pre>
	 * @param {Object} v renderer的对象
	 */
	comboxRender : function(v) {
		if (v) {
			return v.text || v.title || v;
		}
	},

	/**
	 * 在GridPanel中用来根据一个二维的字典renderer某一个column的值
	 * <pre>
	 * <code>
	//例子，如果有一个字典对照表
	var dict=[["状态1",1],["状态2",2],["状态3",3]]
	{
	id: 'col1',
	header: 'Column1',
	dataIndex: 'col1',
	width: 220,
	renderer:Cabletech.Ext.Util.typesRender(dict)
	}
	 * </code>
	 * </pre>
	 * @param {Object[][]} types 对应的二维字典
	 */
	typesRender : function(types) {
		return function(v) {
			for (var i = 0; i < types.length; i++) {
				try {
					if (types[i][1] === v)
						return types[i][0];
				} catch (e) {
					alert(types)
				}
			}
			return "";
		}
	},

	/**
	 * 在EditorGridPanel中用来将某一个column renderer成只读样式
	 * <pre>
	 * <code>
	//例子，如果要将一个时间renderer成只读样式
	{
	id: 'col1',
	header: 'Column1',
	dataIndex: 'col1',
	width: 220,
	renderer:Cabletech.Ext.Util.readOnlyRender(Cabletech.Ext.Util.dateRender('Y-m-d'))
	}
	 * </code>
	 * </pre>
	 * @param {Object} innerRender 内嵌renderer
	 */
	readOnlyRender : function(innerRender) {
		return function(v, meta) {
			var d = v;
			if (innerRender)
				d = innerRender(d);
			meta.attr = 'style="background-color:'
					+ Cabletech.Ext.Util.readOnlyGridCellColor + ';"';
			return d;
		}
	},
	//private
	operaterTemplate : new Ext.Template("<a href='{2}' theid='{2}' op='{1}' onclick='return false'><font color='blue'>{0}</font></a>"),

	/**
	 * 在EditorGridPanel中用来将某一个column renderer成可操作列
	 * @param {String} cmd 点击该column响应后台的事件。该事件和CrudListPanel或者CurdPanel组合使用，相当于向后台发送了一个ajax请求：
	 * {url:curdPanel.baseUrl,params:{'cmd':cmd,id:r.get("id"}}
	 * 将当前列对应的id属性得到，并传到后台。
	 * 
	 * @param {String} title 该列中要显示的操作名称
	 * <pre>
	 * <code>
	//例子，如果有一个data：{id:1,name:'lanyo'},该数据在grid中显示后，要求在每一个用户信息行最后有一个“查看”column，能查看到该行用户的详细信息。
	{
	id: 'col1',
	header: 'Name',
	dataIndex: 'name',
	width: 220
	},{
	id: 'col1',
	header: 'Operate',
	dataIndex: 'id',
	width: 220,
	renderer:Cabletech.Ext.Util.operaterRender('show',"查看详细")
	}
	 */
	operaterRender : function(cmd, title) {
		return function(v, p, r) {
			if (r.get("id"))
				return Cabletech.Ext.Util.operaterTemplate.applyTemplate([
						title ? title : (v ? v : ""), cmd, r.get("id")]);
		}
	},
	/**
	 *  自动关闭当前的提示框。
	 *  常用情况：遇到某个状态，需要提示一下，然后可以在下一代码延迟执行该方法，就自动关闭提示。
	 *  <pre>
	 *  <code>
	 *  //if(somestatus binggo){
	 *  Ext.Msg.alert("提示信息","某种状态已经发生");
	 *  Cabletech.Ext.Util.autoCloseMsg.defer(2000);
	 *  }
	 *  </code>
	 *  </pre>
	 */
	autoCloseMsg : function() {
		Ext.Msg.hide();
	},

	/**
	 * 简单的使用ajax调用执行一个请求的方法，常用在CURD面板中某一些简单的操作请求。
	 * 比如，审核，批量审核，查看等按钮的的handler上。
	 * 
	 * <pre>
	 * <code>
	 * 	//示例：比如有个按钮，点击打印当前选中的项
	 *  {
	 *  	xtype:'button',
	 *  	text:'打印当前选中项',
	 *  	scope:this,
	 *  	handler:Cabletech.Ext.Util.executeUrl(this.baseUrl,{cmd:'printSelect',id:this.getCurrentSelectId()},this.print)
	 *  }
	 * </code>
	 * </pre>
	 * 
	 * @param {String} url 调用的远端url
	 * @param {Object} params POST请求传入的参数
	 * @param {Function} fn 
	 * 
	 * @return {Function} 构造好的请求方法
	 * 
	 */
	executeUrl : function(url, params, fn) {
		return function() {
			Ext.Ajax.request({
				waitMsg : "正在执行操作，请稍候...",
				url : url,
				method : 'POST',
				params : params,
				success : function(response) {
					var r = Ext.decode(response.responseText);
					if (!r.success)
						Ext.Msg.alert("提示", "操作失败，失败原因为：<br/>"
										+ (r.errors.msg ? r.errors.msg : "未知"));
					else {
						Ext.Msg
								.alert("提示", "操作成功", fn ? fn : Ext.emptyFn,
										this);
					}
				},
				scope : this
			});
		}
	},

	/**
	 * 使用Ajax方式提交表单的包装方法
	 * 
	 * <pre>
	 * <code>
	 * 
	Cabletech.Ext.Util.submitForm(this.fp.form,url,function(form,action){
	this.fp.form.clearDirty();
	if(this.store && this.closeSaveWin!==false){
	    this.store.reload();
	}
	if(callback)callback();
	this.fireEvent("saveobject",this,form,action);
	this.onSave(form,action);
	},this);
	 * </code>
	 * </pre>
	 * 
	 * @param {Ext.form.BasicForm} form 要提交的表单对象
	 * @param {String} url 表单要提交的url
	 * @param {Function} callback 表单提交成功后的回调方法
	 * @param {Object} scope callback和failure方法执行的作用域
	 * @param {Function} failure 表单提交失败后的回调方法
	 * 
	 */
	submitForm : function(form, url, callback, scope, failure) {
		form.submit({
					url : url,
					waitTitle : "请稍候",
					waitMsg : "正在保存，请稍候",
					success : function(form, action) {
						if (callback)
							callback.call(scope || this, form, action);
					},
					failure : function(form, action) {
						if (failure) {
							failure.call(scope || this, form, action);
						} else {
							var msg = "";
							if (action.failureType == Ext.form.Action.SERVER_INVALID) {
								if (form.notAlert)
									return "";// 这个在form中配置的一个开关，表示这个form在服务返回有错误信息的时候不弹出信息。
								for (var p in action.result.errors) {
									msg += action.result.errors[p] + "  ";
								}
							} else {
								msg = "数据录入不合法或不完整！";
							}
							Ext.MessageBox.alert("保存失败！", msg);
						}
					},
					scope : scope || this
				});
	},

	/**
	 * 得到EditorGridPanel中的数据，并拼成一个对象。常用于主从表单中从表单数据的获得和提交。
	 * 
	 * <pre>
	 * <code>
	 * //示例：现有表格数据为:
	 * //[
	 * //{id:1,name:'c1',key:'k1',status:'1'},
	 * //{id:2,name:'c2',key:'k2',status:'0'},
	 * //{id:3,name:'c3',key:'k3',status:'1'},
	 * //{id:4,name:'c4',key:'',status:'1'},
	 * //]
	 * //使用方法：
	 * var o=Cabletech.Ext.Util.getEditGridData(this.editGrid,'item_','key',function(r){
	 * 		return r.get("status")==='1';
	 * })
	 * console.debug(o);
	 * //返回值：
	 * //o:{item_id:[1,3],item_name:['c1','c3'],item_key:['k1','k3'],item_status:['1','1']}
	 * </code>
	 * </pre>
	 * 
	 * @param {Ext.grid.EditorGridPanel} editGrid 要得到数据的可编辑表格
	 * @param {String} prefix 得到的数据前缀
	 * @param {String} key 确定每一行数据能获得数据的必要字段名称
	 * @param {Function} filter  确定每一行数据能获得数据的过滤方法
	 * 		<ul>
	 * 		<li>传入的值: {Ext.data.Record} r 传入的每一行数据的Record。</li>
	 * 		<li>返回的值: {Boolean} ret 如果为true，则加入表格获得的数据项中，如果为false，则过滤掉。</li>
	 * 		</ul>
	 * 
	 * @return {Object} obj 获得到的表单数据
	 */
	getEditGridData : function(editGrid, prefix, key, filter) {
		function getV(v) {
			if (v && v.value !== undefined)
				v = v.value;// 根据value属性来得到
			else if (v && v.id !== undefined)
				v = v.id;// 根据id属性来得到
			if (v && typeof v == "object" && v.clearTime)
				v = v.format("Y-m-d");
			return v;
		}
		var o = {};
		var mc = editGrid.getColumnModel().getColumnCount();
		for (var i = 0; i < mc; i++) {
			var n = editGrid.getColumnModel().getDataIndex(i);
			if (n)
				o[(prefix ? prefix : "") + n] = [];
		}
		var store = editGrid.store;
		var j = 0;
		var numbererField = editGrid.getColumnModel().getColumnById("numberer")
				? editGrid.getColumnModel().getColumnById("numberer").dataIndex
				: "";
		for (var i = 0; i < store.getCount(); i++) {
			if (key) {// 如果指定了必填项，则要作必填项判断
				var v = store.getAt(i).get(key);
				v = getV(v);
				if (!v)
					continue;// 如果必填项没有值，则退出
				if (filter && !filter(store.getAt(i)))
					continue;
				if (typeof v == "object" && !String(v))
					continue;// 对Object类型进行处理
			}
			for (var n in o) {
				var f = prefix ? n.replace(prefix, "") : n;
				if (f == numbererField)
					o[n][j] = j;// 处理自动排序字段
				else {
					var v = store.getAt(i).get(f);
					v = getV(v);
					o[n][j] = (v !== null ? v : "");
				}
			}
			j++;
		}
		return j > 0 ? o : {};
	},
	/**
	 * 把表格数据中的某一列数据拼成字符串连接
	 * <pre>
	 * <code>
	 * //示例：现有表格数据为:
	 * //[
	 * //{id:1,name:'c1',key:'k1',status:'1'},
	 * //{id:2,name:'c2',key:'k2',status:'0'},
	 * //{id:3,name:'c3',key:'k3',status:'1'},
	 * //{id:4,name:'c4',key:'',status:'1'},
	 * //]
	 * //使用方法：
	 * var str=Cabletech.Ext.Util.getGridDataAsString(this.gridPanel,'key');
	 * //str='k1,k2,k3,'
	 * var str=Cabletech.Ext.Util.getGridDataAsString(this.gridPanel,'id');
	 * //str='1,2,3,4'
	 * </code>
	 * </pre>
	 * @param {Ext.grid.GridPanel} grid 需要得到数据的GridPanel或者EditorGridPanel
	 * @param {String} key 需要得到的列名称
	 * 
	 * @return {String} ret 得到的字符串连接
	 */
	getGridDataAsString : function(grid, key) {
		var s = [], key = key || "id";
		grid.store.each(function(r) {
					s.push(r.get(key))
				});
		return s.join(',');
	},
	/**
	 * 往GridPanel或者EditorGridPanel中添加一行或者多行数据。
	 * <pre>
	 * <code>
	 * //示例：在EditorGrid加载完成后自动往里面加载一条空数据
	 * var emptyObj={id:"",name:"",key:"",status:""},
	 * this.editGrid.on("render",function(c){
	 * 		Cabletech.Ext.Util.appendGridRows(c,this.editStoreMapping,emptyObj,Ext.emptyFn,false);
	 * },this);
	 * </code>
	 * </pre>
	 * 
	 * @param {Ext.grid.GridPanel} grid 需要添加数据的grid
	 * @param {Array} storeMapping 需要添加数据的grid对应的storemapping
	 * @param {Object/Array} rs 需要添加的数据对象或者数据对象数组
	 * @param {Function} dataHandler 在添加完成数据后，需要对这些数据做的一些处理
	 * 		<ul>
	 * 			<li>传入参数 {Object} obj 需要添加的数据</li>
	 *  	</ul>
	 * @param {Boolean} keepLastEmptyRow 
	 * <p>
	 * 是否保持最后一行不变。如果true，那么数据都插入在倒数第二行，如果为false，则插入在最后。为true的情况下使用editorGrid的时候特别有用。
	 * 因为在editorGrid下，经常需要保持最后一行是一个空行，能随时添加数据。
	 * </p>
	 */
	appendGridRows : function(grid, storeMapping, rs, dataHandler,
			keepLastEmptyRow) {
		if (rs.length == undefined)
			rs = [rs];
		var selectRow = grid.getSelectionModel().getSelectedCell ? grid
				.getSelectionModel().getSelectedCell() : null;
		var lastSecondRow = grid.store.getCount() - (keepLastEmptyRow ? 2 : 1);
		var appendTo = lastSecondRow;
		if (selectRow)
			appendTo = selectRow[0];
		if (appendTo < -1)
			appendTo = -1;
		if (appendTo == lastSecondRow + 1)
			appendTo = lastSecondRow;
		for (var i = 0; i < rs.length; i++) {
			var r = rs[i];
			var obj = dataHandler(r)
			Cabletech.Ext.Util
					.addGridRow(grid, storeMapping, obj, appendTo + i);
		}
	},
	/**
	 * 往EditorGridPanel中指定行添加一行数据。
	 * <pre>
	 * <code>
	 * //示例：在当前选中行下一行加载一条空数据
	 * var emptyObj={id:"",name:"",key:"",status:""},
	 * var appendTo=this.grid.store.indexOf(this.grid.getSelectionModel().getSelected())+=1;
	 * Cabletech.Ext.Util.addEditorGridRow(this.grid,this.storeMapping,emptyObj,appendTo);
	 * </code>
	 * </pre>
	 * 
	 * @param {Ext.grid.GridPanel} grid 需要添加数据的grid
	 * @param {Array} storeMapping 需要添加数据的grid对应的storemapping
	 * @param {Object} obj 需要添加的数据对象或者数据对象数组
	 * @param {Integer} appendTo 在哪一行插入，如果没有指定，就放在当前选中行的下一行，如果没有选中任何cell，则放在最后一行，如果指定了，不在当前grid的范围里，则加入到第一行或者最后一行
	 */
	addEditorGridRow : function(grid, storeMapping, obj, appendTo) {
		var row = appendTo;
		if (row == undefined) {
			var selModel = grid.getSelectionModel();
			var record = selModel.getSelectedCell
					? selModel.getSelectedCell()
					: null;
			row = grid.store.getCount() - 1;
			if (record) {
				row = record[0];
			}
		}
		var create = Ext.data.Record.create(storeMapping);
		var obj = new create(Ext.apply({}, obj || {}));
		if (grid.stopEditing)
			grid.stopEditing();
		grid.store.insert(row + 1, obj);
		grid.getView().refresh();
	},

	/**
	 * 从EditorGridPanel中删除当前选中的cell所在的行
	 * //示例：删除当前选中cell所在的行，并向后台发送删除请求
	Cabletech.Ext.Util.removeEditorGridRow(this.editGrid,function(r){
	Cabletech.Ext.Util.ajaxRequest(this.baseUrl,{cmd:'removeItem',id:r.get('id')},this,function(response){
		var ret=Ext.decode(response.responseText);
		if(ret)
			Ext.Msg.alert("提示信息","删除"+r.get('name')+"成功！");
		else
			Cabletech.Ext.Util.addEditorGridRow(this,grid,this.storeMapping,r.data);
	});
	});
	 * 
	 * @param {Ext.grid.EditorGridPanel} grid 要删除数据的EditorGridPanel
	 * @param {Function} callback 数据（前台）删除成功后的回调方法。
	 * 		<ul>
	 * 		<li>传入的值 {Ext.data.Record} r 当前选中的行record
	 * 		</ul>
	 * 
	 */
	removeEditorGridRow : function(grid, callback) {
		var record = grid.getSelectionModel().getSelectedCell();
		if (record) {
			var store = grid.store;
			Ext.MessageBox.confirm("请确认", "确定要删除吗？", function(ret) {
						if (ret == "yes") {
							var r = store.getAt(record[0]);
							if (callback)
								callback(r);
							store.remove(r);
							grid.getView().refresh();
							if (store.getCount() > 0)
								grid.getSelectionModel().select(
										record[0] - 1 < 0 ? 0 : record[0] - 1,
										record[1]);
						}
					});
		} else
			Ext.MessageBox.alert("提示", "请选择要删除的记录!");
	},

	/**
	 * 重新加载grid的数据，相当于store.removeAll->store.reload
	 * 
	 * @param {Ext.grid.GridPanel} grid 要重新加载数据的GridPanel
	 * 		
	 */
	reloadGrid : function(grid) {
		grid.getStore().removeAll();
		grid.getStore().reload();
	},

	/**
	 * 从EditorGridPanel或GridPanel中删除所有选中数据
	 * //示例：删除当前选中的所有数据，并向后台发送删除请求
	Cabletech.Ext.Util.removeGridRows(this.grid,function(rs){
	Cabletech.Ext.Util.ajaxRequest(this.baseUrl,{cmd:'removeItems',ids:Ext.pluckRecord(rs,'id').join(',')},this,function(response){
		var ret=Ext.decode(response.responseText);
		if(ret)
			Ext.Msg.alert("提示信息","删除成功！");
	});
	});
	 * 
	 * @param {Ext.grid.EditorGridPanel} grid 要删除数据的EditorGridPanel
	 * @param {Function} callback 数据（前台）删除成功后的回调方法。
	 *      <ul>
	 * 		<li>传入的值 {Array[Ext.data.Record]} rs 当前选中的record数组
	 * 		</ul>
	 */
	removeGridRows : function(grid, callback) {
		if (!grid.getSelectionModel().getSelections
				&& grid.getSelectionModel().getSelectedCell) {//
			Cabletech.Ext.Util.removeEditorGridRow(grid, callback);
		} else {
			var rs = grid.getSelectionModel().getSelections();
			if (rs && rs.length > 0) {
				var store = grid.store;
				Ext.MessageBox.confirm("请确认", "确定要删除吗？", function(ret) {
							if (ret == "yes") {
								if (callback)
									callback(rs);
								for (var i = 0; i < rs.length; i++)
									store.remove(rs[i]);
								grid.getView().refresh();
							}
						});
			}
		}
	},

	/**
	 * 动态的将GridPanel或者EditorGridPanel的指定列隐藏或者显示
	 * 
	 * <pre>
	 * <code>
	 * //示例:
	{xtype:'button',text:'显示简单列',scope:this,handler:function(){
	var cm=this.grid.getColumnModel();
	Cabletech.Ext.Util.setGridColumnHidden(['name','sn','status'],false,this.gridPanel);
	Cabletech.Ext.Util.setGridColumnHidden(['intro','borndate','othersProperty'],true,this.gridPanel);
	}}
	 * </code>
	 * </pre>
	 * 
	 * @param {Array|String} fields 要隐藏或者显示的column对应的dataIndex 名称或者数组
	 * @param {Boolean} hidden 是显示还是隐藏。true为隐藏，false为显示
	 * @param {Ext.grid.GridPanel} grid 操作的grid对象
	 */
	setGridColumnHidden : function(fields, hidden, grid) {
		if (grid != null && fields != null && fields.length) {
			for (var i = 0; i < fields.length; i++) {
				var index = grid.getColumnModel().findColumnIndex(fields[i]);
				if (index >= 0) {
					grid.getColumnModel().config[index].hideable = !hidden;
					grid.getColumnModel().setHidden(index, hidden);
				}
			}
		}
	},

	/**
	 * 高级的布局工具。<br/>
	 * 可以用该工具方法方便的实现平均分布的表单布局。<br/>
	 * 
	 * <pre>
	 * <code>
	//示例1：在一行里面平均分布4个textfield
	{
	xtype:"form",
	frame:true,
	items:[{
		xtype:"fieldset",
		autoHeight:true,
		title:'demo',
		items:
			Cabletech.Ext.Util.buildColumnForm(
				true,"textfield",
				{name:'textfield1',fieldLabel:'textfield1'},
				{name:'textfield2',fieldLabel:'textfield2'},
				{name:'textfield3',fieldLabel:'textfield3'},
				{name:'textfield4',fieldLabel:'textfield4'}
			)
	}]
	}
	//示例2:在formPanel中的一个fieldSet中横向平均布局六个textfield，保证每一行平均布局三个textfield，并设置textfield的labelWidth为120。
	{
	xtype:"form",
	frame:true,
	items:[{
		xtype:"fieldset",
		autoHeight:true,
		title:'demo',
		fieldWidth:120,
		items:
			Cabletech.Ext.Util.buildColumnForm(
				3,"textfield",
				{name:'textfield1',fieldLabel:'textfield1'},
				{name:'textfield2',fieldLabel:'textfield2'},
				{name:'textfield3',fieldLabel:'textfield3'},
				{name:'textfield4',fieldLabel:'textfield4'},
				{name:'textfield5',fieldLabel:'textfield5'},
				{name:'textfield6',fieldLabel:'textfield6'}
			)
	}]
	}
	//示例3:在一行里面平均分布4个textfield，默认labelWidth为120,并设置第3个textfield的labelWidth为200。
	{
	xtype:"form",
	frame:true,
	items:[{
		xtype:"fieldset",
		autoHeight:true,
		title:'demo',
		labelWidth:120,
		items:
			Cabletech.Ext.Util.buildColumnForm(
				true,"textfield",
				{name:'textfield1',fieldLabel:'textfield1'},
				{name:'textfield2',fieldLabel:'textfield2'},
				{name:'textfield3',fieldLabel:'textfield3',panelCfg:{labelWidth:200}},
				{name:'textfield4',fieldLabel:'textfield4'}
			)
	}]
	}
	 * </code>
	 * </pre>
	 * 
	 * @param {Boolean|Integer} auto 
	 * 			如果该参数为Boolean，则true表示自动平均将组件布局到一行。<br/>
	 * 			如果该参数为Integer，如果1<auto<50，表示一行平均分布的组件个数。如果auto超过50，表示将所有组件布局到一列，并且固定每个组件的width为auto。
	 * @param {Array} arg
	 * 			需要进行布局的组件。<br/>
	 * 			如果该参数的第一个值是一个String，则表示布局组件的默认xtype。<br/>
	 * 			所有的布局组件可以设置一个panelCfg对象，该对象里面可以设置容器控制样式，比如labelWidth等。
	 */
	buildColumnForm : function(auto, arg/*,arg..*/) {
		var cw, defaultType = 'textfield', args = Array.prototype.slice.call(
				arguments, 0);
		if (Ext.isBoolean(auto) || Ext.isNumber(auto)) {
			args.shift();
			if (Ext.isBoolean(auto) && auto) {
				var arr = args[0] || args[1];
				if (!Ext.isArray(arr)) {
					arr = args;
				}
				cw = (1 / arr.length).toFixed(5);
			} else if (Ext.isNumber(auto)) {
				if (auto > 1) {
					if (auto < 50) {
						cw = (1 / auto).toFixed(5);
					} else {
						cw = auto;
					}
				} else {
					cw = auto;
				}
			} else {
				cw = .5;
			}
		} else {
			cw = .5;
		}
		if (Ext.isString(args[0])) {
			defaultType = args.shift();
		}
		if (Ext.isArray(args[0])) {
			args = args.shift();
		}

		var config = {
			items : [],
			anchor : "100%",
			layout : 'column',
			xtype : 'container'
		};
		Ext.each(args, function(field) {
					var item = {
						items : field,
						anchor : "100%",
						layout : 'form',
						border : false,
						xtype : 'container',
						defaultType : defaultType,
						defaults : {
							anchor : '-20'
						}
					};
					if (cw < 50) {
						item.columnWidth = cw;
					} else {
						item.width = cw;
					}
					if (field.panelCfg) {
						Ext.apply(item, field.panelCfg);
						delete field.panelCfg;
					}
					config.items.push(item);
				});
		return config;
	},
	oneColumnPanelBuild : function() {
		var agrugments = arguments;
		Cabletech.Ext.Util.buildColumnForm.apply(true, agrugments);
	},
	/**
	 * 将一组组件横向布局在一行中,
	 * 
	 * <pre>
	 * <code>
	//示例:
	//在formPanel中的fieldSet中的一行中横向布局三个textfield，让他们的布局比例为1:1:2，并设置textfield的labelWidth为120。
	{
	xtype:"form",
	frame:true,
	items:[{
	xtype:"fieldset",
	autoHeight:true,
	title:'demo',
	items:
		Cabletech.Ext.Util.columnPanelBuild(
			{FC:{labelWidth:120}},
			{columnWidth:.25,items:{xtype:'textfield',name:'textfield1',fieldLabel:'textfield1'}},
			{columnWidth:.25,items:{xtype:'textfield',name:'textfield2',fieldLabel:'textfield2'}},
			{columnWidth:.5,items:{xtype:'textfield',name:'textfield3',fieldLabel:'textfield3'}},
		),
	}]
	}
	 * </code>
	 * </pre>
	 * 
	 * @param {Array} arguments 
	 * 		要在一行中排列的组件数组。组件必须放在一个{columnWidth:yourdefinedcolumnwidth,items:yourdefinedcomponent}的Panel构造对象中。
	 *		该对象的columnWidth规定了该组件在该行中所占用的总体比例。
	 *		如果需要统一设定所有排列组件的容器属性（比如textfield的labelWidth，或者anchor属性等），需要在一个参数中传入一个
	 *		{FC:{your component prop setting}}的对象。参考上面的例子。
	 */
	columnPanelBuild : function() {
		var args = Array.prototype.slice.call(arguments, 0);
		var formConfig = {};
		if (args[0]) {
			if (args[0].FC || args[0].formConfig) {
				Ext.apply(formConfig, (args[0].FC || args[0].formConfig));
				args.shift();
			}
		}
		var obj = {
			layout : 'column',
			anchor : "100%",
			defaults : {
				border : false
			},
			items : [],
			xtype : "panel",
			border : false,
			bodyBorder : false
		};
		var defaultColumn = (1 / args.length).toFixed(2);
		for (var i = 0; i < args.length; i++) {
			var o = args[i];
			var c = {
				columnWidth : o.columnWidth || defaultColumn,
				layout : 'form',
				defaultType : o.defaultType || "textfield",
				defaults : o.defaults || {
					anchor : "-20"
				},
				items : o.items
			};
			obj.items[i] = Ext.apply(c, formConfig);
		}
		return obj;
	},
	/**
	 * Cabletech.Ext.Util.twoColumnPanelBuild方法的简写
	 */
	columnBuild : function() {
		Cabletech.Ext.Util.twoColumnPanelBuild.apply(this, arguments);
	},
	/**
	 * 将一组组件横向平均布局在一行中,
	 * 
	 * <pre>
	 * <code>
	 * //示例:
	 * //在formPanel中的一个fieldSet中横向平均布局六个textfield，保证每一行平均布局三个textfield，并设置textfield的labelWidth为120。
	{
	xtype:"form",
	frame:true,
	items:[{
		xtype:"fieldset",
		autoHeight:true,
		title:'demo',
		items:
			Cabletech.Ext.Util.columnPanelBuilde(3,
				{FC:{labelWidth:120}},
				{xtype:'textfield',name:'textfield1',fieldLabel:'textfield1'},
				{xtype:'textfield',name:'textfield2',fieldLabel:'textfield2'},
				{xtype:'textfield',name:'textfield3',fieldLabel:'textfield3'},
				{xtype:'textfield',name:'textfield4',fieldLabel:'textfield4'},
				{xtype:'textfield',name:'textfield5',fieldLabel:'textfield5'},
				{xtype:'textfield',name:'textfield6',fieldLabel:'textfield6'},
			),
	}]
	}
	 * </code>
	 * </pre>
	 * 
	 * @param {Object[]} 要在一行中排列的组件数组。
	 * <p>
	 *		需要排列的组件只需要按照顺序加入就行，该方法能按照指定的格式平均排列，超过一行的，多余的组件能继续正确排列在下一行。
	 *		如果需要指定一行中平均排列多少个组件，需要在一个参数中指定一行排列的数量。
	 *		如果需要统一设定所有排列组件的容器属性（比如textfield的labelWidth，或者anchor属性等），需要在第二个参数中传入一个
	 *		{FC:{your component prop setting}}的对象。参考上面的例子。
	 * </p>
	 */
	twoColumnPanelBuild : function() {
		var args = Array.prototype.slice.call(arguments, 0);
		var formConfig = {};
		var obj = {
			layout : 'column',
			anchor : "100%",
			defaults : {
				border : false
			},
			items : [],
			xtype : "panel",
			border : false,
			bodyBorder : false
		};
		var max = 2;
		if (typeof args[0] == "number") {
			max = args[0];
			args.shift();
		}
		if (args[0]) {
			if (args[0].FC || args[0].formConfig) {
				Ext.apply(formConfig, (args[0].FC || args[0].formConfig));
				args.shift();
			}
		}
		var cs = [];
		for (var i = 0; i < max; i++)
			cs[i] = Ext.apply({
						columnWidth : 1 / max,
						layout : 'form',
						defaultType : "textfield",
						defaults : {
							anchor : "-20"
						},
						items : []
					}, formConfig);
		for (var i = 0; i < args.length;) {
			for (var j = 0; j < max; j++, i++) {
				cs[j].items[cs[j].items.length] = (i < args.length
						? args[i]
						: {
							xtype : "panel",
							border : false
						});
			}
		}
		obj.items = cs;
		return obj;
	},

	TRANS_ID : 0,
	/**
	 * 动态的给HTML加载script。
	 * 相当于动态的在onReady所在的主页面中加入&lt;script&gt;标签
	 * 
	 * <pre>
	 * <code>
	//例子:
	Ext.onReady(function() {
	Cabletech.Ext.Util.load("/abc/abc.js");
	});
	//相当于在页面中加入了&lt;script type="text/javascript" src='/abc/abc.js'&gt;&lt;/script&gt;
	 * </code>
	 * </pre>
	 * 
	 * @param {String} appName 要加载的js的名称（路径）
	 */
	load : function(appName) {
		var transId = ++Cabletech.Ext.Util.TRANS_ID;
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.setAttribute("src", appName);
		script.setAttribute("type", "text/javascript");
		script.setAttribute("id", "lanyoScript_" + Cabletech.Ext.Util.TRANS_ID);
		head.appendChild(script);
	},
	/**
	 * 从指定的url加载数组或PageResult类型的JSON对象，并自动存放到本地缓存中
	 * 
	 * @param {String}
	 *            varName 缓存明称
	 * @param {String}
	 *            url JSON数据url
	 * @param {Function}
	 *            callback 可选参数，回调函数
	 * @param {Boolean}
	 *            shareCache 可选参数，是否共享缓存
	 * @param {Object}
	 *            collectionType 可选参数，缓存类型，默认为MixedCollection
	 */
	loadJSON2Collection : function(varName, url, callback, shareCache,
			collectionType) {
		Ext.Ajax.request({
			url : url,
			success : function(req) {
				try {
					var ret = Ext.decode(req.responseText);
					var collection = shareCache
							|| eval("new "
									+ (collectionType || "Ext.util.MixedCollection")
									+ "()");
					if (Ext.type(ret) == 'array') {
						collection.addAll(ret);
						Cabletech.Ext.CachedRemoteObject.DATAS[varName] = collection;
					} else if (Ext.type(ret) == 'object'
							&& Ext.type(ret.result) == 'array') {
						collection.addAll(ret.result);
						Cabletech.Ext.CachedRemoteObject.DATAS[varName] = collection;
					}
				} catch (e) {
				}
				if (callback)
					callback();
			},
			scope : this
		});
	},

	/**
	 * 从script文件中加载Json对象。一般用于在演示数据或者静态js文件中加载数据。
	 * <pre>
	 * <code>
	//例子：如果有json文件内容如下：
	var myData=[{id:1,name:'lanyo',status:1}];
	var myData2=[{id:2,name:'lanyo2',status:0}];
	//该文件保存再/webapps/jsdata/my.js
	//执行：
	Ext.onReady(function() {
	Cabletech.Ext.Util.loadJSONObject('','/jsdata/my.js',function(){console.debug(myData)});
	});
	//结果：
	//myData=[{id:1,name:'lanyo',status:1}]
	 * </code>
	 * </pre>
	 * 
	 * @param {String} varName 如果指定了varName，相当于执行了var varname=js的内容。在这种情况下，请求的js文件就只能直接返回一个对象。
	 * @param {String} script 指定加载js的路径
	 * @param {Function} callback 在加载完数据后的回调方法。
	 * 
	 */
	loadJSONObject : function(varName, script, callback) {
		Ext.Ajax.request({
					url : script,
					success : function(req) {
						var ret = Ext.decode(req.responseText);
						if (varName)
							eval("(" + varName + "=ret)");
						if (callback)
							callback();
					},
					scope : this
				});
	},

	/**
	 * 动态加载并执行js，并可以给该js文件的内容指定一个全局缓存名称（该名称必须等于js中指定的类名称），防止重复加载。用来延迟加载每一个应用模块独立的js文件。
	 * （详细的例子可以查看RIA平台自身的在OPOA模式下加载模块的方法）
	 * 
	 * @param {String} className 
	 * 						加载并执行的js中的类的名称，作为缓存名称
	 * @param {String} script
	 * 						加载的js的路径
	 * @param {Function} callback
	 * 						在加载并执行了js后，执行的回调方法
	 * <ul>传入参数：
	 * 		<li>{Object} obj js文件中的对象</li>
	 * </ul>
	 * @param  {Object} scope
	 * 						回调方法执行的scope
	 * @param {Boolean} async
	 * 						在加载js的时候，是否采用同步加载。true使用同步加载，false使用异步加载。
	 */
	loadScript : function(className, script, callback, scope, async) {
		if (!window[className]) {
			Ext.Ajax.request({
						url : script,
						success : function(req) {
							window.eval(req.responseText);
							if (callback) {
								callback.call(scope || window,
										window[className]);
							}
						},
						scope : this,
						async : async
					});
		} else if (callback)
			callback.call(scope || window, window[className]);
	},
	/**
	 * 从配置的路径里面加载对应类
	 * <pre>
	 * <code>
	//示例。
	//假设自定义的用户管理模块类MyUserManagePanel定义在/webapps/scripts/MyUserManagePanel.js下（注意类名和js文件名的对应关系）
	//调用方法：
	Cabletech.Ext.Util.loadClass({
	script:'/scripts/MyUserManagePanel.js',
	className:'MyUserManagePanel',
	scope:this,
	callback:function(obj){
		console.debug(obj);	
	}
	},async);
	 * </code>
	 * </pre>
	 * 
	 * @param {Object} cfg 可选配置对象。该对象详细配置如下：
	 * 	<ul>
	 * 		<li>{String} script 加载类的js文件路径。</li>
	 * 		<li>{String} className 加载并执行的js中的类的名称，如果没有指定className，则直接使用js文件名称做为类的缓存名称</li>
	 * 		<li>{Function} callback 在加载并执行了js后，执行的回调方法
	 * 			<ul>传入参数：
	 * 				<li>{Object} obj js文件中的对象</li>
	 * 			</ul>
	 * 		</li>
	 * 		<li>{Object} scope 回调方法执行的scope</li>
	 * 		<li>{Boolean} async 在加载js的时候，是否采用同步加载。true使用同步加载，false使用异步加载。</li>
	 * 	</ul>
	 * @param {Boolean} async 在加载js的时候，是否采用同步加载。true使用同步加载，false使用异步加载。
	 * 
	 */
	loadClass : function(cfg, async) {
		cfg = cfg || {};
		if (!Ext.isBoolean(cfg) && Ext.isBoolean(async)) {
			cfg.async = async;
		}
		if (cfg.script) {
			if (Ext.isEmpty(cfg.className)) {
				var scriptUrl = cfg.script;
				var ji = scriptUrl.indexOf('.js');
				if (ji >= 0) {
					var scriptClassSub = scriptUrl.substring(0, ji);
					var lastIndex = scriptClassSub.lastIndexOf('/');
					if (lastIndex >= 0) {
						cfg.className = scriptUrl.substring(lastIndex + 1, ji);
					}
				}
			}
			Cab.Util.loadScript(cfg.className, cfg.script, cfg.callback,
					cfg.scope, cfg.async);
		}
	},

	/**
	 * 最简单的加载并执行script
	 * 
	 * @param {String} script 要加载并执行的script路径
	 * @param {Boolean} async 在加载js的时候，是否采用同步加载。true使用同步加载，false使用异步加载。
	 */
	asLoadScript : function(script, async) {
		Ext.Ajax.request({
					url : script,
					async : async,
					success : function(req) {
						eval(req.responseText);
					},
					scope : this
				});
	},

	/**
	 * 在页面打开的时候动态加载脚本程序
	 * 相当于直接在页面插入&lt;script src='script'&gt;&lt;/script&gt;标签段
	 * 
	 * @param {String} script 脚本名称
	 */
	loadJS : function(script) {
		document.write("<script src='" + script + "'></script>");
	},

	/**
	 * 
	 * 在任何代码段中，调用一个CrudPanel或者CrudListPanel对应模块的添加页面。<br/>
	 * 在smartCombo下面的添加按钮，或者任何需要在一个模块中及时添加另一个模块的对象时使用的方法。<br/>
	 * 
	 * <pre>
	 * <code>
	//示例，在添加员工的面板中选择部门的时候，可以点击部门后面的【添加】按钮，及时添加部门。
	Lanyo_Ajax.script="/";
	Cabletech.Ext.Util.columnPanelBuild(
	{columnWidth:.5,items:Cabletech.Ext.Util.buildRemoteCombox(
		"department",
		"部门",
		"department.Cab?cmd=loadDeptTree",
		["id","title"],
		"title",
		"id",
		false)},
	{columnWidth:.5,items:{xtype:"panel",items:{xtype:"button",text:"添加部门",scope:this,handler:this.addDepartment}}}
	);
	this.addDepartment=function(){
	Cabletech.Ext.Util.addObject(
		"DepartmentManagePanel",
		function(){
			this.fp.findSomeThing("department").reload();
		},
		"script/DepartmentManagePanel.js"
	);
	}
	 * </code>
	 * </pre>
	 * 
	 * @param {String} crudClass 需要调用添加方法的CrudPanel对应的ClassName
	 * @param {Function} callback 在添加指定对象成功后调用的回调方法
	 * @param {String} script 需要调用添加方法的CrudPanel对应的js文件路径,该文件路径的全路径是Lanyo_Ajax.script+script
	 * @param {String} otherScript 需要调用添加方法的CrudPanel对应的js文件需要关联引入的其他js。这些js文件也可以延迟加载。如果有多个js文件需要引入，在js文件路径之间用','隔开
	 * @param {Function} winReadyAction 在添加窗口加载完成后，需要做的一些额外的功能 
	 * 		<ul>
	 * 			传入的参数:
	 * 			<li>{Window} win 打开的添加窗口</li>
	 * 			<li>{CrudPanel} service 需要调用添加方法的CrudPanel的实例</li>
	 * 		</ul>
	 * 
	 */
	addObject : function(crudClass, callback, script, otherScripts,
			winReadyAction) {
		if (this.NormalClass[crudClass]) {
			var clz = this.NormalClass[crudClass];
			var o = new clz();
			o.createObject(callback, winReadyAction);
		} else {// 从脚本中加载
			var loadSuccess = function(req) {
				eval(req.responseText);
				eval("this.NormalClass." + crudClass + "=" + crudClass);
				var clz = this.NormalClass[crudClass];
				var o = new clz();
				o.createObject(callback, winReadyAction);
			};
			if (otherScripts) {
				var s = otherScripts.split(";");
				var total = s.length, ld = 0;
				for (var i = 0; i < s.length; i++) {
					Ext.Ajax.request({
								url : s[i],
								success : function(req) {
									eval(req.responseText);
									ld++;
									if (ld >= total) {
										Ext.Ajax.request({
													url : Lanyo_Ajax.script
															+ script,
													success : loadSuccess,
													scope : this
												});
									}
								},
								scope : this
							});
				}
			} else {
				Ext.Ajax.request({
							url : Lanyo_Ajax.script + script,
							success : loadSuccess,
							scope : this
						});
			}
		}
	},
	listObject : function(crudClass, callback, script, otherScripts) {
		if (this.NormalClass[crudClass]) {
			var clz = this.NormalClass[crudClass];
			var o = new clz();
			if (o.list && (typeof o.list == "function"))
				o = o.list();
			if (callback)
				callback(o);
		} else {// 从脚本中加载
			if (otherScripts) {
				var s = otherScripts.split(";");
				for (var i = 0; i < s.length; i++) {
					Ext.Ajax.request({
								url : s[i],
								success : function(req) {
									eval(req.responseText);
								}
							});
				}
			}
			Ext.Ajax.request({
						url : "extApp.Cab?cmd=loadScript&script=" + script,
						success : function(req) {
							eval(req.responseText);
							eval("this.NormalClass." + crudClass + "="
									+ crudClass);
							var clz = this.NormalClass[crudClass];
							var o = new clz();
							if (o.list && (typeof o.list == "function"))
								o = o.list();
							if (callback)
								callback(o);
						},
						scope : this
					});
		}
	},
	/**
	 * 在任何代码段中，调用一个CrudPanel或者CrudListPanel对应模块的修改页面来修改一个对象。
	 * 
	 * <pre>
	 * <code>
	//示例，在添加员工的面板中选择部门的时候，可以点击部门后面的【修改】按钮，及时修改选中的部门。
	Lanyo_Ajax.script="/";
	Cabletech.Ext.Util.columnPanelBuild(
	{columnWidth:.5,items:Cabletech.Ext.Util.buildRemoteCombox(
		"department",
		"部门",
		"department.Cab?cmd=loadDeptTree",
		["id","title"],
		"title",
		"id",
		false)},
	{columnWidth:.5,items:{xtype:"panel",items:{xtype:"button",text:"修改部门",scope:this,handler:this.updateDepartment}}}
	);
	this.updateDepartment=function(){
	var deptId=this.fp.findSomeThing("department").getValue();
	if(!deptId)
		Ext.Msg.alert('提示信息','请先选择修改的部门');
		return;
	Cabletech.Ext.Util.updateObject(
		"DepartmentManagePanel",
		function(){
			this.fp.findSomeThing("department").reload();
		},
		"script/DepartmentManagePanel.js",
		"",
		deptId
	);
	}
	 * </code>
	 * </pre>
	 * 
	 * @param {String} crudClass 需要调用修改方法的CrudPanel对应的ClassName
	 * @param {Function} callback 在修改指定对象成功后调用的回调方法
	 * @param {String} script 需要调用修改方法的CrudPanel对应的js文件路径,该文件路径的全路径是Lanyo_Ajax.script+script
	 * @param {String} otherScript 需要调用修改方法的CrudPanel对应的js文件需要关联引入的其他js。这些js文件也可以延迟加载。如果有多个js文件需要引入，在js文件路径之间用','隔开
	 * @param {Object} id 需要传入编辑的对象的id
	 * @param {Function} winReadyAction 在修改窗口加载完成后，需要做的一些额外的功能 
	 * 		<ul>
	 * 			传入的参数:
	 * 			<li>{Window} win 打开的修改窗口</li>
	 * 			<li>{CrudPanel} service 需要调用修改方法的CrudPanel的实例</li>
	 * 		</ul>
	 * 
	 */
	editObject : function(crudClass, callback, script, otherScripts, id,
			winReadyAction) {
		if (this.NormalClass[crudClass]) {
			var clz = this.NormalClass[crudClass];
			var o = new clz();
			o.editObject(id, callback, winReadyAction);
		} else {// 从脚本中加载
			if (otherScripts) {
				var s = otherScripts.split(";");
				for (var i = 0; i < s.length; i++) {
					Ext.Ajax.request({
								url : s[i],
								success : function(req) {
									eval(req.responseText);
								}
							});
				}
			}
			Ext.Ajax.request({
						url : Lanyo_Ajax.script + script,
						success : function(req) {
							eval(req.responseText);
							eval("this.NormalClass." + crudClass + "="
									+ crudClass);
							var clz = this.NormalClass[crudClass];
							var o = new clz();
							o.editObject(id, callback, winReadyAction);
						},
						scope : this
					});
		}
	},

	/**
	 * 在任何代码段中，调用一个CrudPanel或者CrudListPanel对应模块的查看页面来查看一个对象的详情。
	 * 
	 * <pre>
	 * <code>
	//示例，在添加员工的面板中选择部门的时候，可以点击部门后面的【查看】按钮，及时查看选中的部门的详细信息。
	Lanyo_Ajax.script="/";
	Cabletech.Ext.Util.columnPanelBuild(
	{columnWidth:.5,items:Cabletech.Ext.Util.buildRemoteCombox(
		"department",
		"部门",
		"department.Cab?cmd=loadDeptTree",
		["id","title"],
		"title",
		"id",
		false)},
	{columnWidth:.5,items:{xtype:"panel",items:{xtype:"button",text:"查看部门",scope:this,handler:this.viewDepartment}}}
	);
	this.viewDepartment=function(){
	var deptId=this.fp.findSomeThing("department").getValue();
	if(!deptId)
		Ext.Msg.alert('提示信息','请先选择部门');
		return;
	Cabletech.Ext.Util.viewObject(
		"DepartmentManagePanel",
		Ext.emptyFn,
		"script/DepartmentManagePanel.js",
		"",
		deptId
	);
	}
	 * </code>
	 * </pre>
	 * 
	 * @param {String} crudClass 需要调用查看方法的CrudPanel对应的ClassName
	 * @param {Function} callback 在查看页面点击确定的时候调用的回调方法
	 * @param {String} script 需要调用查看方法的CrudPanel对应的js文件路径,该文件路径的全路径是Lanyo_Ajax.script+script
	 * @param {String} otherScript 需要调用查看方法的CrudPanel对应的js文件需要关联引入的其他js。这些js文件也可以延迟加载。如果有多个js文件需要引入，在js文件路径之间用','隔开
	 * @param {Object} id 需要传入查看的对象的id
	 * 
	 */
	viewObject : function(crudClass, callback, script, otherScripts, id) {
		if (this.NormalClass[crudClass]) {
			var clz = this.NormalClass[crudClass];
			var o = new clz();
			o.viewObject(id, callback);
		} else {// 从脚本中加载
			if (otherScripts) {
				var s = otherScripts.split(";");
				for (var i = 0; i < s.length; i++) {
					Ext.Ajax.request({
								url : s[i],
								success : function(req) {
									eval(req.responseText);
								}
							});
				}
			}
			Ext.Ajax.request({
						url : Lanyo_Ajax.script + script,
						success : function(req) {
							eval(req.responseText);
							eval("this.NormalClass." + crudClass + "="
									+ crudClass);
							var clz = this.NormalClass[crudClass];
							var o = new clz();
							o.viewObject(id, callback);
						},
						scope : this
					});
		}
	},

	/**
	 * 在任何代码段中，调用一个CrudPanel或者CrudListPanel对应模块的删除功能来删除一个指定对象。
	 * 
	 * <pre>
	 * <code>
	//示例，在添加员工的面板中选择部门的时候，可以点击部门后面的【删除】按钮，及时删除选中的部门。
	Lanyo_Ajax.script="/";
	Cabletech.Ext.Util.columnPanelBuild(
	{columnWidth:.5,items:Cabletech.Ext.Util.buildRemoteCombox(
		"department",
		"部门",
		"department.Cab?cmd=loadDeptTree",
		["id","title"],
		"title",
		"id",
		false)},
	{columnWidth:.5,items:{xtype:"panel",items:{xtype:"button",text:"删除部门",scope:this,handler:this.removeDepartment}}}
	);
	this.removeDepartment=function(){
	var deptId=this.fp.findSomeThing("department").getValue();
	if(!deptId)
		Ext.Msg.alert('提示信息','请先选择部门');
		return;
	Cabletech.Ext.Util.removeObject(
		"DepartmentManagePanel",
		function(){
			this.fp.findSomeThing("department").setValue("");
		},
		"script/DepartmentManagePanel.js",
		"",
		deptId
	);
	}
	 * </code>
	 * </pre>
	 * 
	 * @param {String} crudClass 需要调用删除方法的CrudPanel对应的ClassName
	 * @param {Function} callback 在删除完成的时候调用的回调方法
	 * @param {String} script 需要调用删除方法的CrudPanel对应的js文件路径,该文件路径的全路径是Lanyo_Ajax.script+script
	 * @param {String} otherScript 需要调用删除方法的CrudPanel对应的js文件需要关联引入的其他js。这些js文件也可以延迟加载。如果有多个js文件需要引入，在js文件路径之间用','隔开
	 * @param {Object} id 需要传入删除的对象id
	 * 
	 */
	removeObject : function(crudClass, callback, script, otherScripts, id) {
		if (this.NormalClass[crudClass]) {
			var clz = this.NormalClass[crudClass];
			var o = new clz();
			o.removeObject(id, callback);
		} else {// 从脚本中加载
			if (otherScripts) {
				var s = otherScripts.split(";");
				for (var i = 0; i < s.length; i++) {
					Ext.Ajax.request({
								url : s[i],
								success : function(req) {
									eval(req.responseText);
								}
							});
				}
			}
			Ext.Ajax.request({
						url : Lanyo_Ajax.script + script,
						success : function(req) {
							eval(req.responseText);
							eval("this.NormalClass." + crudClass + "="
									+ crudClass);
							var clz = this.NormalClass[crudClass];
							var o = new clz();
							o.removeObject(id, callback);
						},
						scope : this
					});
		}
	},

	/**
	 * 根据一组静态的数据来创建一个下拉列表的简单方法。
	 * 
	 * <pre>
	 * <code>
	//例子，创建一个包括三个状态的下拉选择框
	var statusData=[['状态1',1],['状态2',2],['状态3',3]];
	//...
	items:[Cabletech.Ext.Util.buildCombox('mycombo','自定义状态',statusData,1,true)]
	 * </code>
	 * </pre>
	 * 
	 * @param {String|Object} name 创建的下来列表组件名称
	 * 如果第一个参数为Object {} 如 ：
	 * buildCombox({
	 * 		 name : "comboName",
	 *       hiddenName : "comboName",
	 *       fieldLabel : "comboLabel",
	 *       value:"defaultValue",
	 *       allowBlank:true,
	 *       data:comboData
	 * })
	 * 也可以设置对应的属性。
	 * 
	 * @param {String} fieldLabel 组件表单名称
	 * @param {Array} data 下拉列表的数据，是一个二维数组，其中的每一个数组格式为[String,Object]，其中String是对应的下拉列表显示名称，Object是选中的值。
	 * @param {Mixed} defaultValue 默认的选中值
	 * @param {Boolean} allowBlank 是否允许为空
	 * 
	 */
	buildCombox : function(name, fieldLabel, data, defaultValue, allowBlank) {
		var cfg = {}
		if (Ext.isObject(name)) {
			cfg = name;
			data = cfg['data'];
			delete cfg['data'];
		} else if (Ext.isArray(name)) {
			data = name;
			name = null;
		} else {
			cfg = {
				name : name,
				hiddenName : name,
				fieldLabel : fieldLabel,
				value : defaultValue,
				allowBlank : allowBlank
			}
		}
		var comboCfg = Ext.apply({
					xtype : "combo",
					displayField : "title",
					valueField : "value",
					store : new Ext.data.SimpleStore({
								fields : ['title', 'value'],
								data : data
							}),
					editable : false,
					mode : 'local',
					triggerAction : 'all',
					emptyText : '请选择...'
				}, cfg);
		return comboCfg;
	},

	/**
	 * 根据一个url远程请求后台数据来创建一个动态的下拉列表的简单方法。
	 * 
	 * <pre>
	 * <code>
	//例子，创建一个部门的下拉选择框
	items:[Cabletech.Ext.Util.buildRemoteCombox(
		"department",
		"部门",
		"department.Cab?cmd=loadDeptList",
		["id","title"],
		"title",
		"id",
		false)]
	 * </code>
	 * </pre>
	 * 
	 * @param {String|Object} n 创建的下拉列表组件名称
	 * 如果第一个参数为Object {} 如 ：
	 * buildCombox({
	 * 		 fields : "comboName",
	 *       url|dataUrl : "comboName"
	 * })
	 * 也可以设置对应的属性。
	 * 
	 * @param {String} fl 组件表单名称
	 * @param {String} url 下拉列表异步请求数据的路径
	 * @param {MixedCollection} fs A MixedCollection containing the defined Fields for the Records stored in this Store. Read-only.
	 * @param {String} df 在下拉列表中绑定的需要显示的字段项。
	 * @param {String} vf 在下拉列表中绑定的作为选择值的字段项。
	 * @param {Boolean} ab 是否允许为空
	 * @param {String} lsv 本地缓存的缓存名称。如果设置了该值。一旦该下拉列表加载过一次后，其值就会在前端缓存下来，第二次就不需要重新去请求数据。
	 * 
	 */
	buildRemoteCombox : function(name, fl, url, fs, df, vf, ab, lsv) {
		var comboConfig = {
			xtype : "smartcombo",
			lazyRender : true,
			triggerAction : "all",
			typeAhead : true,
			editable : false
		};
		if (arguments.length == 1 && Ext.isObject(name)) {
			fields = name.fields;
			url = name.url || name.dataUrl;
			Ext.del(name, 'fields', 'url', 'dataUrl');
			Ext.apply(comboConfig, name);
		} else {
			Ext.apply(comboConfig, {
						name : name,
						hiddenName : name,
						allowBlank : ab,
						fieldLabel : fl,
						displayField : df ? df : "title",
						valueField : vf ? vf : "id"
					});
		}
		var storeConfig = {
			id : "id",
			url : url,
			root : "root",
			totalProperty : "totalcount",
			remoteSort : true,
			baseParams : {
				pageSize : "-1"
			},
			pageSize : "-1",
			fields : fs
		}
		if (!Ext.isString(lsv)) {
			comboConfig.store = new Ext.data.JsonStore(storeConfig);
		} else {
			comboConfig.store = new Cabletech.Ext.CachedRemoteStore(Ext.apply({
						varName : lsv
					}, storeConfig));
		}
		return comboConfig;
	},

	/**
	 * 简单的打印表格的方法，该方法会开启一个新窗口，并把指定的girdPanel的dom拷贝到新窗口中，配上自定义的打印样式，实现简单的列表打印效果<br/>
	 * 在新开的打印页面中引入的样式表为：/stylesheet/print.css，可以自定义该样式表。<br />
	 * 
	 * 该方法还可以用来打印任何东西，比如form表单等。
	 * <pre>
	 * <code>
	//例子：点击【打印】按钮，填出一个新窗口，打印当前grid中的数据：
	{xtype:'button',text:'打印列表',scope:this,handler:this.printGridData},
	//...
	this.printGridData=function(){
	if(this.grid.store.getCount())
		Cabletech.Ext.Util.printGrid(this.grid);
	}
	 * </code>
	 * </pre>
	 * 
	 * @param {Object} grid 需要打印的组件对象。任何组件对象都可以使用统一的方式完成打印。
	 * 
	 */
	printGrid : function(grid) {
		var win = window.open("");
		win.document
				.write("<link rel='stylesheet' type='text/css' href='/stylesheet/print.css' />");
		win.document.write(grid.el.dom.innerHTML);
		win.document.close();
	},

	/**
	 * 得到列表选择窗口的实例的方法。该方法返回一个{@link Cabletech.Ext.GridSelectWin}实例。<br/>
	 * 该方法使用缓存机制。<br/>
	 * 要调用该方法必须要保证gridClz类已经加载或者定义。
	 * 
	 * @param {String} winName 全局的选择窗口名称。该名称即是选择窗口的缓存名称。
	 * @param {String} title 选择窗口的名称。
	 * @param {Integer} width 选择窗口的宽度。
	 * @param {Integer} height 选择窗口的高度。
	 * @param {Class} Ext.grid.Grid 选择窗口中包含的列表类型。
	 * @param {Object} config 配置GridSelectWin的信息。参考{@link Cabletech.Ext.GridSelectWin}配置
	 */
	getSelectWin : function(winName, title, width, height, gridClz, config) {
		if (!Cabletech.Ext.SelectWin)
			Cabletech.Ext.SelectWin = {};
		if (!Cabletech.Ext.SelectWin[winName]) {
			config = config || {};
			var glist = config.grid;
			if (!glist && gridClz)
				glist = eval("new " + gridClz + "(config)");
			config = Ext.apply({}, {
						title : title,
						width : width,
						height : height,
						grid : glist
					}, config);
			Cabletech.Ext.SelectWin[winName] = new Cabletech.Ext.GridSelectWin(config);
		}
		return Cabletech.Ext.SelectWin[winName];
	},

	/**
	 * 设置FckEditor内的内容
	 * 
	 * @param {String} name 要设置Fck的名称
	 * @param {String} html 设置editor的内容
	 * 
	 */
	setDelayEditorContent : function(name, html) {
		if (typeof FCKeditorAPI == "object") {
			var editor = FCKeditorAPI.GetInstance(name)
			if (editor)
				editor.SetHTML(html || "");
		}
	},

	/**
	 * 设置FckEditor内的内容。该方法保证FckEditor加载完成后再设置内容
	 * 
	 * @param {String} name 要设置Fck的名称
	 * @param {String} html 设置editor的内容
	 * 
	 */
	setFCKEditorContent : function(name, html) {
		if (typeof FCKeditorAPI == "object") {
			var editor = FCKeditorAPI.GetInstance(name)
			if (editor)
				editor.SetHTML(html || "");
			else
				this.setDelayEditorContent.createCallback(name, html)
						.defer(2000);
		} else
			this.setDelayEditorContent.createCallback(name, html).defer(2000);
	},

	/**
	 * 根据id得到FckEditor实例
	 * 
	 * @param {String} id 要得到的FckEditor的id
	 * 
	 * @return {FCKeditor} 得到的FckEditor实例。如果没有加载fckAPI，返回null。
	 * 
	 */
	getFckById : function(id) {
		var fckApi = window.FCKeditorAPI;
		if (!fckApi)
			return null;
		return fckApi.GetInstance(id);
	},

	/**
	 * 得到指定FckEditor的内容。
	 * 
	 * @param {String} name 指定要得到内容的FckEditor的名称
	 * 
	 * @return {String} v 得到的FckEditor内容。
	 */
	getFCKEditorContent : function(name) {
		if (typeof FCKeditorAPI == "object") {
			var editor = FCKeditorAPI.GetInstance(name)
			return editor.GetHTML();
		} else
			return "";
	},

	/**
	 * 在grid加载后自动选中第一行。<br/>
	 * 该方法只需要在需要实现该功能的grid的render事件中执行一次即可。
	 * 
	 * @param {Ext.grid.GridPanel} grid 需要实现自动选中第一行这个功能的gird。
	 */
	autoFocusFirstRow : function(grid) {
		grid.store.on("load", function() {
					if (grid.rendered) {
						var sel = grid.getSelectionModel();
						if (!sel.hasSelection() && grid.store.getCount()) {
							grid.getView().focusRow(0);
						} else if (sel.hasSelection()) {
							grid.getView().focusRow(grid.store.indexOf(grid
									.getSelectionModel().getSelected()));
						} else {
							grid.focus();
						}
					} else {
						grid.on("render", function(g) {
									Cabletech.Ext.Util.autoFocusFirstRow(g);
								})
					}
				})
	},

	/**
	 * 得到一个全局的导出或者下载form。 <br/>
	 * 该form是一个隐藏的div+IFrame。因为在页面上直接向后台请求下载资源是不能做到的。<br/>
	 * 示例中提供了一个常用的资源下载方法。<br />
	 * 
	 * 
	 * <pre>
	 * <code>
	//示例：一个通用的往后台发送下载资源请求的方法。可以用在页面上导出excel，导出zip等资源。
	//config定义：
	// btn:点击的导出excel按钮
	// disableBtn:是否在导出excel的时候disable导出按钮
	// url：导出excel的url
	// params：传入的参数
	// scope:scope callback 执行的作用域
	// callback:完成导出后需要执行的动作
	//
	Cabletech.Ext.Util.exportExcel=function(config){
	if(config.btn && config.disableBtn){
		config.btn.disable();
	}
	var exportForm=Cabletech.Ext.Util.getExportForm();
	exportForm.form.submit({
		url:config.url,
		params:config.params,
		scope:config.scope||this,
		success:function(r,a){
			if(config.btn && config.disableBtn){
				config.btn.enable();
			}
			if(config.callback) config.callback.call(config.scope||this,r,a);
			if(a.result && a.result.data && a.result.data.msg){
				Ext.Msg.alert("提示信息",a.result.data.msg);
			}
		}
	});
	}
	 * </code>
	 * </pre>
	 * 
	 * @return {Ext.form.FormPanel} exportForm 得到的全局下载表单
	 */
	getExportForm : function() {
		var exportForm = Ext.getCmp("global_export_form");
		if (!exportForm) {
			exportForm = new Ext.form.FormPanel({
						fileUpload : true,
						hidden : true,
						items : {}
					});
			var fe = document.createElement("div");
			document.body.appendChild(fe);
			exportForm.render(fe);
		}
		return exportForm;
	},

	/**
	 * 执行Panel上的某一个按钮的handler方法。<br/>
	 * 该按钮是需要通过panel的buttons属性添加的按钮<br/>
	 * 
	 * 
	 * 
	 * @param {Ext.Panel} p
	 * 					需要调用的panel
	 * @param {String} btn
	 *            		需要调用的button的id
	 * @param {Object} scope
	 * 					按钮方法执行的作用域
	 */
	executePanelButtons : function(p, btn, scope) {
		if (p.getFooterToolbar()) {
			var bt = p.getFooterToolbar().get(btn);
			if (bt && !(bt.disabled || bt.hidden) && bt.handler)
				bt.handler.call(scope || bt.scope || window);
		}
	},

	/**
	 * 完成一个异步请求的包装方法。
	 * 
	 * @param {String} url 发送请求的地址
	 * @param {Object} params 发送请求提交的参数信息
	 * @param {Object} scope 请求响应回调方法的执行作用域
	 * @param {Function} success 在请求成功后执行的回调方法
	 * 		<ul>传入参数
	 * 			<li>{Object} response 返回的XMLHttpRequest对象</li>
	 * 			<li>{Object} options 异步请求发送的参数</li>
	 * 		</ul>
	 * @param {Function} failure 当调用失败后的回调方法
	 * 		<ul>传入参数
	 * 			<li>{Object} response 返回的XMLHttpRequest对象</li>
	 * 		</ul>
	 * @param {Function} successOp 当调用成功后的回调方法，该方法区别于success回调函数。该方法只会传入解析后的responseText产生的对象
	 * 		<ul>传入参数
	 * 			<li>{Object} data 解析后的responseText产生的对象</li>
	 * 			<li>{Object} options 异步请求发送的参数</li>
	 * 		</ul>
	 */
	ajaxRequest : function(url, params, scope, success, failure, successOp) {
		Ext.Ajax.request({
					url : url,
					params : params || {},
					scope : scope || this,
					success : success || function(response, options) {
						var data = Ext.decode(response.responseText);
						if (data.success) {
							if (successOp)
								successOp.call(this, data, options);
							else if (data.msg) {
								Cabletech.Ext.Msg.alert(data.msg);
							}
						} else if (data.msg) {
							Ext.Msg.errorMsg(null, data.msg);
						}
					},
					failure : failure || function(response) {
						var data = Ext.decode(response.responseText);
						Ext.Msg.errorMsg(null, data.msg
										? data.msg
										: (data.errors && data.errors.msg
												? data.errors.msg
												: "未知错误原因!"));
					}
				});
	},
	/**
	 * 切换系统皮肤
	 * @param {String} value
	 */
	applySkin : function(value) {
		Ext.util.CSS.swapStyleSheet('extSkin', String.format(
						'plugins/extjs/{0}/resources/css/{1}.css',
						Lanyo_Ajax.extVersion, value));
		if (Lanyo_Ajax.sysSkinPath)
			Ext.util.CSS.swapStyleSheet('sysSkin', Lanyo_Ajax.sysSkinPath
							+ value + ".css");
	}
});
Cabletech.Ext.Util.easycolumn = Cabletech.Ext.Util.buildColumnForm;