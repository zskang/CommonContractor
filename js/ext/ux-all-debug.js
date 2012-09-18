TreeComboField = Ext.extend(Ext.form.TriggerField, {
	/**
	 * @cfg {String} valueField 取值绑定的字段名，默认为'id'
	 */
	valueField : "id",
	/**
	 * @cfg {String} displayField 下拉树种显示名称绑定的字段名，默认为'name'
	 */
	displayField : "name",
	/**
	 * @cfg {Integer} minListWidth 最小的列表显示宽度
	 */
	minListWidth : 70,
	haveShow : false,
	/**
	 * @cfg {Boolean} editable 是否默认可编辑 默认为false
	 */
	editable : false,
	/**
	 * @cfg {Boolean} returnObject 返回值是否作为对象返回
	 */
	returnObject : false,
	/**
	 * @cfg {Boolean} leafOnly 是否只能选择叶子节点，默认可以选择任何节点。
	 */
	leafOnly : false,
	/**
	 * @cfg {Integer} clicksFinishEdit 在节点上点击作为选择的次数
	 */
	clicksFinishEdit : 1,
	/**
	 * @cfg {Boolean} readOnly 是否只读
	 */
	readOnly : false,
	hiddenNodes : [],
	// private
	initEvents : function() {
		TreeComboField.superclass.initEvents.call(this);
		this.keyNav = new Ext.KeyNav(this.el, {
					"up" : function(e) {
						this.inKeyMode = true;
						this.selectPrevious();
					},

					"down" : function(e) {
						if (!this.isExpanded()) {
							this.onTriggerClick();
						} else {
							this.inKeyMode = true;
							this.selectNext();
						}
					},
					"enter" : function(e) {
						var sm = this.tree.getSelectionModel();
						if (sm.getSelectedNode()) {
							var node = sm.getSelectedNode();
							this.choice(node);
							sm.clearSelections();
							return;
						}
					},
					"esc" : function(e) {
						this.collapse();
					},
					scope : this
				});
		this.queryDelay = Math.max(this.queryDelay || 10, this.mode == 'local'
						? 10
						: 250);
		this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
		if (this.typeAhead) {
			this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
		}
		if (this.editable !== false) {
			this.el.on("keyup", this.onKeyUp, this);
		}
		if (this.forceSelection) {
			this.on('blur', this.doForce, this);
		}
	},
	// private
	selectPrevious : function() {
		var sm = this.tree.getSelectionModel();
		if (!sm.selectPrevious()) {
			var root = this.tree.getRootNode();
			sm.select(root);
			this.el.focus();
		} else {
			this.el.focus();
		}
	},
	setComboValue : function(id, text) {
		if (this.hiddenField) {
			this.hiddenField.value = id;
		}
		Ext.form.ComboBox.superclass.setValue.call(this, text);
		this.value = id;
	},
	// private
	selectNext : function() {
		var sm = this.tree.getSelectionModel();
		if (!sm.selectNext()) {
			var root = this.tree.getRootNode();
			sm.select(root);
			this.el.focus();
		} else {
			this.el.focus();
		}
	},
	// private
	onTriggerClick : function() {
		if (this.readOnly || this.disabled) {
			return false;
		} else if (!this.tree.rendered || !this.list) {
			this.treeId = Ext.id();
			this.list = new Ext.Layer({
						id : this.treeId,
						cls : "x-combo-list",
						constrain : false
					});
			if (!this.innerDom)
				this.innerDom = Ext.getBody().dom;
			if (this.tree.rendered) {
				this.list.appendChild(this.tree.el);
			} else {
				this.tree.render(this.treeId);
				var lw = this.listWidth
						|| Math.max(this.wrap.getWidth(), this.minListWidth);
				this.tree.setWidth(lw);
				this.tree.on("expandnode", this.restrictHeight, this);
				this.tree.on("collapsenode", this.restrictHeight, this);
			}
		} else
			this.restrictHeight();
		this.expand();
	},
	// private
	restrictHeight : function() {
		// this.list.dom.style.height = '';
		if (!this.list)
			return;
		var inner = this.innerDom;
		var h = inner.clientHeight - this.wrap.getBottom();
		if (this.tree.el.dom.offsetHeight >= h) {
			this.tree.setHeight(h);
		} else {
			this.tree.setHeight("auto");
		}
		// this.list.alignTo(this.getEl(), "tl-bl?");
	},
	// private
	filterTree : function(e) {
		if (!this.isExpanded())
			this.expand();
		var text = e.target.value;
		Ext.each(this.hiddenNodes, function(n) {
					n.ui.show();
				});
		if (!text) {
			this.filter.clear();
			return;
		}
		this.tree.expandAll();
		this.restrictHeight();
		this.filter.filterBy(function(n) {
					return (!n.attributes.leaf || n.text.indexOf(text) >= 0);
				});

		// hide empty packages that weren't filtered
		this.hiddenNodes = [];
		this.tree.root.cascade(function(n) {
					if (!n.attributes.leaf && n.ui.ctNode.offsetHeight < 3) {
						n.ui.hide();
						this.hiddenNodes.push(n);
					}
				}, this);
	},
	// private
	expand : function() {
		if (this.list) {
			Ext.getDoc().on('mousedown', this.hideIf, this);
			/*
			 * if(!this.tree.body.isScrollable()){ this.tree.setHeight('auto'); }
			 */
			this.list.show();
			this.list.alignTo(this.getEl(), "tl-bl?");
		} else {
			this.onTriggerClick();
		}
	},
	// private
	collapse : function() {
		if (this.list) {
			this.list.hide();
			Ext.getDoc().un('mousedown', this.hideIf, this);
		}
	},
	// private
	onEnable : function() {
		TreeComboField.superclass.onEnable.apply(this, arguments);
		if (this.hiddenField) {
			this.hiddenField.disabled = false;
		}
	},
	// private
	onDisable : function() {
		TreeComboField.superclass.onDisable.apply(this, arguments);
		if (this.hiddenField) {
			this.hiddenField.disabled = true;
		}
		Ext.getDoc().un('mousedown', this.hideIf, this);
	},
	// private
	hideIf : function(e) {
		if (!e.within(this.wrap) && !e.within(this.list)) {
			this.collapse();
		}
	},
	// private
	initComponent : function() {
		TreeComboField.superclass.initComponent.call(this);
		this.addEvents('beforeSetValue');
		this.filter = new Ext.tree.TreeFilter(this.tree, {
					clearBlank : true,
					autoClear : true
				});
	},
	// private
	onRender : function(ct, position) {
		TreeComboField.superclass.onRender.call(this, ct, position);
		if (this.clicksFinishEdit > 1)
			this.tree.on("dblclick", this.choice, this);
		else
			this.tree.on("click", this.choice, this);
		if (this.hiddenName) {
			this.hiddenField = this.el.insertSibling({
						tag : 'input',
						type : 'hidden',
						name : this.hiddenName,
						id : (this.hiddenId || this.hiddenName)
					}, 'before', true);
			this.hiddenField.value = this.hiddenValue !== undefined
					? this.hiddenValue
					: this.value !== undefined ? this.value : '';
			this.el.dom.removeAttribute('name');
		}
		if (!this.editable) {
			this.editable = true;
			this.setEditable(false);
		} else {
			this.el.on('keydown', this.filterTree, this, {
						buffer : 350
					});
		}
	},
	/**
	 * 返回选中的树节点
	 * 
	 * @return {Object} ret 选中的节点值。
	 */
	getValue : function(returnObject) {
		if ((returnObject === true) || this.returnObject)
			return typeof this.value != 'undefined' ? {
				value : this.value,
				text : this.text,
				toString : function() {
					return this.text;
				}
			} : "";
		return typeof this.value != 'undefined' ? this.value : '';
	},
	/**
	 * 清除选择的值。
	 */
	clearValue : function() {
		if (this.hiddenField) {
			this.hiddenField.value = '';
		}
		this.setRawValue('');
		this.lastSelectionText = '';
		this.applyEmptyText();
		this.value = "";
	},
	/**
	 * 验证选择的值
	 * 
	 * @return {Boolean} ret 如果选择的值合法，返回true。
	 */
	validate : function() {
		if (this.disabled
				|| this.validateValue(this.processValue(this.getValue()))) {
			this.clearInvalid();
			return true;
		}
		return false;
	},
	/**
	 * Returns whether or not the field value is currently valid by validating
	 * the processed value of the field. Note: disabled fields are ignored.
	 * 
	 * @param {Boolean}
	 *            preventMark True to disable marking the field invalid
	 * @return {Boolean} True if the value is valid, else false
	 */
	isValid : function(preventMark) {
		if (this.disabled) {
			return true;
		}
		var restore = this.preventMark;
		this.preventMark = preventMark === true;
		var v = this.validateValue(this.processValue(this.getValue()));
		this.preventMark = restore;
		return v;
	},
	/**
	 * Validates a value according to the field's validation rules and marks the
	 * field as invalid if the validation fails
	 * 
	 * @param {Mixed}
	 *            value The value to validate
	 * @return {Boolean} True if the value is valid, else false
	 */
	validateValue : function(value) {
		if (value.length < 1 || value === null) { // if it's
			// blank
			if (this.allowBlank) {
				this.clearInvalid();
				return true;
			} else {
				this.markInvalid(this.blankText);
				return false;
			}
		}
		if (value.length < this.minLength) {
			this.markInvalid(String.format(this.minLengthText, this.minLength));
			return false;
		}
		if (value.length > this.maxLength) {
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			return false;
		}
		if (this.vtype) {
			var vt = Ext.form.VTypes;
			if (!vt[this.vtype](value, this)) {
				this.markInvalid(this.vtypeText || vt[this.vtype + 'Text']);
				return false;
			}
		}
		if (typeof this.validator == "function") {
			var msg = this.validator(value);
			if (msg !== true) {
				this.markInvalid(msg);
				return false;
			}
		}
		if (this.regex && !this.regex.test(value)) {
			this.markInvalid(this.regexText);
			return false;
		}
		return true;
	},
	readPropertyValue : function(obj, p) {
		var v = null;
		for (var o in obj) {
			if (o == p)
				return true;
			// v = obj[o];
		}
		return v;
	},
	/**
	 * 给该属性设值。设定的值符合树形列表中的某一个值，就会自动选中那个值。如果没有找到，则通过配置的valueNotFoundText显示指定的值。
	 * 
	 * @param {Object}
	 *            obj 设定的值
	 */
	setValue : function(obj) {
		if (!obj) {
			this.clearValue();
			return;
		}
		if (this.fireEvent('beforeSetValue', this, obj) === false) {
			return;
		}
		var v = obj;
		var text = v;
		var value = this.valueField || this.displayField;
		if (typeof v == "object" && this.readPropertyValue(obj, value)) {
			text = obj[this.displayField || this.valueField];
			v = obj[value];
		}
		var node = this.tree.getNodeById(v);
		if (node) {
			text = node.text;
		} else if (this.valueNotFoundText !== undefined) {
			text = this.valueNotFoundText;
		}
		this.lastSelectionText = text;
		if (this.hiddenField) {
			this.hiddenField.value = v;
		}
		TreeComboField.superclass.setValue.call(this, text);
		this.value = v;
		this.text = text;
	},
	/**
	 * 设置是否可编辑状态。
	 * 
	 * @param {Boolean}
	 *            value 设置的可编辑状态。
	 */
	setEditable : function(value) {
		if (value == this.editable) {
			return;
		}
		this.editable = value;
		if (!value) {
			this.el.dom.setAttribute('readOnly', true);
			this.el.on('mousedown', this.onTriggerClick, this);
			this.el.addClass('x-combo-noedit');
		} else {
			this.el.dom.setAttribute('readOnly', false);
			this.el.un('mousedown', this.onTriggerClick, this);
			this.el.removeClass('x-combo-noedit');
		}
	},
	// private
	choice : function(node, eventObject) {
		if (!this.leafOnly || node.isLeaf()) {
			if (node.id != "root") {
				this.setValue(node.id);
			} else {
				this.clearValue();
				this.el.dom.value = node.text;
			}
			this.fireEvent('select', this, node);
			this.collapse();
			this.fireEvent('collapse', this);
		} else {
			if (node.id == "root") {
				this.clearValue();
				this.el.dom.value = node.text;
				this.fireEvent('select', this, node);
				this.collapse();
				this.fireEvent('collapse', this);
			}
		}
	},
	// private
	validateBlur : function() {
		return !this.list || !this.list.isVisible();
	},
	/**
	 * 判断列表是否处于展开状态
	 * 
	 * @return {Boolean} 是否处于展开状态
	 */
	isExpanded : function() {
		return this.list && this.list.isVisible();
	},
	canFocus : function() {
		return !this.disabled;
	},
	onDestroy : function() {
		if (this.tree.rendered && this.list) {
			this.list.hide();
			this.list.destroy();
			delete this.list;
		}
		TreeComboField.superclass.onDestroy.call(this);
	}
});
Ext.reg('treecombo', TreeComboField);

