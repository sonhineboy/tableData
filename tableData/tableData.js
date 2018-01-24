/*
// 公用css

.table_box{ position: relative; overflow: hidden;}
.mask{position: absolute;z-index: 9;background-color: #fff; 
	  filter:alpha(opacity=50);  
      -moz-opacity:0.5;  
      -khtml-opacity: 0.5;  
      opacity: 0.5; 
}
.mask_info{
	position: absolute;
	z-index: 19; text-align: center;
}
.mask_info,.mask{display: none}

// 服务器返回数据格式 最后要返回json 
   	$data = [
    			['id'=>1,'name'=>'asdfa','name2'=>'asdf2','asfd'=>'asdf'],
    			['id'=>2,'name'=>'asdfa','name2'=>'asdf2','asfd'=>'asdf'],
    			['id'=>3,'name'=>'asdfa','name2'=>'asdf2','asfd'=>'asdf'],
    			['id'=>4,'name'=>'asdfa','name2'=>'asdf2','asfd'=>'asdf'],
    			['id'=>5,'name'=>'asdfa','name2'=>'asdf2','asfd'=>'asdf'],
    			
    	];
    	$datas['data'] 		= $data;  // 数据
    	$datas['nums'] 		= 100;    //总页数
    	$datas['page_nums'] = 15;     // 每页显示的条数
    	
// html 格式
<div class="table_box">
<table class="table">
      <thead>
        <tr>
          <th class="checkbox_all" ><input type="checkbox" class="user-checkbox selectable-all"></th>
          <th>id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th class='operation' >操作</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
</table>
<div class="paging_simple_numbers">

</div>

</div>

 //调佣方式
 tableData.init({
	dom:$(".table"),
	url:'dataTables',
	columns:["id",'name','name2','asfd'],
	operation:"<a  href='javascript:void(0)'>aslkdfas</a> kjsldfjl",
	checkbox:"<input type=\"checkbox\" class=\"user-checkbox selectable-all\">",
	page_dom:$(".paging_simple_numbers"),
	trDblclick:function(dom){
		$(dom).remove();
		return false;
	}
})
 * */	

