
--- 修改构组织表结构   wnagjie 2011-11-09
alter table BASE_ORGANIZE add linkmantel VARCHAR2(36);
alter table BASE_ORGANIZE add regionid VARCHAR2(36);

--- 字典表添加组织类型  wnagjie 2011-11-09
insert into BASE_SYSDICTIONARY (CODEVALUE, LABLE, RESTYPE, COLUMNTYPE, SHOWVALUE, SORTNUM, REMARK, STATUS, ID)
values ('1', '移动', null, 'orgtype', null, null, '组织类型', null, 'EF1A9EEC-C96E-74B8-0001-3F67488AF0B9');
insert into BASE_SYSDICTIONARY (CODEVALUE, LABLE, RESTYPE, COLUMNTYPE, SHOWVALUE, SORTNUM, REMARK, STATUS, ID)
values ('2', '代维', null, 'orgtype', null, null, '组织类型', null, 'EF1A9EEC-C96E-74B8-0002-3F67488AF0B9');
insert into BASE_SYSDICTIONARY (CODEVALUE, LABLE, RESTYPE, COLUMNTYPE, SHOWVALUE, SORTNUM, REMARK, STATUS, ID)
values ('3', '租赁公司', null, 'orgtype', null, null, '组织类型', null, 'EF1A9EEC-C96E-74B8-0003-3F67488AF0B9');
insert into BASE_SYSDICTIONARY (CODEVALUE, LABLE, RESTYPE, COLUMNTYPE, SHOWVALUE, SORTNUM, REMARK, STATUS, ID)
values ('4', '监理单位', null, 'orgtype', null, null, '组织类型', null, 'EF1A9EEC-C96E-74B8-0004-3F67488AF0B9');


--- 增加获取区域名称函数  wnagjie 2011-11-09  
CREATE OR REPLACE FUNCTION FN_GETREGIONNAME(n_regionid varchar2)
   RETURN varchar
IS
   displayName              varchar2(200);
BEGIN
   select decode(bs.REGIONNAME,null,'',bs.REGIONNAME) into displayName from view_region bs where bs.REGIONID = n_regionid ;
   RETURN (displayName);
END FN_GETREGIONNAME;



--- 修改获取字典名称的函数 wnagjie 2011-11-09
CREATE OR REPLACE FUNCTION FN_GETNAMEBYCODE(n_code varchar2,n_columntype varchar2)
   RETURN varchar
IS
   displayName              varchar2(200);
BEGIN
   select decode(bs.lable,null,'',bs.lable) into displayName from view_sysdictionary bs where bs.codevalue = n_code and bs.columntype = 

n_columntype ;
   RETURN (displayName);
END FN_GETNAMEBYCODE;



--更新组织机构  zhaobi 2011-11-09
update BASE_ORGANIZE o set o.regionid=(select ro.regionid from base_orgregion ro where ro.orgid=o.id )