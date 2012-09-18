<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/header.jsp"%>
<html>
	<head>
		<style type="text/css">
<!--
body {
	margin: 0px auto;
	font: Arial, Helvetica, sans-serif;
	font-size: 12px;
	background-color:#CCCCCC
}
</style>
	</head>
	<body>
		<jsp:useBean id="now" class="java.util.Date" />
		<div id="top" align="right">
			<fmt:message key="common.copyright" />
			<fmt:formatDate value="${now}" pattern="yyyy" />
			<a href="#"><fmt:message key="common.company" /> </a> 版权所有
		</div>

	</body>
</html>

