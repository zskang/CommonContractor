/**
 * 
 * @class Ext.tree.CheckboxTree
 * 
 * 含有checkbox的树状菜单
 * 
 * @param {Object}
 *            config中的参数
 * 
 * el 必输入
 * 
 * dataUrl 必输入
 * 
 * rootText 必输入
 * 
 * rootId 默认值为0
 * 
 */

Ext.tree.CheckboxTree = function(config) {
	var myTreeLoader = new Ext.tree.TreeLoader({
				dataUrl : config.dataUrl

			});
	myTreeLoader.on("beforeload", function(treeLoader, node) {

				treeLoader.baseParams.check = node.attributes.checked;
				treeLoader.baseParams.nodeid = node.id;
				treeLoader.baseParams.ischecked = true;

			}, this);
	Ext.tree.CheckboxTree.superclass.constructor.call(this, {
				animate : false,
				enableDD : false,
				autoScroll : true,
				useArrows : true,
				containerScroll : true,
				border : false,
				draggable : false,
				dropConfig : {
					appendOnly : true
				},
				root : new Ext.tree.AsyncTreeNode({
							text : config.rootText,
							draggable : false,
							checked : config.checked,
							id : 'root' || config.rootId
						}),
				loader : myTreeLoader
			});
	var childbool = true;
	new Ext.tree.TreeSorter(this, {
				folderSort : true
			});
	this.on({
				'checkchange' : function(node, checked) {
					var parentNode = node.parentNode;
					if (checked) {
						/**
						 * 
						 * 节点为真时，此节点的子节点,判断此节点的父节点时，判断父节点的子节点是否全部为
						 * 
						 * 真，如果全部为真，则此父节点为真，如果不为真则不变 全部为真
						 * 
						 */
						if (childbool) {
							var childNodes = node.childNodes;
							for (var i = 0; i < childNodes.length; i++) {
								var childNode = childNodes[i];
								if (!childNode.attributes.checked) {
									childNode.ui.toggleCheck();
								}
							}
						}

						/**
						 * 
						 * 此如果此节点又父节点，则判断此父节点的子节点是否全为真 如果全为真则此父节点也为真
						 * 
						 */

						if (parentNode && !parentNode.attributes.checked) {
							childbool = false;
							parentNode.ui.toggleCheck();
						} else
							childbool = true;
					} else {
						/**
						 * 
						 * 如果为false时，
						 * 
						 */

						// if(parentNode&&parentNode.attributes.checked){
						// parentNode.attributes.checked=false;
						// parentNode.ui.toggleCheck();
						// }
						/*
						 * 
						 * 父节点
						 * 
						 */
						ParentState(parentNode);

						/*
						 * 
						 * 子接点
						 * 
						 */
						var childNodes = node.childNodes;
						for (var i = 0; i < childNodes.length; i++) {
							var childNode = childNodes[i];
							if (childNode.attributes.checked) {
								childNode.ui.toggleCheck();
							}
						}
					}
				}

			});

}
function ParentState(parentNode) {
	var brothNodes = null;
	if (parentNode != null) // 兄弟节点
		brothNodes = parentNode.childNodes;
	else
		return false;
	var brothflag = 0;
	for (var i = 0; i < brothNodes.length; i++) {
		var brothNode = brothNodes[i];
		if (brothNode.attributes.checked) {
			break;
		} else
			brothflag++;
	}
	if (brothflag == brothNodes.length) { // 说明兄弟节点没选种的
		if (parentNode.attributes.checked)
			parentNode.ui.toggleCheck();
		ParentState(parentNode.parentNode);
	}
}

CheckboxTree=Ext.extend(Ext.tree.CheckboxTree, Ext.tree.TreePanel, {
			/**
			 * 
			 * 展开根节点
			 * 
			 * @return 返回根节点
			 * 
			 */
			expandRoot : function() {
				this.root.expand(true, false); // 第一个参数表示是否递归展开，第二个属性表示展开是是否有动画效果
				return this.root;
			}
		});
Ext.reg('CheckboxTree', CheckboxTree);