CheckTreeComboField = Ext.extend(TreeComboField, {
	leafOnly : false,// 只允许选择子节点
	editable : true,
	// private
	onTriggerClick : function() {
		if (this.disabled)
			return;
		if (!this.listPanel.rendered || !this.list) {
			this.treeId = Ext.id();
			this.list = new Ext.Layer({
						id : this.treeId,
						cls : "x-combo-list",
						constrain : false
					});
			if (!this.innerDom)
				this.innerDom = Ext.getBody().dom;
			if (this.listPanel.rendered) {
				this.list.appendChild(this.listPanel.el);
			} else {
				this.listPanel.render(this.treeId);
				var lw = this.listWidth
						|| Math.max(this.wrap.getWidth(), this.minListWidth);
				this.listPanel.setWidth(lw);
				this.tree.on("expandnode", this.restrictHeight, this);
				this.tree.on("collapsenode", this.restrictHeight, this);
			}
			if (this.value)
				this.setCheckdNode(this.value);
		} else
			this.restrictHeight();
		this.expand();
	},
	// private
	restrictHeight : function() {
		// this.list.dom.style.height = '';
		if (!this.list)
			return;
		var inner = this.innerDom;
		var h = inner.clientHeight - this.wrap.getBottom();
		if (this.listPanel.el.dom.offsetHeight >= h) {
			this.listPanel.setHeight(h);
		} else {
			this.listPanel.setHeight("auto");
			this.tree.setHeight("auto");
		}
	},
	// private
	initComponent : function() {
		CheckTreeComboField.superclass.initComponent.call(this);
		this.listPanel = new Ext.Panel({
					border : false,
					bodyBorder : false,
					buttonAlign : "center",
					layout : "fit",
					items : this.tree,
					bbar : [{
								text : "确定选择",
								handler : this.choice,
								scope : this
							}, {
								text : "清空",
								handler : this.cleanChoice,
								scope : this
							}, {
								text : "取消",
								handler : this.cancelChoice,
								scope : this
							}]
				});

	},
	// private
	onRender : function(ct, position) {
		CheckTreeComboField.superclass.onRender.call(this, ct, position);
		this.tree.on("checkchange", this.checkNode, this);

	},
	/**
	 * 设置节点的选中状态 将传入值字符串中所有匹配值的节点都设置为选中状态
	 * 
	 * @param {String}
	 *            v 需要选中的节点的值组成的字符串。各值之间使用','连接
	 */
	setCheckdNode : function(v) {
		this.cleanCheckNode(this.tree.root);
		var vs = v.split(",");
		for (var i = 0; i < vs.length; i++) {
			var node = null;
			var valueField = this.valueField;
			this.tree.root.cascade(function(n) {
						if (n.attributes[valueField] == vs[i]) {
							node = n;
							return false;
						}
					});
			if (node)
				this.checkNode(node, true);
		}
	},
	/**
	 * 清除指定节点及其子节点的选中状态
	 * 
	 * @param {Ext.data.Node}
	 *            要清除选中状态的节点。
	 */
	cleanCheckNode : function(node) {
		var checked = false;
		node.cascade(function(n) {
					if (n.ui.checkbox) {
						n.attributes.checked = n.ui.checkbox.checked = checked;
						n.attributes.selectAll = checked;
						if (checked)
							n.ui.addClass("x-tree-selected");
						else
							n.ui.removeClass("x-tree-selected");
					}
				}, this);
	},
	/**
	 * 改变指定节点的子节点和父节点的选中状态。<br/>
	 * 
	 * @param {Ext.data.Node}
	 *            node 要改变状态的节点
	 * @param {Boolean}
	 *            checked 改变的状态。true为选中状态，false为取消选中状态。
	 *            如果是将指定节点设置为选中状态，该方法会将该节点的直接/间接父节点设置为选中状态，该节点的直接/间接子节点设置为选中状态<br/>
	 *            如果是将指定节点设置为取消选中状态，该方法会将该节点的直接/间接父节点按逻辑设置为取消选中状态，该节点的直接/间接子节点设置为取消选中状态<br/>
	 * 
	 */
	checkNode : function(node, checked) {
		node.cascade(function(n) {
					if (n.ui.checkbox) {
						n.attributes.checked = n.ui.checkbox.checked = checked;
						n.attributes.selectAll = checked;
						if (checked)
							n.ui.addClass("x-tree-selected");
						else
							n.ui.removeClass("x-tree-selected");
					}
				}, this);
		node.bubble(function(n) {
					if (n != node) {
						if (!checked) {
							n.attributes.selectAll = checked;
							if (n.attributes.checked) {
								n.ui.removeClass("x-tree-selected");
							}
						} else if (!n.attributes.checked) {
							n.attributes.checked = n.ui.checkbox.checked = checked;
						}
					}
				});
	},
	/**
	 * 得到组件的值
	 * 
	 * @return {String} v 选中额值字符串。如果是选择了多个值，则是由多个值+','连接的字符串。
	 */
	getValue : function() {
		return typeof this.value != 'undefined' ? this.value : '';
	},
	// private
	clearValue : function() {
		if (this.hiddenField) {
			this.hiddenField.value = '';
		}
		this.setRawValue('');
		this.lastSelectionText = '';
		this.applyEmptyText();
		if (this.list)
			this.cleanCheckNode(this.tree.root);
	},
	// private
	getNodeValue : function(node) {
		if (node.attributes.selectAll
				&& (!this.leafOnly || node.attributes.leaf)) {
			if (this.t != "")
				this.t += ",";
			if (this.v != "")
				this.v += ",";
			var text = node.attributes[this.displayField || this.valueField];
			if (text === undefined)
				text = node.text;
			var value = node.attributes[this.valueField];
			if (value === undefined)
				value = node.id;
			this.t += text;
			this.v += value;
		} else if (node.attributes.checked)
			node.eachChild(this.getNodeValue, this)
	},
	/**
	 * 给该属性设值。设定的值符合树形列表中的某一个值，就会自动选中那个值。如果没有找到，则通过配置的valueNotFoundText显示指定的值。
	 * 
	 * @param {Object}
	 *            obj 设定的值
	 */
	setValue : function(obj) {
		if (!obj) {
			this.clearValue();
			return;
		}
		var v = obj;
		var text = v;
		var value = this.valueField || this.displayField;
		if (typeof v == "object" && this.readPropertyValue(obj, value)) {// 直接传入值

			text = obj[this.displayField || this.valueField];
			v = obj[value];
			if (this.list)
				this.setCheckdNode(v);

		} else {// 自动查找树中的选择节点，并设置值
			var root = this.tree.root;
			this.t = "";
			this.v = "";
			if (root.attributes.selectAll) {
				this.t = root.text;
			} else {
				root.eachChild(this.getNodeValue, this);
			}
			text = this.t;
			v = this.v;
		}
		this.lastSelectionText = text;
		if (this.hiddenField) {
			this.hiddenField.value = v;
		}
		TreeComboField.superclass.setValue.call(this, text);
		this.value = v;
		this.text = text;
	},
	/**
	 * 当选中节点后的响应方法
	 * 
	 * @param {Boolean}
	 *            notClean 是否清除之前已经选中项
	 */
	choice : function(notClean) {
		if (notClean)
			this.setValue(true);
		else
			this.clearValue();
		this.list.hide();
	},
	/**
	 * 清除当前已经选中项
	 */
	cleanChoice : function() {
		this.clearValue();
		this.list.hide();
	},
	/**
	 * 取消当前选项
	 */
	cancelChoice : function() {
		this.list.hide();
	},
	onDestroy : function() {
		if (this.listPanel.rendered && this.list) {
			this.list.hide();
			this.list.remove();
		}
		CheckTreeComboField.superclass.onDestroy.call(this);
	}
});
Ext.reg('checktreecombo', CheckTreeComboField);

