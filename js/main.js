BoxYouXi = {
			oP:null,
			history:[],
			target:{},
			boxs:[],
			gk:[
				{
					map:[
						0,0,1,1,1,0,0,0,
						0,1,3,3,1,1,1,1,
						0,1,2,2,3,2,2,1,
						1,2,2,2,1,2,1,0,
						1,2,2,2,2,3,1,0,
						1,2,2,2,2,2,2,1,
						0,1,2,2,2,2,1,0,
						0,0,1,1,1,1,1,0
					],
					boxPos:[
						{x:5,y:3},
						{x:3,y:5},
						{x:2,y:4},
						{x:4,y:5}
					],
					personPos:{x:4,y:6},
				},
				{
					map:[
						0,0,1,1,1,0,0,0,
						0,1,3,3,1,1,1,1,
						0,1,2,2,2,2,2,1,
						1,2,2,2,1,2,2,1,
						1,2,2,1,2,3,2,1,
						1,2,2,2,2,2,2,1,
						1,3,2,2,2,2,1,0,
						0,1,1,1,1,1,1,0
					],
					boxPos:[
						{x:5,y:3},
						{x:3,y:5},
						{x:2,y:4},
						{x:4,y:5}
					],
					personPos:{x:4,y:6},
				}
			],
			createMap:function(gk){
				document.title = '当前第'+(this.num+1)+'关';
				this.colsNum = Math.sqrt(gk.map.length);
				this.oParent.style.width = this.colsNum*50+'px';
				for(var i=0;i<gk.map.length;i++){
					var oLi = document.createElement('li');
					oLi.className = 'pos'+gk.map[i];
					this.oParent.appendChild(oLi);
					if(gk.map[i]==3){
						this.target[oLi.offsetLeft+'_'+oLi.offsetTop] = '1';
					}
				}
				this.createMan(gk);
			},
			createMan:function(gk){
				this.oP = document.createElement('div');
				this.oP.className = 'person2';
				this.oP.x = gk.personPos.x;
				this.oP.y = gk.personPos.y;
				this.oP.style.left = this.oP.x*50+'px';
				this.oP.style.top = this.oP.y*50+'px';
				this.oParent.appendChild(this.oP);
				this.createBox(gk);
			},
			createBox:function(gk){
				for(var i=0;i<gk.boxPos.length;i++){
					var oDiv = document.createElement('div');
					oDiv.className = 'box';
					oDiv.style.left = gk.boxPos[i].x*50+'px';
					oDiv.style.top = gk.boxPos[i].y*50+'px';
					this.oParent.appendChild(oDiv);
					this.boxs.push(oDiv);
				}
			},
			personRun:function(iJons){
				var gk = this.gk[this.num];
				var map = gk.map;
				var x = this.oP.x+iJons.x;
				var y = this.oP.y+iJons.y;
				var bx = x+iJons.x;
				var by = y+iJons.y;
				if(map[this.colsNum*y+x]==1){
					return;
				}
				this.oP.x = x;
				this.oP.y = y;
				this.oP.style.left = this.oP.x*50+'px';
				this.oP.style.top = this.oP.y*50+'px';
				for(var i=0;i<this.boxs.length;i++){
					if(this.impactCheck(this.oP,this.boxs[i])){
						if(map[this.colsNum*by+bx] == 1){
							this.oP.x = x-iJons.x;
							this.oP.y = y-iJons.y;
							this.oP.style.left = this.oP.x*50+'px';
							this.oP.style.top = this.oP.y*50+'px';
							return;
						}
						this.boxs[i].style.left = bx*50+'px';
						this.boxs[i].style.top = by*50+'px';
						for(var n=0;n<this.boxs.length;n++){
							if(this.boxs[i]!=this.boxs[n] && this.impactCheck(this.boxs[i],this.boxs[n])){
								this.oP.x = x-iJons.x;
								this.oP.y = y-iJons.y;
								this.oP.style.left = this.oP.x*50+'px';
								this.oP.style.top = this.oP.y*50+'px';
								this.boxs[i].style.left = (bx-iJons.x)*50+'px';
								this.boxs[i].style.top = (by-iJons.y)*50+'px';
								return;
							}
						}
						if(this.target[this.boxs[i].offsetLeft+'_'+this.boxs[i].offsetTop]){
							this.boxs[i].ok = true;
							var sucLen = 0;
							for(var n=0;n<this.boxs.length;n++){
								if(this.boxs[n].ok){
									sucLen++;
								}
							}
							if(sucLen==this.boxs.length)this.nextLevel();
						}else{
							this.boxs[i].ok = false;
						}
						break;
					}
				}
				if(this.preTmp)this.history.push(this.preTmp);
				this.preTmp = {
					boxPos:[]
				};
				this.preTmp.personPos = {
					x:this.oP.x,
					y:this.oP.y
				}
				for(var i=0;i<this.boxs.length;i++){
					this.preTmp.boxPos[i] = {
						x:this.boxs[i].offsetLeft,
						y:this.boxs[i].offsetTop
					}
				}
				if(this.history.length>20){
					this.history.splice(0,1);
				}
			},
			nextLevel:function(){
				this.history = [];
				this.target = [];
				this.boxs = [];
				this.oParent.innerHTML = '';
				this.num++;
				if(!this.gk[this.num]){
					alert('恭喜你已经通过了所有关卡，可以下山了');
					return false;
				}
				this.createMap(this.gk[this.num]);
			},
			impactCheck:function(obj1,obj2){//碰撞检测
				var l1 = obj1.offsetLeft;
				var t1 = obj1.offsetTop;
				var r1 = l1+obj1.offsetWidth;
				var b1 = t1+obj1.offsetHeight;
				var l2 = obj2.offsetLeft;
				var t2 = obj2.offsetTop;
				var r2 = l2+obj2.offsetWidth;
				var b2 = t2+obj2.offsetHeight;
				if(b1<=t2 || l1>=r2 || t1>=b2 || r1<=l2){
					return false;
				}else{
					return true;
				}
			},
			backPrevStep:function(){
				var prevIndex = this.history.length-1;
				if(!this.history[prevIndex])return;
				var perPos = this.history[prevIndex].personPos;
				var boxPos = this.history[prevIndex].boxPos;
				this.history.splice(prevIndex,1);
				this.oP.x = perPos.x;
				this.oP.y = perPos.y;
				this.oP.style.left = this.oP.x*50+'px';
				this.oP.style.top = this.oP.y*50+'px';
				for(var i=0;i<boxPos.length;i++){
					this.boxs[i].style.left = boxPos[i].x+'px';
					this.boxs[i].style.top = boxPos[i].y+'px';
				}

			},
			ini:function(oParent,num){
				this.num = num;
				this.oParent = oParent;
				var gk = this.gk[num];
				this.createMap(gk);
				var self = this;
				onkeyup = function(ev){
					var oEvent = ev || event;
					switch(oEvent.keyCode){
						case 37://left
							self.oP.className = 'person2';
							self.personRun({x:-1,y:0});
						break;
						case 65://left
							self.oP.className = 'person2';
							self.personRun({x:-1,y:0});
						break;
						case 38://up
							self.oP.className = 'person1';
							self.personRun({x:0,y:-1});
						break;
						case 87://up
							self.oP.className = 'person1';
							self.personRun({x:0,y:-1});
						break;
						case 39://right
							self.oP.className = 'person4';
							self.personRun({x:1,y:0});
						break;
						case 68://right
							self.oP.className = 'person4';
							self.personRun({x:1,y:0});
						break;
						case 40://down
							self.oP.className = 'person3';
							self.personRun({x:0,y:1});
						break;
						case 83://down
							self.oP.className = 'person3';
							self.personRun({x:0,y:1});
						break;
						case 81://上一步
							self.backPrevStep();
						break;
					}
				}
			}
		}
		BoxYouXi.ini(document.getElementById('yxbox'),0);