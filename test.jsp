<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<title></title>
		<%@ include file="/common/header.jsp"%>
		<link href="${ctx }/css/header.css" rel="stylesheet" type="text/css" />

		<script type="text/javascript" src="${ctx}/js/test.js"></script>
		<script type="text/javascript">
Ext.onReady(function() {
	tree = new Ext.tree.TreePanel({
		width : 180,
		applyTo : 'tree-div',
		autoScroll : true,
		margins : '0 2 0 0',
		root : new Ext.tree.AsyncTreeNode({
					text : "所有组织",
					id:'root',
					iconCls : 'treeroot-icon',
					expanded : true,
					loader : new Ext.tree.TreeLoader({
								dataUrl : contextPath
										+ '/authority/orgrel!getorgusertree.action?orgtype=1&regionid=340100'

							})
				})
	});

});
</script>
	</head>
	<body>
		<div id="tree-div">
		</div>
		<div id="tree-div1">
		</div>
	</body>
</html>
