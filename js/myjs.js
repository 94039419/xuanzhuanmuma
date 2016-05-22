(function($){
	var myCarousel=function(obj){
		var that=this;
		this.obj=obj;
		
		this.$btns=obj.find("div.btn");															//this很重要，需要在属性前边定义
		this.$items=obj.find("div.items_div");
		
		this.saveData=[];
		this.timer=null;
		
		this.$items.each(function(i){
          that.saveData.push(that.$items.eq(i))
        });
		
		$.extend(myCarousel.presetData,this.getData())
		
		this.firstData=this.saveData.slice(0,1);
		this.rightData=this.saveData.slice(1,Math.ceil(this.saveData.length/2));
		this.leftData=this.saveData.slice(Math.ceil(this.saveData.length/2),this.saveData.length);
	
		this.setPos();																//设置初始位置
		
		
		this.obj.delegate(".btn","click",function(e){
			e.stopPropagation();
			var dir= $(this).attr("data-icon");
			that.clickMethod(dir);
		})	
		
		if(myCarousel.presetData.auto==true){
			this.autoTurn();
		}
		
		this.obj.hover(function(){
			clearInterval(that.timer);
		},function(){
			if(that.getData().auto==true){
				that.autoTurn();
			}
		})
		
	}

	myCarousel.prototype={
		
		clickMethod:function(dd){
			if(!this.$items.is(":animated")){											//不在动画状态，就执行
				this.turn(dd);	
			}
			
		},
		
		autoTurn:function(){
			var that=this;
			this.timer=setInterval(function(){
				that.clickMethod("rb");	
			},1000)
		},
		
		
		turn:function(dir){
			var that=this;
			if(dir=="rb"){
				this.$items.each(function(i) {
					var nextItem=i!=that.$items.length-1?$(this).next():that.$items.first();
						nextW=nextItem.width(),
						nextH=nextItem.height(),
						nextOp=nextItem.css("opacity"),
						nextLeft=nextItem.css("left"),
						nextTop=nextItem.css("top"),
						nextZindex=nextItem.css("zIndex");
                 	
					$(this).animate({
						width:nextW,
						height:nextH,
						opacity:nextOp,
						top:nextTop,
						left:nextLeft,
						zIndex:nextZindex
					},myCarousel.presetData.speed)
					
                });
			}else if(dir=="lb"){
				this.$items.each(function(i) {
					var prevItem=(i>0)?$(this).prev():that.$items.last();
						prevW=prevItem.width(),
						prevH=prevItem.height(),
						prevOp=prevItem.css("opacity"),
						prevLeft=prevItem.css("left"),
						prevTop=prevItem.css("top"),
						prevZindex=prevItem.css("zIndex");
                 
					$(this).animate({
						width:prevW,
						height:prevH,
						opacity:prevOp,
						top:prevTop,
						left:prevLeft,
						zIndex:prevZindex
					},myCarousel.presetData.speed)
                });
				
			}
			
		},
		
		setPos:function(){
			var     wrapW=this.obj.width(),
					wrapH=this.obj.height(),
					photoW=this.$items.eq(0).width(),
					photoH=this.$items.eq(0).height();
					spacing=(wrapW/2-photoW/2)/this.rightData.length;
					myopacity=1,
					LZindex=1,
					Rzindex=this.rightData.length,
					that=this,
					topMode=null;
			if(myCarousel.presetData.vertical=="middle"){
					topMode=wrapH/2-photoH/2;
				}else if(myCarousel.presetData.vertical=="top"){
					topMode=0;
				}else if(myCarousel.presetData.vertical=="bottom"){
					topMode=wrapH-photoH;
				}
			
			this.$items.eq(0).css({																	//设置第一张图片
				top:topMode,
				left:(wrapW/2-photoW/2),
				opacity:myopacity,
				zIndex:1000
			})
			
			var it1_offset=this.$items.eq(0).offset();
				offsetLeft=it1_offset.left;
				offsetTop=it1_offset.top;
				wrap_offset=this.obj.offset(),
				wrap_left=wrap_offset.left;
			
				gudingR=offsetLeft+photoW+spacing-wrap_left;
	
			$(this.rightData).each(function(i) {
				photoW=photoW*myCarousel.presetData.scale;
				photoH=photoH*myCarousel.presetData.scale;
				myopacity=myopacity*myCarousel.presetData.scale;
				
				if(myCarousel.presetData.vertical=="middle"){
					topMode=wrapH/2-photoH/2;
				}else if(myCarousel.presetData.vertical=="top"){
					topMode=0;
				}else if(myCarousel.presetData.vertical=="bottom"){
					topMode=wrapH-photoH;
				}
				
                $(that.rightData[i]).css({
					width:photoW,
					height:photoH,
					top:topMode,
					left:(gudingR-photoW)+i*spacing,
					opacity:myopacity*myCarousel.presetData.scale,
					zIndex:Rzindex
				})	
				Rzindex--;
            });
			
			$(this.leftData).each(function(i) {
				if(myCarousel.presetData.vertical=="middle"){
					topMode=wrapH/2-photoH/2;
				}else if(myCarousel.presetData.vertical=="top"){
					topMode=0;
				}else if(myCarousel.presetData.vertical=="bottom"){
					topMode=wrapH-photoH;
				}
                $(that.leftData[i]).css({
					width:photoW,
					height:photoH,
					top:topMode,
					left:i*spacing,
					opacity:myopacity*myCarousel.presetData.scale,
					zIndex:LZindex
				})	
				photoW=photoW/myCarousel.presetData.scale;
				photoH=photoH/myCarousel.presetData.scale;
				myopacity=myopacity/myCarousel.presetData.scale;
				LZindex++;
            });	
		},
		
		getData:function(){
			var objData= this.obj.attr("data-info");	
				if(objData&&objData!=""){
					return $.parseJSON(objData);
				}else{
					return {};	
				}
		}
	}
	
	myCarousel.init=function(obj){
		var that= this;	
		obj.each(function(){
			 new that($(this));
		})
		
	}
	
	
	
	myCarousel.presetData={
		speed:800,
		scale:0.8,
		auto:true,
		vertical:"middle"
	}

	window["myCarousel"]=myCarousel;
	

})(jQuery)