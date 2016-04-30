angular.module("myApp",["ui.router","angular-md5","directives","services","filters","RecommendModule","TopicModule","MediaModule","AccountModule","ArticleModule"]).run(["$rootScope","$state","$stateParams",function(t,e,l){t.$state=e,t.$stateParams=l,t.$on("$stateChangeSuccess",function(e,l,r,o,a){t.$previousState={from:o,fromParams:a,to:l,toParams:r}})}]).config(["$httpProvider",function(t){t.defaults.headers.post={"Content-Type":"application/x-www-form-urlencoded"},t.defaults.transformRequest=function(t){var e=[];for(var l in t)e.push(encodeURIComponent(l)+"="+encodeURIComponent(t[l]));return e.join("&")}}]).config(["$stateProvider","$urlRouterProvider",function(t,e){e.otherwise("/tab/recommend"),t.state("tab",{url:"/tab",templateUrl:"dist/tpl/tab.html"}).state("tab.recommend",{url:"/recommend",templateUrl:"dist/tpl/recommend.html",controller:"RecommendCtrl"}).state("tab.topic",{url:"/topic",templateUrl:"dist/tpl/topic.html",controller:"TopicCtrl"}).state("tab.media",{url:"/media",templateUrl:"dist/tpl/media.html",controller:"MediaCtrl"}).state("tab.me",{url:"/me",templateUrl:"dist/tpl/me.html"}).state("tab.me.account",{url:"/account",templateUrl:"dist/tpl/account.html",controller:"AccountCtrl"}).state("tab.me.login",{url:"/login",templateUrl:"dist/tpl/login.html",controller:"LoginCtrl"}).state("tab.me.register",{url:"/register",templateUrl:"dist/tpl/register.html",controller:"RegisterCtrl"}).state("topicDetail",{url:"/topic/:topicId",templateUrl:"dist/tpl/topicDetail.html",controller:"TopicDetailCtrl"}).state("mediaDetail",{url:"/media/:mediaId",templateUrl:"dist/tpl/mediaDetail.html",controller:"MediaDetailCtrl"}).state("article",{url:"/article/:articleId",templateUrl:"dist/tpl/article.html",controller:"ArticleCtrl"})}]).controller("AppCtrl",["$scope",function(t){var e=(new Date).getHours();t.mode={},e>7&&23>e?(t.mode.day=!0,t.mode.name="日间"):(t.mode.day=!1,t.mode.name="夜间"),t.tab={hide:!1},t.loadingPage={showLoading:!1}}]);
angular.module("RecommendModule",[]).controller("RecommendCtrl",["$scope","httpService",function(e,t){e.loadingPage.showLoading=!0,e.hasGetData=!1;var o=1;e.getList=function(){return 0==o?!1:void t.getData("/article/get_recommend",{page:o}).then(function(t){if(e.hasGetData=!0,1==o)e.bannerList=t.banner,e.recommendList=t.recommend,e.loadingPage.showLoading=!1,o++;else{for(var a=0;a<t.recommend.length;a++)e.recommendList.push(t.recommend[a]);o++,e.recommendList.length>=t.recommendCount&&(o=0)}})},e.getList(),e.slideIndex=0,e.renderFinish=function(){setTimeout(function(){new Swipe($(".recommend #slide")[0],{startSlide:0,speed:400,auto:3e3,continuous:!0,disableScroll:!1,stopPropagation:!1,callback:function(t,o){e.slideIndex=t>2?t%3:t,e.$digest()},transitionEnd:function(e,t){}})},0)}}]),angular.module("TopicModule",["ngSanitize"]).controller("TopicCtrl",["$scope","httpService",function(e,t){e.loadingPage.showLoading=!0,t.getData("/topic/get_topic").then(function(t){e.topicList=t,e.loadingPage.showLoading=!1}),e.myKeyup=function(t){13==t.keyCode&&e.search(e.searchText)};var o=0;e.search=function(a){if(o){var n=+new Date-o;if(1e3>n)return!1;o=+new Date}t.getData("/article/search",{query:a}).then(function(t){e.searchResult=t,e.showResult=!0,$(".search > input").blur()}),o=+new Date},e.hideResult=function(){e.showResult=!1,e.searchText=""}}]).controller("TopicDetailCtrl",["$scope","$state","httpService",function(e,t,o){e.loadingPage.showLoading=!0,o.getData("/topic/get_one_topic",{id:t.params.topicId}).then(function(t){e.topicInfo=t,e.loadingPage.showLoading=!1}),e.setEllipsis=function(){setTimeout(function(){$(".topic-article .summary").each(function(e){for(var t=$(this).height(),o=$("p",$(this)).eq(0);o.outerHeight()>t;)o.text(o.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/,"..."))})})}}]),angular.module("MediaModule",[]).controller("MediaCtrl",["$scope","httpService",function(e,t){e.loadingPage.showLoading=!0,t.getData("/media/get_media").then(function(t){e.mediaList=t,e.loadingPage.showLoading=!1}),e.setEllipsis=function(){setTimeout(function(){$(".media .intro").each(function(e){for(var t=$(this).height(),o=$("p",$(this)).eq(0);o.outerHeight()>t;)o.text(o.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/,"..."))})})}}]).controller("MediaDetailCtrl",["$scope","$state","httpService",function(e,t,o){e.isfocus=!1,e.loadingPage.showLoading=!0,o.getData("/media/get_one_media",{id:t.params.mediaId}).then(function(t){e.mediaInfo=t,e.isfocus=!!e.mediaInfo.is_focus,e.loadingPage.showLoading=!1}),e.focus=function(){var a;a=e.isfocus?0:1,o.postData("/user/focus_media",{media_id:t.params.mediaId,action:a}).then(function(t){t.status?a?(alert("已成功关注！"),e.isfocus=!0):(alert("已取消关注！"),e.isfocus=!1):alert(t.message)})}}]),angular.module("AccountModule",[]).controller("AccountCtrl",["$scope","$state","cookieService","httpService",function(e,t,o,a){return o.get("zw_username")?(e.loadingPage.showLoading=!0,a.getData("/user/get_detail").then(function(t){e.userInfo=t,$(".attention-list").css("width",9.78*e.userInfo.medias.length+"rem"),e.loadingPage.showLoading=!1}),e.switchMode=function(){e.mode.day=!e.mode.day,e.mode.day?e.mode.name="日间":e.mode.name="夜间"},e.exit=function(){o.exit(),t.go("tab.me.login")},e.feedback=function(){e.showFeed=!0},void(e.sendFeed=function(){alert("感谢您的反馈！我们会努力做的更好！"),e.showFeed=!1})):(t.go("tab.me.login"),e.loadingPage.showLoading=!1,!1)}]).controller("LoginCtrl",["$scope","$state","md5","httpService",function(e,t,o,a){e.username="",e.password="",e.login=function(){return""==e.username||""==e.password?(alert("请填写用户名或密码！"),!1):void a.postData("/user/login",{username:e.username,password:o.createHash(e.password)}).then(function(e){e.status?t.go("tab.me.account"):alert(e.message)})}}]).controller("RegisterCtrl",["$scope","$state","md5","httpService",function(e,t,o,a){e.username="",e.password="",e.register=function(){return""==e.username||""==e.password?(alert("请填写用户名或密码！"),!1):/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(e.username)?void a.postData("/user/register",{username:e.username,password:o.createHash(e.password)}).then(function(e){e.status?(alert("注册成功"),t.go("tab.me.account")):alert(e.message)}):(alert("请填写正确的邮箱格式！"),!1)}}]),angular.module("ArticleModule",["ngSanitize"]).controller("ArticleCtrl",["$scope","$state","$sce","cookieService","httpService",function(e,t,o,a,n){e.hasCollect=!1,e.loadingPage.showLoading=!0,n.getData("/article/get_one_article",{id:t.params.articleId}).then(function(t){t.article_content=o.trustAsHtml(t.article_content),e.article=t,e.hasCollect=!!e.article.is_focus,e.loadingPage.showLoading=!1}),e.collect=function(){if(!a.get("zw_username"))return alert("收藏文章请先登录！"),!1;e.hasCollect=!e.hasCollect;var o;o=e.hasCollect?1:0,n.postData("/user/collect_article",{article_id:t.params.articleId,action:o})}}]);
angular.module("directives",[]).directive("historyBack",["$rootScope","$state",function(t,e){return{restrict:"E",template:'<a class="history-back"><i class="icon-back"></i></a>',replace:!0,link:function(i,n,a){n.on("click",function(){var i=t.$previousState;i.from.name?window.history.back():e.go("tab.recommend")})}}}]).directive("repeatFinish",function(){return{link:function(t,e,i){1==t.$last&&t.$eval(i.repeatFinish)}}}).directive("scroll",["$window",function(t){return function(e,i,n){angular.element(t).bind("scroll",function(){$(this).height()+this.pageYOffset>$(".container").height()-250&&e.hasGetData&&(e.$eval(n.scroll),e.hasGetData=!1)})}}]);
angular.module("filters",[]).filter("dateObj",function(){return function(e){if(e){var t=e.split(/[- :]/),r=new Date(t[0],t[1]-1,t[2],t[3],t[4],t[5]),n=new Date(r);return n}}}).filter("month",function(){return function(e){if(e){var t=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];return t[e.getMonth()]+", "+e.getFullYear()}}}).filter("day",function(){return function(e){if(e){var t=["January","February","March","April","May","June","July","Aguest","September","October","November","December"],r=e.getDate();return 10>r&&(r="0"+r),t[e.getMonth()]+" "+r+" , "+e.getFullYear()}}});
!function(n,e){var t=n.documentElement,o="orientationchange"in window?"orientationchange":"resize",d=function(){var n=t.clientWidth;if(n){var e=12,o=16,d=320,i=768,a=(n-d)/(i-d),c=a*(o-e)+e;c>o?c=o:e>c&&(c=e),t.style.fontSize=c+"px"}};n.addEventListener&&(e.addEventListener(o,d,!1),n.addEventListener("DOMContentLoaded",d,!1))}(document,window),$(function(){FastClick.attach(document.body);var n=$(window).scrollTop();$(document).scroll(function(){var e=$(window).scrollTop();e>n&&$("#myTab").length?$("#myTab").addClass("hidden"):n>e&&$("#myTab").length&&$("#myTab").removeClass("hidden"),n=e})});
angular.module("services",[]).factory("cookieService",function(){var e={get:function(e){var n=encodeURIComponent(e)+"=",t=document.cookie.indexOf(n),o="";if(t>-1){var a=document.cookie.indexOf(";",t);-1==a&&(a=document.cookie.length),o=decodeURIComponent(document.cookie.substring(t+n.length,a))}return o},exit:function(){document.cookie="zw_username=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;"}};return e}).service("httpService",["$q","$http",function(e,n){this.getData=function(t,o){var a=e.defer(),c=a.promise;return n({method:"GET",url:"/zuiwan-backend/index.php"+t,params:o}).then(function(e){a.resolve(e.data)},function(e){console.log(e.data),a.reject(e.data)}),c},this.postData=function(t,o){var a=e.defer(),c=a.promise;return n({method:"POST",url:"/zuiwan-backend/index.php"+t,data:o}).then(function(e){a.resolve(e.data)},function(e){console.log(e.data),a.reject(e.data)}),c}}]);