/**
 * @class SmartCombox
 * @extends Ext.form.ComboBox 对ComboBox进行扩展,更好的支持对象的选择及其显示,并且可以在下拉列表中直接支持新建数据
 * 
 * <pre>
 * <code>
 *  //示例,ria框架提供的创建指定数据字典下拉列表的封装方法。
 *  getDictionaryCombo : function(name, fieldLabel, sn, valueField,disableBlank, editable) {
 *  return {
 *  xtype : &quot;smartcombo&quot;,
 *  name : name,
 *  hiddenName : name,
 *  displayField : &quot;title&quot;,
 *  valueField : valueField ? valueField : &quot;id&quot;,
 *  lazyRender : true,
 *  triggerAction : &quot;all&quot;,
 *  typeAhead : true,
 *  editable : editable,
 *  allowBlank : !disableBlank,
 *  sn:sn,
 *  objectCreator:{appClass:&quot;SystemDictionaryDetailPanel&quot;,script:&quot;/systemManage/SystemDictionaryManagePanel.js&quot;},
 *  createWinReady:function(win){
 *  if(this.fieldLabel)win.setTitle(&quot;新建&quot;+this.fieldLabel);
 *  if(this.sn)win.findSomeThing(&quot;parentSn&quot;).setOriginalValue(this.sn);
 *  },
 *  store : new Ext.data.JsonStore({
 *  id : &quot;id&quot;,
 *  url : &quot;systemDictionary.ejf?cmd=getDictionaryBySn&amp;sn=&quot;
 *  + sn,
 *  root : &quot;result&quot;,
 *  totalProperty : &quot;rowCount&quot;,
 *  remoteSort : true,
 *  baseParams : {
 *  pageSize : &quot;-1&quot;
 *  },
 *  fields : [&quot;id&quot;, &quot;title&quot;, &quot;tvalue&quot;]
 *  }),
 *  fieldLabel : fieldLabel
 *  }
 *  },
 * </code>
 * </pre>
 * 
 * @xtype smartcombo
 */
