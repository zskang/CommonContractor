<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/common/header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title><fmt:message key="common.title" /></title>

		<link href="${ctx }/css/login_style.css" rel="stylesheet"
			type="text/css" />
		<script type="text/javascript">
		
		//获取对象
		function $(id){
		  return document.getElementById(id);
		}
		
		//刷新图片
		function refreshCaptcha() {
			$('captchaImg').src="${ctx}/jcaptcha.jpg?" + Math.random();
		}
		
		//验证登陆信息
		function validateForm(){
		   var userid = $("userid").value;
		   var passwd = $("password").value;
		   if(userid==""){
		      alert("用户ID不能为空！");
		      $("userid").focus();
		      return false;
		   }else if(passwd==""){
		      alert("密码不能为空！");
		      $("password").focus();
		      return false;
		   }else if($("j_captcha")!=null){
		     if($("j_captcha").value==""){
		       alert("验证码不能为空！");
		      $("j_captcha").focus();
		      return false;
		     }
		   }
		   return true;
		}
		
	
	</script>
	</head>
	<body>
		<div class="login_Frame">
			<div class="content">
				<form
					action="${ctx }/login!loginvalidate.action?rnd=<%=Math.random()%>"
					method="post" id="form1" onsubmit="return validateForm()">
					<div class="sys_name">
						<fmt:message key="common.systemname" />
					</div>
					<ul class="cont">
						<li>
							<label class="lb" for="uname">
								用户名
							</label>
							<input name="userid" id="userid" type="text" class="ip" value=""
								maxlength="20 " />
						</li>
						<li>
							<label class="lb" for="pwd">
								密码
							</label>
							<input name="password" id="password" type="password" class="ip"
								value="" maxlength="20" />
							<input id="iscode" name="iscode" type="hidden"
								value="<s:property
									value="#request.iscode" />" />
							<span style="color: #FF0000"><s:property
									value="#request.error" /> </span>
						</li>
						<s:if test="#request.iscode==1"></s:if>
						<!--  
						<li>
							<label class="lb" for="pwd">
								验证码
							</label>
							<input type="text" name="j_captcha" id="j_captcha" value=""
								class="input_yzm" />
							<a href="javascript:refreshCaptcha()" title="看不清，换一张"> <img
									id="captchaImg" src="jcaptcha.jpg" height="25" width="80" /> </a>
						</li>
                        -->
						<li>
							<span> <input type="image"
									src="${ctx }/css/image/ente.png" title="登录" /> </span>
						</li>
					</ul>
				</form>
				<jsp:useBean id="now" class="java.util.Date" />

				<div class="Copyright_Information">
					<fmt:message key="common.copyright" />
					<fmt:formatDate value="${now}" pattern="yyyy" />
					<a href="#"><fmt:message key="common.company" /> </a> 版权所有
					<fmt:message key="common.support" />
				</div>
			</div>
		</div>
	</body>
</html>
