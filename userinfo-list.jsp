<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/common/taglibs.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<title><fmt:message key="common.title" /></title>
	</head>
	<body>
	<a href="${ctx}/sample/userinfo!input.action">添加</a>
		<div id="content">
			<table id="contentTable">
				<tr>
					<th>
						<a href="javascript:sort('loginName','asc')">登录名</a>
					</th>
					<th>
						<a href="javascript:sort('username','asc')">姓名</a>
					</th>
					<th>
						<a href="javascript:sort('password','asc')">密码</a>
					</th>
					<th>
						操作
					</th>
				</tr>

				<s:iterator value="#request.list" id="userinfo">
					<tr>
						<td>
							<s:property value="#userinfo.userid" />
						</td>
						<td>
							<s:property value="#userinfo.username" />
						</td>
						<td>
							<s:property value="#userinfo.password" />
						</td>
						<td>
							&nbsp;
							<a href="userinfo!view.action?id=${id}">查看</a>&nbsp;
							<a href="userinfo!input.action?id=${id}">修改</a>&nbsp;
							<a href="userinfo!delete.action?id=${id}">删除</a>
						</td>
					</tr>
				</s:iterator>
			</table>
		</div>

	</body>
</html>