SmartCombox = Ext.extend(Ext.form.ComboBox, {
			/**
			 * @cfg {Boolean} disableCreateObject 是否禁用下拉列表下面的【新建】和【同步】按钮。
			 */
			/**
			 * 设置getValue获取的值，是基本类型，还是对象类型
			 * 
			 * @cfg {Boolean} returnObject
			 */
			returnObject : false,

			/**
			 * 用来定义新建对象的相关属性
			 * 
			 * @cfg {Object} objectCreator 该配置对象包括： <url>
			 *      <li>appClass {String} : 调用的创建业务对象的管理模块类名</li>
			 *      <li>script {String} : 调用的创建业务对象管理模块的script文件地址</li>
			 *      </ul>
			 */
			objectCreator : null,
			/**
			 * 当点击新建按钮，打开创建业务对象的窗口后的钩子方法
			 * 
			 * @param {Ext.Window}
			 *            win
			 *            创建业务对象的窗口。如果是CrudPanel，则直接调用win.getComponent(0)即是fp。
			 */
			createWinReady : function(win) {
				if (this.fieldLabel)
					win.setTitle("新建" + this.fieldLabel);
			},
			/**
			 * 创建新对象，实质是调用Util.addObject方法。
			 */
			newObject : function() {
				this.collapse();
				var title = this.fieldLabel;
				Util.addObject(this.objectCreator.appClass, this.reload
								.createDelegate(this),
						this.objectCreator.script,
						this.objectCreator.otherScripts, this.createWinReady
								.createDelegate(this));
			},
			/**
			 * 同步下拉列表中的业务对象数据。
			 */
			synchObject : function() {
				this.store.reload();
			},
			/**
			 * @cfg {Array} operatorButtons
			 *      显示在下拉列表底部的按钮数组。子类可以通过该属性覆盖并自定义自己的显示按钮。
			 */
			initComponent : function() {
				if (this.objectCreator && !this.disableCreateObject) {
					this.operatorButtons = [{
								text : "新建",
								iconCls : "add",
								handler : this.newObject,
								scope : this
							}, {
								text : "同步",
								iconCls : "f5",
								handler : this.synchObject,
								scope : this
							}];
				}
				SmartCombox.superclass.initComponent.call(this);
			},
			initList : function() {
				if (!this.list) {
					SmartCombox.superclass.initList.call(this);
					// this.operatorButtons=[{text:"ddd"}];
					if (this.operatorButtons) {// 增加对操作按钮的支持
						if (this.pageTb) {
							this.pageTb.insert(0, this.operatorButtons);
						} else {
							this.bottomBar = this.list.createChild({
										cls : 'x-combo-list-ft'
									});
							this.bottomToolbar = new Ext.Toolbar(this.operatorButtons);
							this.bottomToolbar.render(this.bottomBar);
							this.assetHeight += this.bottomBar.getHeight();
						}
					}
				}
			},
			/**
			 * 获取SmartCombox符合指定条件的record值。<br/>
			 * 实际的过程是首先得到combox的值value，然后在下拉列表绑定的store中查询field等于value的record。如果有，则返回该record。
			 * 
			 * @param {String}
			 *            field 指定的valueField属性名称。
			 * @return {Object} 符合条件的Record
			 */
			getValueObject : function(field) {
				var val = "";
				if (this.returnObject) {
					val = this.getValue().value;
				} else {
					val = this.getValue();
				}
				if (val) {
					var index = this.store.find(field || "id", val);
					if (index >= 0) {
						var record = this.store.getAt(index);
						return record;
					}
					return null;
				}
				return null;
			},

			/**
			 * 获取SmartCombox中的值
			 * 
			 * @return {Object}
			 */
			getValue : function() {
				if (this.returnObject) {
					var value = this.value;
					if (this.el.dom.value == this.PleaseSelectedValue
							|| this.el.dom.value == this.nullText)
						return null;
					if (this.selectedIndex >= 0) {
						var record = this.store.getAt(this.selectedIndex);
						if (record && record.data) {
							var t = record.data[this.displayField
									|| this.valueField];
							if (t != this.el.dom.value)
								value = null;
						}
					}
					return {
						value : value,
						text : this.el.dom.value,
						toString : function() {
							return this.text;
						}
					};
				} else
					return SmartCombox.superclass.getValue.call(this);
			},
			/**
			 * 设置SmartCombox的value
			 * 
			 * @param {String/Object/Number...}
			 *            v 要设置的值
			 */
			setValue : function(v) {
				if (v && typeof v == "object" && eval("v." + this.valueField)) {
					var value = eval("v." + this.valueField);
					var text = eval("v." + this.displayField) ? eval("v."
							+ this.displayField) : this.valueNotFoundText;
					this.lastSelectionText = text;
					if (this.hiddenField) {
						this.hiddenField.value = value;
					}
					Ext.form.ComboBox.superclass.setValue.call(this, text);
					this.value = value;
					if (this.store.find(this.valueField, value) < 0) {
						var o = {};
						o[this.valueField] = value;
						o[this.displayField] = text;
						if (this.store && this.store.insert) {
							this.store.insert(0, new Ext.data.Record(o));
							// this.select(0);
						}
					}
				} else if (v === null) {
					SmartCombox.superclass.setValue.call(this, "");
				} else {
					SmartCombox.superclass.setValue.call(this, v);
				}
			},
			onSelect : function(record, index) {
				if (this.fireEvent('beforeselect', this, record, index) !== false) {
					this.setValue(record.data[this.valueField
							|| this.displayField]);
					this.collapse();
					this.fireEvent('select', this, record, index);
				}
			}
		});
