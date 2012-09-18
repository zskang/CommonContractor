<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
	<%@ include file="/common/taglibs.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>添加用户信息</title>
	</head>
	<body>
		<form name="form1" method="post"
			action="/MB/sample/userinfo!save.action">
			<table width="421" border="0" align="center" cellpadding="1"
				cellspacing="1" bgcolor="#00CC99">
				<tr bgcolor="#FFFFFF">
					<td height="26" colspan="2">
						添加 / 修改 用户信息
						<input type="hidden" name="id" value="${id}">

					</td>

				</tr>
				<tr bgcolor="#FFFFFF">
					<td width="104" height="26" align="right">
						用户名：
					</td>
					<td width="310" height="26">
						<input name="userid" type="text" id="userid" value="${userid }">
					</td>
				</tr>
				<tr bgcolor="#FFFFFF">
					<td height="26" align="right">
						用户姓名：
					</td>
					<td height="26">
						<input name="username" type="text" id="username"
							value="${username }">
					</td>
				</tr>
				<tr bgcolor="#FFFFFF">
					<td height="26" align="right">
						密码：
					</td>
					<td height="26">
						<input name="password" type="text" id="password"
							value="${password }">
					</td>
				</tr>
				<tr bgcolor="#FFFFFF">
					<td height="26" align="right">
						电子邮件：
					</td>
					<td height="26">
						<input name="email" type="text" id="email" value="${email }">
					</td>
				</tr>
				<tr bgcolor="#FFFFFF">
					<td height="26" align="right">
						电话号码
					</td>
					<td height="26">
						<input name="phone" type="text" id="phone" value="${phone }">
					</td>
				</tr>
				<tr align="center" bgcolor="#FFFFFF">
					<td height="26" colspan="2">
						<input type="submit" name="Submit" value="提交">
						<input type="reset" name="Submit" value="重置">
					</td>
				</tr>
			</table>
		</form>
	</body>
</html>