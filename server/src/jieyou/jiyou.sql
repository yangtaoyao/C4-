create table user(uid varchar (20) primary key not null,
pwd varchar(20) not null,
nickname varchar(20) not null,
imgurl varchar(50),
status varchar(3) default "off" check (status in ("on","off") ),
credit int unsigned default 0,
balance int unsigned default 0,
birthday varchar(20) default NULL,
tel varchar(11) default NULL,
crttime datetime not null);

create table task(uid varchar (20) not null,
tid varchar (20) not null,
state int unsigned check (state in (0,1,2)),
label varchar(8) not null,
content text,
imgurl varchar(50),
price int unsigned default 0,
crttime datetime not null ,
expiretime datetime not null,
finisher varchar(20),
countaccess int unsigned default 0,
primary key(tid),
foreign key (uid) references user(uid) on delete cascade );

create table msg(uid varchar (20) not null,
mid varchar (20) not null ,
fmid varchar (20) not null,
floor int unsigned default 0,
content text,
imgurl varchar(50),
crttime datetime not null ,
love int unsigned default 0,
primary key(mid),
foreign key (uid) references user(uid) on delete cascade);

create table tu(uid varchar (20) not null,
tid varchar(20) not null,
status int unsigned check (status in (0,1,2)), 
primary key(uid,tid),
foreign key (uid) references user(uid) on delete cascade,
foreign key (tid) references task(tid) on delete cascade
) engine=innodb default charset=utf8 ;

create table love(uid varchar (20) not null,
mid varchar(20) not null,
primary key(uid,mid),
foreign key (uid) references user(uid) on delete cascade,
foreign key (mid) references msg(mid) on delete cascade
) engine=innodb default charset=utf8 ;

create table creditHistory(
uid varchar (20) not null,
oid varchar (20) not null,
used int,
descript text,
crttime datetime not null,
primary key(uid,oid),
foreign key (uid) references user(uid) on delete cascade);
