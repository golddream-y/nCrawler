# nCrawler
Crawler for taobao mirror.

### 背景

在局域网（出口有代理）搭建自己的npm仓储（sinopia/cnpm/nexus-npm）后，安装一些包的时候需要绕过代理获取node-sass等资源（这些资源不走npm代理），所以需要本地同步这些镜像。

taobao镜像地址：https://npm.taobao.org/mirrors



### 概述

#### 引用的轮子

- [request](https://github.com/request/request)   

- [cheerio](https://github.com/cheeriojs/cheerio)  

#### 为什么不用现有的爬虫产品？

感觉需求比较简单，学习现有爬虫如何使用的成本比直接自己写一个还要高。并且出于学习(wan)目的，想多造点轮(wan)子(ju)。



### 计划

#### 第一步

前期打算无图形化操作，只需要能将node-sass的指定版本镜像同步到本地即可。

#### 第二步

考虑增加文件下载进度。增加文件已存在的md5校验机制，文件没问题则不重复覆盖。增加下载失败机制，将下载失败的文件放入缓存，下次同步先加载失败列表，同步加载失败的文件。

#### 第三步

增加图形化界面，将代码嵌入express框架，前端考虑vue。增加图形化界面下的镜像地址配置、node-sass的下载版本选择、代理配置等功能。

同时需要增加本地文件查询，查询已经存在的文件列表、存储情况的分析等。

#### 第四步

增加其他镜像的同步支持，考虑dom分析的关键字（下载的规则）可通过界面配置。
