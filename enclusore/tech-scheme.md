> 平安蜀黍的 react 实战课程 > 第一部分 > 技术方案

#### 订单模块技术方案

对于电商系统来说，下订单的服务是相当重要的。下订单服务的好与坏甚至影响到用户的体验，以及后续是否再次购买等行为。近期对于我们系统的下订单业务进行梳理，总结如下。

##### 一般的下单流程
- 用户挑选相应的商品放入购物车；
- 点击购买，进入订单详情页（这一页也可以通过购物车页，点选商品之后进入）；
- 点击下单，生成相应的订单；
- 点击支付进入支付环节；

我们主要分析第3步：

- 前端请求提交了相应的订单详情页数据进来；
- 后台服务接收请求

在各情况下所使用技术策略不会是一成不变的，而是为了应对各种场景而采用了不同的实现方案，下面我们就来分析两种场景。一种场景是普通的下单；另一种场景是秒杀。

##### 普通的下单：

前端请求提交了订单详情页的数据至订单提交服务，后台服务接收请求，后台服务的一般处理步骤：

- 校验数据的正确性、合法性，这涉及几个方面：库存、商品价格检查、使用促销规则、商品售卖区域校验等；
- 数据模型的转化，将商品模型转化为订单模型，主要包括订单、订单详情两部分;
- 订单额度计算；
- 订单数据的写入数据库；
- 订单写入成功消息投递；
- 返回前端调用；

在这6步中，其中只有第4步是需要直接操作数据库（一般情况下都是mysql数据库）的。为什么这么说呢？原因是其他几步要么是内存计算，要么需要的数据是可以进行缓存的。比如库存，它是可以通过缓存系统进行缓存，由于出现缓存数据与db不一致，才会出现部分电商公司说在什么什么情况下，他们的商品超卖了等情况。

那么在高并发的场景下，对于普通的下单方案是不可行的。原因是数据的写入会出现瓶颈。为了解决这个问题，需要引入另外的方案，即秒杀的订单方案。

##### 秒杀下单流程
刚才我们分析了普通的下单流程，只要能够解决其在高并发的场景下的写入瓶颈，就可以应对秒杀场景（这里暂且不讨论服务的降级）。对于秒杀下单它的流程与普通下单一样，只需要解决第4步的写入性能瓶颈即可。对于高并发，它的解决思路是分而治之。对于这个分而治之的解决方案有千万种，这里只介绍一种，即使用消息队列来抗高并发的写入，即经常说的使用“消息队列削峰”。简单来说，就是在第4步订单不直接写入数据库，而是写入消息队列。而后通过消息队列的客户端拉取订单再慢慢写入数据库，从而解决数据库的写入瓶颈。在我们的业务系统中，可以使用redis作为这个消算队列，进行订单的写入，订单数据写入消息队列步骤如下：

- 调用订单id生成服务，生成唯一id，存入订单模型;
- 调用订单详情id生成服务，生成唯一id，存入订单详情;
- 订单及订单详情序列化写入redis订单kv结构中，k为订单id;v为订单数据；
- 用户与订单id的关系反表写入redis kv结构,k为用户id；v为订单id;为了解决用户的订单列表查询无法查到最新订单的问题；
- 订单id写入redis列表，即消息队列；用于消息的发送；
- 写入完成；

使用id生成器，为了解决订单的唯一性与分库等操作，另外还有后续的操作api是依赖该订单的id属性，对于id生成器的解决方案也有n多种，具体可能看订单id生成服务。

对于在后台运行的消息队列客户端，它的主要业务逻辑：

- 拉取队列；
- 通过键值查询获取订单详细信息；
- 写入订单数据到数据库；
- 删除redis中订单键值；
- 删除redis中用户与订单键值；
- 循环第一步。