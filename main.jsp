<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %> 

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<title></title>
		<%@ include file="/common/header.jsp"%>
		<link href="${ctx }/css/header.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="${ctx}/js/pages/main.js"></script>


	</head>
	<body>
		<form id="form1" runat="server">
			<iframe id="frmContent" name="frmContent" src="" frameborder="0" height="100%" width="100%">
            </iframe>
		</form>
	</body>
</html>
