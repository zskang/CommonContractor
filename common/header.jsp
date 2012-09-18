<%@ page language="java" pageEncoding="UTF-8"
	contentType="text/html; charset=UTF-8"%>

<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<fmt:setLocale value="${header['accept-language']}" />
<fmt:setBundle basename="i18n.messageResource" />
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<%
	String msg = (String) request.getAttribute("msg");
	String userid = (String) request.getAttribute("userid");
	String userorg = (String) request.getAttribute("userorg");
	String userregion = (String) request.getAttribute("userregion");
%>
<link rel="stylesheet" type="text/css"
	href="${ctx}/js/ext/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css"
	href="${ctx}/js/ext/resources/css/xtheme-yourtheme.css" />
<link rel="stylesheet" type="text/css" href="${ctx}/css/icon.css" />
<script type="text/javascript"
	src="${ctx}/js/ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ext-all.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux-all-debug.js"></script>
<link rel="stylesheet" type="text/css"
	href="${ctx}/js/ext/ux/SuperBoxSelect/superboxselect.css" />
<script type="text/javascript" src="${ctx}/js/ext/Global.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/core-all-debug.js"></script>
<script type="text/javascript"
	src="${ctx}/js/ext/ux/SuperBoxSelect/SuperBoxSelect.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/Appcombox.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/TabCloseMenu.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/CheckColumn.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/CRUDEditGrid.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/EditGrid.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/JsonGrid.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/comboGrid.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/comboxTree.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/CheckboxTree.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/selectTree.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/CrudPanel.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/Spinner.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/miframe.js"></script>
<script type="text/javascript" src="${ctx}/js/ext/ux/SpinnerField.js"></script>
<script type="text/javascript"
	src="${ctx}/js/ext/ux/ProgressBarPager.js"></script>
<script language="JavaScript" type="text/JavaScript">
           	Ext.BLANK_IMAGE_URL = "${ctx}/js/ext/resources/images/vista/s.gif";
			var contextPath = "${ctx}";
			var menuJSON = "<%=msg%>";
			var userid="<%=userid%>";
			var userorg = "<%=userorg%>";
			var userregion = "<%=userregion%>";
	</script>