Ext.reg('smartcombo', SmartCombox);

/**
 * 
 * @class PopupWindowField
 * @extends Ext.form.TriggerField
 *          弹出窗口选择组件（类似于下拉框列表Field，只是在点击旁边下拉按钮时是通过弹出一个列表窗口，在窗口列表中进行数据选择。）
 * 
 * <pre>
 * <code>
 *  //示例，选择部门使用PopupWindowField，在列表中显示更详细的内容。
 *  //首先创建一个GridSelectWin
 *  if(!Global.departmentSelectWin)
 *  Global.departmentSelectWin=new GridSelectWin({
 *  title : &quot;选择部门&quot;,
 *  width : 540,
 *  height : 400,
 *  layout : &quot;fit&quot;,
 *  buttonAlign : &quot;center&quot;,
 *  closeAction : &quot;hide&quot;,
 *  grid : new DepartmentGrid(),
 *  modal : true,
 *  });
 * 
 *  //在form里面
 *  {xtype:'popupwinfield',win:Global.departmentSelectWin,valueField:'id',displayField:'departmentName',returnObject:true},
 * </code>
 * </pre>
 * 
 */
PopupWindowField = Ext.extend(Ext.form.TriggerField, {
			/**
			 * @cfg {Object} win 指定弹出的win。一般使用GridSelectWin<br/>
			 */
			win : null,
			/**
			 * @cfg {String} valueField 选中的列表Record中用来作为field值的属性名
			 */
			valueField : "id",
			/**
			 * @cfg {String} displayField 选中的列表Record中用来作为field显示的属性名
			 */
			displayField : "name",
			haveShow : false,
			/**
			 * @cfg {Booealn} editable 弹出窗口选择框是否能编辑。默认不能直接编辑
			 */
			editable : false,
			callback : Ext.emptyFn,
			returnObject : false,
			/**
			 * @cfg {Booealn} choiceOnly
			 *      是否只是选择值。如果为true，只返回值，如果为false，才考虑returnObject条件。
			 */
			choiceOnly : false,
			/**
			 * 得到选择的值<br/> 如果是choiceOnly为true,则直接返回this.value<br/>
			 * 如果是choiceOnly为false，并且returnObject为true，则会返回一个对象。<br/>
			 * 
			 * @return {Object} ret 得到选中的值
			 */
			getValue : function() {
				if (this.choiceOnly)
					return this.value;
				if (this.returnObject)
					return typeof this.value != 'undefined' ? {
						value : this.value,
						text : this.text,
						toString : function() {
							return this.text ? this.text : this.value;
						}
					} : "";
				return typeof this.value != 'undefined' ? this.value : '';
			},
			/**
			 * 给组件设置值。<br/> 如果是choiceOnly为true,则直接设置this.value<br/>
			 * 如果是choiceOnly为false，并且returnObject为true，则使用传入对象的o[displayField]属性值来作为显示的值，使用传入对象的o[valueField]作为值<br/>
			 * 
			 * @param {Object}
			 *            v 传入的要设置的值
			 */
			setValue : function(v) {
				if (this.choiceOnly)
					return this.value = v;
				if (v && typeof v == "object" && eval("v." + this.valueField)) {
					var value = eval("v." + this.valueField);
					var text = eval("v." + this.displayField) ? eval("v."
							+ this.displayField) : this.valueNotFoundText;
					this.lastSelectionText = text;
					if (this.hiddenField) {
						this.hiddenField.value = value;
					}
					PopupWindowField.superclass.setValue.call(this, text);
					this.value = value;
					this.text = text;
				} else if (v === null)
					PopupWindowField.superclass.setValue.call(this, "");
				else
					PopupWindowField.superclass.setValue.call(this, v);
			},
			/**
			 * 当点击后面的下拉框按钮，弹出选择窗口
			 */
			onTriggerClick : function() {
				if (this.win) {
					this.win.show();
				}
			},
			onRender : function(ct, position) {
				PopupWindowField.superclass.onRender.call(this, ct, position);
				if (this.win) {
					this.win.on("select", this.choice, this);
				}
				if (this.hiddenName) {
					this.hiddenField = this.el.insertSibling({
								tag : 'input',
								type : 'hidden',
								name : this.hiddenName,
								id : (this.hiddenId || this.hiddenName)
							}, 'before', true);
					this.hiddenField.value = this.hiddenValue !== undefined
							? this.hiddenValue
							: this.value !== undefined ? this.value : '';
					this.el.dom.removeAttribute('name');
				}
				if (!this.editable) {
					this.editable = true;
					this.setEditable(false);
				}
				if (this.choiceOnly)
					this.el.hide();
			},
			/**
			 * 在弹出列表窗口中选择了值之后执行的方法<br/> 默认是直接设置该field的值
			 * 
			 * @param {Object}
			 *            data 弹出窗口中列表选中Record对应的data值
			 * @param {Object}
			 *            win 弹出的列表窗口实例
			 */
			choice : function(data, win) {
				this.setValue(data);
				this.fireEvent('select', data, win);
			},
			/**
			 * @event select 当在弹出窗口列表中选定了某列数据，并执行完成choice方法后抛出<br/>
			 * @param {Object}
			 *            data 弹出窗口中列表选中Record对应的data值
			 * @param {Object}
			 *            win 弹出的列表窗口实例
			 */
			initComponent : function() {
				PopupWindowField.superclass.initComponent.call(this);
				this.addEvents("select");

			},
			validateBlur : function() {
				return !this.win || !this.win.isVisible();
			},
			onDestroy : function() {
				if (this.win && this.win.isVisible()) {
					this.win.hide();
				}
				PopupWindowField.superclass.onDestroy.call(this);
			},
			/**
			 * 设置为可以编辑
			 * 
			 * @param {Boolean}
			 *            value
			 */
			setEditable : function(value) {
				if (value == this.editable) {
					return;
				}
				this.editable = value;
				if (!value) {
					this.el.dom.setAttribute('readOnly', true);
					this.el.on("dblclick", this.onTriggerClick, this);
					this.el.on("click", this.onTriggerClick, this);
					this.el.addClass('x-combo-noedit');
				} else {
					this.el.dom.setAttribute('readOnly', false);
					this.el.un('mousedown', this.onTriggerClick, this);
					this.el.removeClass('x-combo-noedit');
				}
			}
		});
