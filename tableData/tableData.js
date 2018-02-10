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

 //调用方式
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
			show_pages:6,
			init:function(obj){
				$.extend(this,this,obj);
				this.insertData(this.data);
				this.dblclick();
				this.trclick();
				this.initPage();
				this.initMask();
			},
			initPage:function(){
				
				if(this.page_dom != undefined){
					this.getPage();
					this.addPageEvnt();
					this.lastClick();
					this.nextClick();
					this.initLastNextStatus()
				}
			},
			insertData:function(datas){
				if(datas){
					this.page = datas.page;
				}
				
				this.showMask();
				var _this = this;
				_this.url = _this.url.replace(/[\u4e00-\u9fa5]+/ig,function($1){return encodeURI($1,'UTF-8')});
				$.ajax({
					url:_this.url,
					type:_this.type,
					data:datas,
					scriptCharset:'utf-8',
					success:function(data){
						
						if(typeof(data) != "object"){
							data = eval("(" + data + ")");
						}
						_this.ajaxData(data.data)
						var nums 		= parseInt(data.nums);
						var page_nums	= parseInt(data.page_nums);
							_this.nums 		= nums;
							_this.page_nums = page_nums;
							_this.initPage();
						_this.hideMask();
						_this.doHtml();
						_this.doCss();
						_this.insertSuccess();
						var __this = _this;
						window.onresize=function(){
							__this.doCss();
						}
					},
				})
			},
			template_engine:function(template_string,data){
				var lable_val = "---";
				//解析模板变量
				if(template_string.search("<") >= 0){
					template_lable_arr = template_string.match(/(\{[\w\.\[\]]*\}*)/ig);
					if(template_lable_arr){
						for(var p in template_lable_arr){
							var temporary_str 		= template_lable_arr[p]
							var temporary_str_labe 	= temporary_str.substr(1,temporary_str.length-2);
							try{
								lable_val 			= eval("data."+temporary_str_labe);
							}catch(e){
								lable_val			=null;
							}
							template_string = template_string.replace(temporary_str,this.lable_replace(lable_val));
							
						}
						
						return "<td>"+template_string+"</td>";
					}else{
						return "<td>"+template_string+"</td>";
					}
				}else{
					try{
						lavle_var = eval("data."+template_string);
					}catch(e){
						lavle_var =null;
					}
					return "<td>"+this.lable_replace(lavle_var)+"</td>";
				}
				
			},
			
			lable_replace:function(str){
				if(str === null || str == undefined)
					return "---";
				else
					return str;
			},
			ajaxData:function(data){
				var trtd = '';
				var td = '';
				for(p in data){
					for(p2 in this.columns){					
						var key = this.columns[p2];
						td += this.template_engine(key,data[p]);
					}
					
					td = this.doCheckboxAll(eval("data[p]."+this.key_name))+td;
					td +=this.doOperation(eval("data[p]."+this.status),eval("data[p]."+this.key_name));
					
					var key_value = this.tableKey(eval("data[p]."+this.key_name))
					trtd +="<tr"+key_value+">"+td+"</tr>";
					td = '';
				}
				
				if(trtd == ''){
					trtd = "<tr class='hover'><td colspan='"+this.dom.find('th').length+"' style='text-align:center;padding-top:60px;'><p>暂无数据</p></td></tr>";
				}
				
				this.dom.find("tbody").eq(0).html(trtd);
			},
			dblclick:function(){
				var _this = this;
				_this.dom.find("tbody").off("dblclick","tr");
				_this.dom.find("tbody").on("dblclick","tr",function(e){
					if(e.target.tagName.toLowerCase() === 'td'){
						_this.trDblclick ? _this.trDblclick(this) : "";
					}
				})
			},
			trclick:function(){
				var _this = this;
				_this.dom.find("tbody").off("click","tr");
				_this.dom.find("tbody").on("click","tr",function(e){
					if(e.target.tagName.toLowerCase() === 'td'){
						_this.click ? _this.click(this) : "";
					}
				})
			},
			
			doOperation:function(status,id){
				var th_length 	= this.dom.find("th").length;
				var is_true		= this.dom.find("th").eq(th_length-1).hasClass('operation');
				var operation = ""
				
				if(is_true){
					if(this.operation.search(/checkbox/i)>0){
						operation = "<td>"+this.operation.replace("type='checkbox'","type='checkbox' value='"+id+"'")+"</td>";
						if(status === '有效'){
							operation = operation.replace("input","input checked");
						}else if(status === '禁用'){
							operation = operation.replace("checked","");
						}else if(status === '离职'){
							operation ="";
						}	
					}else{
						operation = "<td>"+this.operation+"</td>"		
					}
					return operation;
				}
				
				return "";
			},
			doCheckboxAll:function(value){
				var is_true		= this.dom.find("th").eq(0).hasClass('checkbox_all') && (value != undefined);
				var check_box = "";	
				if(is_true){
					check_box = "<td>"+this.checkbox+"</td>";	
					check_box = check_box.replace('input','input value=\''+value+'\'');
				}
				
				return check_box;
				
			},
			getPage:function(){
				var pages 	  	= Math.ceil(this.nums/this.page_nums);
				this.pages 		= pages;
				var page_html 	= "";
				var is_active   = false;
				var show_pages  = this.show_pages-1;
				if(this.pages>show_pages){
					var start_page 	= ((this.page-1)%show_pages === 0) ? (((this.page-1)/show_pages)*show_pages)>0?(((this.page-1)/show_pages)*show_pages)-1:(((this.page-1)/show_pages)*show_pages):(parseInt(this.page/show_pages)*show_pages)>0?(parseInt(this.page/show_pages)*show_pages)-1:(parseInt(this.page/show_pages)*show_pages);
				start_page = pages-start_page > show_pages ? start_page:start_page-(show_pages-(pages-start_page))-1;
				}else{
					var start_page =0;
				}
				var show_i = 0;
				for(var i = start_page ; i<pages; i++){
					var d_p = i+1;
					var active = this.page == d_p ? "active":""; 
					if(active == 'active'){
						is_active = true;
					}
					page_html+="<li class='pageNum "+active+" page_li' page=\""+d_p+"\"><a href=#>"+d_p+"</a></li>";
					if(i%show_pages == 0 && show_i == 1 && this.pages>(show_pages+1)){
						show_i = 0;
						page_html+="<li><a href=#>...</a></li>";
						break;
					}
					
					if(i%show_pages == 0){
						show_i++;
					}
				}
				
				if(start_page>0){
					page_html="<li><a href=#>...</a></li>"+page_html;
				}
				
				if(this.page>pages && is_active == false && page_html!="" ){
					page_html+="<li class='pageNum active page_li' page=\""+this.page+"\">"+this.page+"</li>";
				}
		
				if(page_html != ""){
					page_html = "<ul class=\"pagination pagination-sm no-margin pull-right\">"+this.getPagesHtml()+this.getLastHtml()+page_html+this.getNexHtml()+"</ul>"+this.getSelectPageNums();
				}
				this.page_dom.html(page_html);
			},
			getSelectPageNums:function(){
				var pages_html_start = "<div class=\"btn-group pull-right dropup\" style='margin-right:10px' role=\"group\" aria-label=\"...\"><a href='javascript:void(0)' type=\"button\" class=\"btn btn-default btn-sm\" disabled=\"disabled\">每页显示</a>" +
										"<div class=\"btn-group\">"
								      + "<button type=\"button\" class=\"btn btn-default btn-sm\">"+this.page_nums+"条</button>"
								      + "<button type=\"button\" class=\"btn btn-default dropdown-toggle btn-sm\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"
								      +  "<span class=\"caret\"></span>"
								      + " <span class=\"sr-only\">Toggle Dropdown</span>"
								      + "</button>"
								    	+"<ul class=\"dropdown-menu select_page_nums\">"
								    	+  "<li><a href='javascript:void(0)' value='20'>20条</a></li>"
								      	+  "<li><a href='javascript:void(0)' value='30'>30条</a></li>"
								      	+  "<li><a href='javascript:void(0)' value='40'>40条</a></li>"
								      	+  "<li><a href='javascript:void(0)' value='50'>50条</a></li>"
								        +"</ul>"
								    +"</div></div>"; 
				
				return pages_html_start;
			},
			getLastPage:function(){
				var now_page = this.getNowPage();
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
				return "<li class=\"prev previous\"><a href=#>&lt;</a></li>";
			},
			getNexHtml:function(){
				return "<li class=\"next\"><a href=#>&gt;</a></li>";
			},
			//点击上一页
			lastClick:function(){
				var _this = this;
				$(".prev").click(function(){
					
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
					$(".next").removeClass("disabled");
				}else if(this.getNowPage() == this.pages){
					$(".next").addClass("disabled");
					$(".previous").removeClass("disabled");
				}else if(this.getNowPage() > this.pages){
					$(".next").addClass("disabled");
				}else{
					$(".previous").removeClass("disabled");
					$(".next").removeClass("disabled");
				}
			},
			showMask:function(){
				$(".mask").css({"display":"block",'top':0,"height":this.dom.height()+30,"width":this.dom.width()});
				$(".mask_info").css({"display":"block",'top':this.dom.height()/2-40,"width":this.dom.width()});
			},
			hideMask:function(){
				$(".mask").css({"display":"none"});
				$(".mask_info").css({"display":"none"});
			},
			initMask:function(){
				if($(".mask_info").html() === undefined){
					var mask_html = "<div class='mask'></div>"
									+"<div class=\"mask_info\"><i class=\"fa fa-spinner fa-pulse fa-3x fa-fw\"></i><span class=\"sr-only\">Loading...</span></div>"
					this.dom.append(mask_html);	
				}
			},
			tableKey:function(value){
				if(this.key_name){
					return " key="+value;
				}else{
					return "";
				}
			},
			insertSuccess:function(){
				this.success ? this.success() : "";
				
			},
			getPagesHtml:function(){

				var pages_html = "<li class='disabled' style='width:auto;padding: 0px 5px; cursor: default;'><a>共"+this.nums+"条</a></li>"
				return pages_html;
			},
			
			insertDiv:function(){
				if($(".tbody_box")!=undefined){
					$(".tbody_box").remove()
				}
				this.dom.find('table').after("<div class='tbody_box'><table class='table table-hover'></table></div>")
			},
			insertDivTableBody:function(){
				tableData.dom.find('table').eq(0).find('tbody').clone(true).appendTo('.tbody_box table');
				tableData.dom.find('table').eq(0).find('tbody').html("");
			},
			doInsertTdWidth:function(){
				if(tableData.td_width){
					
					for(var p in tableData.td_width){
						$(".tbody_box table tr").eq(0).find('td').eq(p).outerWidth($(tableData.td_width[p]).outerWidth());
					}
					
				}else{
					tableData.dom.find('table').eq(0).find('th').each(function(i){
						if(i!=undefined){
							$(".tbody_box table tr").eq(0).find('td').eq(i).outerWidth($(this).outerWidth());
						}
					})
				}
			},
			doTableHeight:function(){
				var pass_height = this.pass_height !=undefined ?this.pass_height : 0;
				var this_dom_height = $(window).height()-pass_height;
				this.dom.outerHeight(this_dom_height);
				$(".tbody_box").outerHeight(this_dom_height-(this.page_dom.outerHeight()+parseInt(this.page_dom.css('marginTop')))-this.dom.find('table').eq(0).outerHeight()-12);
				$(".tbody_box").css({"overflow-y":'auto'})
			},
			doHtml:function(){
				this.insertDiv();
				this.insertDivTableBody();
			},
			doCss:function(){
				this.doInsertTdWidth();
				this.doTableHeight();
			}
			
	}