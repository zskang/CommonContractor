<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/common/header.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link href="${ctx }/css/header.css" rel="stylesheet" type="text/css" />
		<title>top</title>
		<style type="text/css">
<!--
body {
	margin: 0px auto;
}

.top {
	width: 100%;
	height: 85px;
	background-image: url(css/image/top_bg.jpg);
}

.top_left {
	background-image: url(css/image/top_mc.jpg);
	width: 500px;
	height: 85px;
	float: left;
}

.top_sys_name {
	width: 85%;
	height: 85px;
	line-height: 85px;
	float: right;
	color: #FFFFFF;
	font-weight: bold;
	font-size: 24px;
	font-family: "黑体";
}

.top_right_bgimg {
	background-image: url(css/image/top_bg.jpg);
	height: 85px;
	width: 320px;
	float: right;
	position: absolute;
	right: 0px;
	top: 0px;
}

-->
.icon {
	position: absolute;
	top: 100px;
	color: #FFFFFF;
}

.icon1 {
	width: 445px;
	position: absolute;
	right: 10px;
	top: 52px;
	color: #FFFFFF;
}

.icon1 ul {
	margin: auto;
	list-style: none;
}

.icon1 ul li {
	float: left;
	padding-left: 10px;
	line-height: 16px;
	display: inline;
	margin-top: 10px;
	position: relative;
}

.icon1 a {
	font-size: 12px;
	color: #FFFFFF;
	text-decoration: none;
}

.icon1 span {
	font-size: 12px;
	color: #FFFFFF;
	text-decoration: none;
}
</style>
		<script type="text/javascript">
  function checkOut(){
    window.parent.location = contextPath + "/login!checkout.action"
  }
</script>
	</head>


	<body>
		<div class="top">
			<div class="top_left">
				<div class="top_sys_name">
					<fmt:message key="common.systemname" />
				</div>
			</div>
			<div class="top_right_bgimg"></div>

			<div class="icon1">
				<ul>

					<li title="当前登录人">
						<img src="css/image/man.gif" />
					</li>
					<li title="当前登录人">
						<span>欢迎：<s:property
								value="#request.username" /> 第<s:property
								value="#request.logintimes" />次登陆</span>
					</li>
					<li>
						<img src="css/image/bz.png" />
					</li>
					<li>
						<a href="#">帮助</a>
					</li>
					<li>
						<img src="css/image/Change_Password.gif" />
					</li>
					<li>
						<a href="#">修改密码 </a>
					</li>
					<li>
						<img src="css/image/exit.gif" />
					</li>
					<li>
						<a href="javascript:checkOut()">登出</a>
					</li>
				</ul>
			</div>
		</div>


	</body>
</html>