Ext.reg('popupwinfield', PopupWindowField);

/**
 * @class GridSelectWin
 * @extends Ext.Window
 *          弹出一个Window供用户选择grid中的数据，一般和PopupWindowField配合使用，作为PopupWindowField中的win属性。
 *          示例参考PopupWindowField的示例
 */
GridSelectWin = Ext.extend(Ext.Window, {
			/**
			 * @cfg {String} title 窗口的名称，默认为"选择数据"
			 */
			title : "选择数据",
			/**
			 * @cfg {Integer} width 窗口宽度，默认为540
			 */
			width : 540,
			/**
			 * @cfg {Integer} height 窗口高度，默认为400
			 */
			height : 400,
			/**
			 * @cfg {String} layout 窗口布局，默认为fit
			 */
			layout : "fit",
			/**
			 * @cfg {String} buttonAlign 窗口下方按钮的对其方式，默认为center
			 */
			buttonAlign : "center",
			/**
			 * @cfg {String} closeAction 窗口关闭方式，默认为hide
			 */
			closeAction : "hide",
			/**
			 * @cfg {Object} grid 窗口中显示的列表对象。必须是一个Ext.grid.GridPanel或者其继承类实例。<br/>
			 *      必须要的参数
			 */
			grid : null,// grid是必须传递的对象
			/**
			 * @cfg {Booelan} modal 是否开启模式窗口
			 */
			modal : true,
			callback : Ext.emptyFn,
			/**
			 * @event select 当在列表中选择了一行或者多行后的抛出事件
			 * @param {Array}
			 *            datas 选中的record的data数组
			 */
			/**
			 * 当在列表中选择了一行或者多行后的处理事件。<br/>
			 * 默认动作是将选中record的data放在一个数组中，关闭当前窗口，并将数组通过select事件抛出。<br/>
			 */
			choice : function() {
				var grid = this.grid.grid || this.grid;
				var records = grid.getSelectionModel().getSelections();
				if (!records || records.length < 1) {
					Ext.Msg.alert("$!{lang.get('Prompt')}",
							"$!{lang.get('Select first')}");
					return false;
				}
				var datas = [];
				for (var i = 0; i < records.length; i++) {
					datas[i] = records[i].data;
				}
				this.hide();
				this.fireEvent('select', datas, this);
			},
			initComponent : function() {
				this.buttons = [{
							text : "确定",
							handler : this.choice,
							scope : this
						}, {
							text : "取消",
							handler : function() {
								this.hide();
							},
							scope : this
						}];
				GridSelectWin.superclass.initComponent.call(this);
				if (this.grid) {
					var grid = this.grid.grid || this.grid;// 兼容BaseGridList对象
					grid.on("rowdblclick", this.choice, this);
					this.add(this.grid);
				}
				this.addEvents("select");
			}
		});
/**
 * @class Ext.ux.TreeCheckNodeUI
 * @extends Ext.tree.TreeNodeUI
 *
 * 对 Ext.tree.TreeNodeUI 进行checkbox功能的扩展,后台返回的结点信息不用非要包含checked属性
 *
 * 扩展的功能点有：
 * 一、支持只对树的叶子进行选择
 *    只有当返回的树结点属性leaf = true 时，结点才有checkbox可选
 *    使用时，只需在声明树时，加上属性 onlyLeafCheckable: true 既可，默认是false
 *
 * 二、支持对树的单选
 *    只允许选择一个结点
 *    使用时，只需在声明树时，加上属性 checkModel: "single" 既可
 *
 * 二、支持对树的级联多选
 *    当选择结点时，自动选择该结点下的所有子结点，或该结点的所有父结点（根结点除外），特别是支持异步，当子结点还没显示时，会从后台取得子结点，然后将其选中/取消选中
 *    使用时，只需在声明树时，加上属性 checkModel: "cascade" 或"parentCascade"或"childCascade"既可
 *
 * 三、添加"check"事件
 *    该事件会在树结点的checkbox发生改变时触发
 *    使用时，只需给树注册事件,如：
 *    tree.on("check",function(node,checked){...});
 *
 * 默认情况下，checkModel为'multiple'，也就是多选，onlyLeafCheckable为false，所有结点都可选
 *
 * 使用方法：在loader里加上 baseAttrs:{uiProvider:Ext.ux.TreeCheckNodeUI} 既可.
 * 例如：
 *   var tree = new Ext.tree.TreePanel({
 *   el:'tree-ct',
 *   width:568,
 *   height:300,
 *   checkModel: 'cascade',   //对树的级联多选
 *   onlyLeafCheckable: false,//对树所有结点都可选
 *   animate: false,
 *   rootVisible: false,
 *   autoScroll:true,
 *   loader: new Ext.tree.DWRTreeLoader({
 *    dwrCall:Tmplt.getTmpltTree,
 *    baseAttrs: { uiProvider: Ext.ux.TreeCheckNodeUI } //添加 uiProvider 属性
 *   }),
 *   root: new Ext.tree.AsyncTreeNode({ id:'0' })
 * });
 * tree.on("check",function(node,checked){alert(node.text+" = "+checked)}); //注册"check"事件
 * tree.render();
 *
 */