var tableData = {
			dom:null,
			url:null,
			type:'get',
			columns:null,
			dblclick:null,
			pages:null,
			init:function(obj){
				$.extend(this,this,obj);
				this.insertData(this.data);
				this.dblclick();
				this.initPage();
				this.initMask();
			},
			initPage:function(){
				this.getPage();
				this.addPageEvnt();
				this.lastClick();
				this.nextClick();
				this.initLastNextStatus()
			},
			insertData:function(datas){
				this.showMask();
				var _this = this;
				$.ajax({
					url:_this.url,
					type:_this.type,
					data:datas,
					success:function(data){
						_this.ajaxData(data.data)
						
						var nums 		= parseInt(data.nums);
						var page_nums	= parseInt(data.page_nums);
						if( nums!= parseInt(_this.nums)){
							_this.nums 		= nums;
							_this.page_nums = page_nums;
							_this.initPage();
						}
						_this.hideMask();
					},
				})
			},
			ajaxData:function(data){
				var trtd = '';
				var td = '';
				for(p in data){
					for(p2 in this.columns){					
						var key = this.columns[p2];
						td += "<td>"+eval("data[p]."+key)+"</td>";
					}
					
					td = this.doCheckboxAll()+td;
					td +=this.doOperation();
					trtd +="<tr>"+td+"</tr>";
					td = '';
				}
				
				this.dom.find("tbody").html(trtd);
			},
			dblclick:function(){
				var _this = this;
				_this.dom.find("tbody").on("dblclick","tr",function(e){
					if(e.target.tagName.toLowerCase() === 'td'){
						_this.trDblclick ? _this.trDblclick(this) : "";
					}
				})
			},
			
			doOperation:function(){
				var th_length 	= this.dom.find("th").length;
				var is_true		= this.dom.find("th").eq(th_length-1).hasClass('operation');
				if(is_true){
					return "<td>"+this.operation+"</td>";		
				}
				
				return "";
			},
			doCheckboxAll:function(){
				var is_true		= this.dom.find("th").eq(0).hasClass('checkbox_all');
				if(is_true){
					return "<td>"+this.checkbox+"</td>";		
				}
				
				return "";
				
			},
			getPage:function(){
				var pages 	  	= Math.ceil(this.nums/this.page_nums);
				this.pages 		= pages;
				var page_html 	= "";
				
				for(var i = 0 ; i<pages; i++){
					var active = i===0 ? "active":""; 
					page_html+="<li class='paginate_button "+active+" page_li' page=\""+(i+1)+"\"><a href=\"javascript:void(0)\">"+(i+1)+"</a></li>";
				}
				
		
				
				page_html = "<ul class=\"pagination\">"+this.getLastHtml()+page_html+this.getNexHtml()+"</ul>";
				this.page_dom.html(page_html);
			},
			getLastPage:function(){
				var now_page = this.getNowPage();
				console.log(now_page);
				return now_page === '1' ? now_page:(now_page-1);
			},
			getNextPage:function(){
				var now_page 	= this.getNowPage();
				var pages 	  	= Math.ceil(this.nums/this.page_nums);
				return now_page == pages ? now_page:parseInt(now_page)+1;
				
			},
			getNowPage:function(){
				return this.page_dom.find("li.active").attr("page");
			},
			pageActive:function(dom){
				$(dom).addClass("active").siblings().removeClass("active");
			},
			addPageEvnt:function(){
				var _this = this;
				this.page_dom.find("li.page_li").click(function(){
					if($(this).hasClass('active'))
						return false;
					_this.pageActive(this);
					var datas = {"page":_this.getNowPage(),"page_nums":_this.page_nums};
					_this.insertData(datas);
					_this.initLastNextStatus();
				})
			},
			getLastHtml:function(){
				return "<li class=\"paginate_button previous\" id=\"dataTableExample_previous\"><a href=\"javascript:void(0)\" ><i class=\"icon wb-chevron-left-mini\"></i></a></li>";
			},
			getNexHtml:function(){
				return "<li class=\"paginate_button next\" id=\"dataTableExample_next\"><a href=\"javascript:void(0)\" ><i class=\"icon wb-chevron-right-mini\"></i></a></li>";
			},
			//点击上一页
			lastClick:function(){
				var _this = this;
				$(".previous").click(function(){
					
					if($(this).hasClass('disabled'))
						return false;
					
					var datas = {"page":_this.getLastPage(),"page_nums":_this.page_nums};
					_this.insertData(datas);
					_this.pageActive($("li.active").prev(".page_li").eq(0));
					_this.dislables(this,"last");
				})
			},
			//点击下一页
			nextClick:function(){
				var _this = this;
				$(".next").click(function(){
					if($(this).hasClass('disabled'))
						return false;
					
					var datas = {"page":_this.getNextPage(),"page_nums":_this.page_nums};
					_this.insertData(datas);
					_this.pageActive($("li.active").next(".page_li").eq(0));
					_this.dislables(this,"next");
				})
			},
			//针对上一页，下一页的禁用
			dislables:function(dom,action){
				if(action === 'last'){
					if(this.getNowPage() === "1"){
						$(dom).addClass("disabled");
					}else{
						$(dom).removeClass("disabled");
					}
				}else if(action === 'next'){
					if(this.getNowPage() == this.pages){
						$(dom).addClass("disabled");
					}else{
						$(dom).removeClass("disabled");
					}
				}
				
				this.initLastNextStatus();
			},
			//初始化按钮状态
			initLastNextStatus:function(){
				if(this.getNowPage() === "1" && this.getNowPage() == this.pages){
					$(".previous").addClass("disabled");
					$(".next").addClass("disabled");
				}else if(this.getNowPage() === "1"){
					$(".previous").addClass("disabled");
				}else if(this.getNowPage() == this.pages){
					$(".next").addClass("disabled");
				}else{
					$(".previous").removeClass("disabled");
					$(".next").removeClass("disabled");
				}
			},
			showMask:function(){
				$(".mask").css({"display":"block",'top':this.dom.find("thead").height(),"height":this.dom.find('tbody').height(),"width":this.dom.find('tbody').width()});
				$(".mask_info").css({"display":"block",'top':this.dom.find("tbody").height()/2+18,"width":this.dom.find('tbody').width()});
			},
			hideMask:function(){
				$(".mask").css({"display":"none"});
				$(".mask_info").css({"display":"none"});
			},
			initMask:function(){
				var mask_html = "<div class='mask'></div>"
								+"<div class=\"mask_info\">信息加载中...</div>"
				this.dom.parent(".table_box").append(mask_html);			
			}
	}