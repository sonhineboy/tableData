# tableData
js实现的丰富的ajax加载表格数据
// 公用css
```csss
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
```
// 服务器返回数据格式 最后要返回json 
```php
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
```  	
html 格式
```html
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
```
 调用方式
``` javascript
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
```
#多多交流 QQ172205267