Ext.ux.TreeCheckNodeUI = function() {
	//多选: 'multiple'(默认)
	//单选: 'single'
	//级联多选: 'cascade'(同时选父和子);'parentCascade'(选父);'childCascade'(选子)
	this.checkModel = 'multiple';

	//only leaf can checked
	this.onlyLeafCheckable = false;

	Ext.ux.TreeCheckNodeUI.superclass.constructor.apply(this, arguments);
};

Ext.extend(Ext.ux.TreeCheckNodeUI, Ext.tree.TreeNodeUI, {

	renderElements : function(n, a, targetNode, bulkRender) {
		var tree = n.getOwnerTree();
		this.checkModel = tree.checkModel || this.checkModel;
		this.onlyLeafCheckable = tree.onlyLeafCheckable || false;

		// add some indent caching, this helps performance when rendering a large tree
		this.indentMarkup = n.parentNode
				? n.parentNode.ui.getChildIndent()
				: '';

		//var cb = typeof a.checked == 'boolean';
		var cb = (!this.onlyLeafCheckable || a.leaf);
		var href = a.href ? a.href : Ext.isGecko ? "" : "#";
		var buf = [
				'<li class="x-tree-node"><div ext:tree-node-id="',
				n.id,
				'" class="x-tree-node-el x-tree-node-leaf x-unselectable ',
				a.cls,
				'" unselectable="on">',
				'<span class="x-tree-node-indent">',
				this.indentMarkup,
				"</span>",
				'<img src="',
				this.emptyIcon,
				'" class="x-tree-ec-icon x-tree-elbow" />',
				'<img src="',
				a.icon || this.emptyIcon,
				'" class="x-tree-node-icon',
				(a.icon ? " x-tree-node-inline-icon" : ""),
				(a.iconCls ? " " + a.iconCls : ""),
				'" unselectable="on" />',
				cb
						? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked
								? 'checked="checked" />'
								: '/>'))
						: '',
				'<a hidefocus="on" class="x-tree-node-anchor" href="', href,
				'" tabIndex="1" ',
				a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
				'><span unselectable="on">', n.text, "</span></a></div>",
				'<ul class="x-tree-node-ct" style="display:none;"></ul>',
				"</li>"].join('');

		var nel;
		if (bulkRender !== true && n.nextSibling
				&& (nel = n.nextSibling.ui.getEl())) {
			this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
		} else {
			this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
		}

		this.elNode = this.wrap.childNodes[0];
		this.ctNode = this.wrap.childNodes[1];
		var cs = this.elNode.childNodes;
		this.indentNode = cs[0];
		this.ecNode = cs[1];
		this.iconNode = cs[2];
		var index = 3;
		if (cb) {
			this.checkbox = cs[3];
			Ext.fly(this.checkbox).on('click',
					this.check.createDelegate(this, [null]));
			index++;
		}
		this.anchor = cs[index];
		this.textNode = cs[index].firstChild;
	},

	// private
	check : function(checked) {
		var n = this.node;
		var tree = n.getOwnerTree();
		this.checkModel = tree.checkModel || this.checkModel;

		if (checked === null) {
			checked = this.checkbox.checked;
		} else {
			this.checkbox.checked = checked;
		}

		n.attributes.checked = checked;
		tree.fireEvent('check', n, checked);

		if (this.checkModel == 'single') {
			var checkedNodes = tree.getChecked();
			for (var i = 0; i < checkedNodes.length; i++) {
				var node = checkedNodes[i];
				if (node.id != n.id) {
					node.getUI().checkbox.checked = false;
					node.attributes.checked = false;
					tree.fireEvent('check', node, false);
				}
			}
		} else if (!this.onlyLeafCheckable) {
			if (this.checkModel == 'cascade'
					|| this.checkModel == 'parentCascade') {
				var parentNode = n.parentNode;
				if (parentNode !== null) {
					this.parentCheck(parentNode, checked);
				}
			}
			if (this.checkModel == 'cascade'
					|| this.checkModel == 'childCascade') {
				if (!n.expanded && !n.childrenRendered) {
					n.expand(false, false, this.childCheck);
				} else {
					this.childCheck(n);
				}
			}
		}
	},

	// private
	childCheck : function(node) {
		var a = node.attributes;
		if (!a.leaf) {
			var cs = node.childNodes;
			var csui;
			for (var i = 0; i < cs.length; i++) {
				csui = cs[i].getUI();
				if (csui.checkbox.checked ^ a.checked)
					csui.check(a.checked);
			}
		}
	},

	// private
	parentCheck : function(node, checked) {
		var checkbox = node.getUI().checkbox;
		if (typeof checkbox == 'undefined')
			return;
		if (!(checked ^ checkbox.checked))
			return;
		if (!checked && this.childHasChecked(node))
			return;
		checkbox.checked = checked;
		node.attributes.checked = checked;
		node.getOwnerTree().fireEvent('check', node, checked);

		var parentNode = node.parentNode;
		if (parentNode !== null) {
			this.parentCheck(parentNode, checked);
		}
	},

	// private
	childHasChecked : function(node) {
		var childNodes = node.childNodes;
		if (childNodes || childNodes.length > 0) {
			for (var i = 0; i < childNodes.length; i++) {
				if (childNodes[i].getUI().checkbox.checked)
					return true;
			}
		}
		return false;
	},

	toggleCheck : function(value) {
		var cb = this.checkbox;
		if (cb) {
			var checked = (value === undefined ? !cb.checked : value);
			this.check(checked);
		}
	}
});
//下拉分页插件
PagingComBo = Ext.extend(Ext.PagingToolbar, {
	displayMsg : "第{0}-{1}条&nbsp;&nbsp;共{2}条&nbsp;&nbsp;&nbsp;&nbsp;共{3}页",
	style : 'font-weight:900',
	rowComboSelect : true,
	displayInfo : true,
	doLoad : function(start) {
		var o = {}, pn = this.getParams() || {};
		o[pn.start] = start;
		o[pn.limit] = this.pageSize;
		if (this.store.baseParams && this.store.baseParams[pn.limit])
			this.store.baseParams[pn.limit] = this.pageSize;
		if (this.fireEvent('beforechange', this, o) !== false) {
			this.store.load({
						params : o
					});
		}
	},
	onPagingSelect : function(combo, record, index) {
		var d = this.getPageData(), pageNum;
		pageNum = this.readPage(d);
		if (pageNum !== false) {
			pageNum = Math.min(Math.max(1, record.data.pageIndex), d.pages) - 1;
			this.doLoad(pageNum * this.pageSize);
		}
	},
	readPage : Ext.emptyFn,
	onLoad : function(store, r, o) {
		var d = this.getPageData(), ap = d.activePage, ps = d.pages;
		this.combo.store.removeAll();
		if (ps == 0) {
			this.combo.store.add(new Ext.data.Record({
						pageIndex : 1
					}));
			this.combo.setValue(1);
		} else {
			for (var i = 0; i < ps; i++) {
				this.combo.store.add(new Ext.data.Record({
							pageIndex : i + 1
						}));
			}
			this.combo.setValue(ap);
		}
		if (this.rowComboSelect)
			this.rowcombo.setValue(this.pageSize);
		PagingComBo.superclass.onLoad.apply(this, arguments);
	},
	updateInfo : function() {
		if (this.displayItem) {
			var count = this.store.getCount();
			var activePage = this.getPageData().activePage;
			var msg = count == 0 ? this.emptyMsg : String.format(
					this.displayMsg, this.cursor + 1, this.cursor + count,
					this.store.getTotalCount(), Math.ceil(this.store
							.getTotalCount()
							/ this.pageSize), activePage);
			this.displayItem.setText(msg);
		}
	},
	// 选择每页多少条数据
	onComboPageSize : function(combo, record, index) {
		var pageSize = record.get('pageSize');
		this.store.pageSize = this.pageSize = pageSize;
		var d = this.getPageData(), pageNum;
		pageNum = this.readPage(d);
		if (pageNum !== false) {
			pageNum = Math.min(Math.max(1, record.data.pageIndex), d.pages) - 1;
			this.doLoad(0);
		}
	},
	initComponent : function() {
		if (Ext.getObjVal(this.store, 'pageSize')) {
			this.pageSize = Ext.getObjVal(this.store, 'pageSize');
		}
		this.combo = Ext.ComponentMgr.create(Ext.applyIf(this.combo || {}, {
					value : 1,
					width : 50,
					store : new Ext.data.SimpleStore({
								fields : ['pageIndex'],
								data : [[1]]
							}),
					mode : 'local',
					xtype : 'combo',
					minListWidth : 50,
					allowBlank : false,
					triggerAction : 'all',
					displayField : 'pageIndex',
					allowDecimals : false,
					allowNegative : false,
					enableKeyEvents : true,
					selectOnFocus : true,
					submitValue : false
				}));
		this.combo.on("select", this.onPagingSelect, this);
		this.combo.on('specialkey', function() {
					this.combo.setValue(this.combo.getValue());
				}, this);

		var T = Ext.Toolbar;

		var pagingItems = [];

		if (this.displayInfo) {
			pagingItems.push(this.displayItem = new T.TextItem({}));
		}

		if (this.rowComboSelect) {
			var data = this.rowComboData ? this.rowComboData : [[10], [20],
					[30], [50], [80], [100], [150], [200]];
			this.rowcombo = this.rowcombo || Ext.create({
						store : new Ext.data.SimpleStore({
									fields : ['pageSize'],
									data : data
								}),
						value : this.pageSize,
						width : 50,
						mode : 'local',
						xtype : 'combo',
						allowBlank : false,
						minListWidth : 50,
						displayField : 'pageSize',
						triggerAction : 'all'
					});
			pagingItems.push(this.rowcombo, "条/页&nbsp;&nbsp;");

			this.rowcombo.on("select", this.onComboPageSize, this);
			this.rowcombo.on('specialkey', function() {
						this.combo.setValue(this.combo.getValue());
					}, this);
		}

		// this.totalPage = new T.TextItem({})
		pagingItems.push('->', this.first = new T.Button({
							tooltip : this.firstText,
							overflowText : this.firstText,
							iconCls : 'x-tbar-page-first',
							disabled : true,
							handler : this.moveFirst,
							scope : this
						}), this.prev = new T.Button({
							tooltip : this.prevText,
							overflowText : this.prevText,
							iconCls : 'x-tbar-page-prev',
							disabled : true,
							handler : this.movePrevious,
							scope : this
						}), '-', this.beforePageText,
				this.inputItem = this.combo,
				this.afterTextItem = new T.TextItem({
							text : String.format(this.afterPageText, 1)
						}), '-', this.next = new T.Button({
							tooltip : this.nextText,
							overflowText : this.nextText,
							iconCls : 'x-tbar-page-next',
							disabled : true,
							handler : this.moveNext,
							scope : this
						}), this.last = new T.Button({
							tooltip : this.lastText,
							overflowText : this.lastText,
							iconCls : 'x-tbar-page-last',
							disabled : true,
							handler : this.moveLast,
							scope : this
						}), '-', this.refresh = new T.Button({
							tooltip : this.refreshText,
							overflowText : this.refreshText,
							iconCls : 'x-tbar-loading',
							handler : this.doRefresh,
							scope : this
						}));

		var userItems = this.items || this.buttons || [];
		if (this.prependButtons===true) {
			this.items = userItems.concat(pagingItems);
		}else if(Ext.isNumber(this.prependButtons)){
			pagingItems.splice.apply(pagingItems,[this.prependButtons,0].concat(userItems));
			this.items = pagingItems;
		}else{
			this.items = pagingItems.concat(userItems);
		}
		delete this.buttons;
		Ext.PagingToolbar.superclass.initComponent.call(this);
		this.addEvents('change', 'beforechange');
		this.on('afterlayout', this.onFirstLayout, this, {
					single : true
				});
		this.cursor = 0;
		this.bindStore(this.store, true);
	}
});
Ext.ux.PagingComBo = PagingComBo;
Ext.reg("pagingComBo", Ext.ux.PagingComBo);