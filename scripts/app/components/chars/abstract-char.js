define(function(require, exports, module){
	var Kinetic = require('kinetic');
	var oo = require('xiaoming/oo');
	var resourceLoader = require('xiaoming/resource-loader');
	var CharType = require('app/models/chars/char-type');

	var AbstractChar = function(options){
		this._initAbstractChar(options);
	};

	AbstractChar.prototype = {
		_initAbstractChar: function(options){
			this.options = oo.mix({
				image: resourceLoader.get('solider'),
				darkImage: resourceLoader.get('solider_dark'),
				fixX: -8,
				fixY: -16,
				defaultAnimation: 'idle',
				frameRate: 8,
				index: 0,
				cx: 0,
				cy: 0,
				animation: {
					idle: [
						{x: 0, y: 0, width: 48, height: 48},
						{x: 0, y: 48, width: 48, height: 48},
						{x: 0, y: 96, width: 48, height: 48},
						{x: 0, y: 144, width: 48, height: 48},
						{x: 0, y: 192, width: 48, height: 48},
						{x: 0, y: 240, width: 48, height: 48},
						{x: 0, y: 288, width: 48, height: 48},
						{x: 0, y: 336, width: 48, height: 48}
					],
					atk: [
						{x: 48, y: 0, width:80, height:52},
						{x: 48, y: 52, width:80, height:52},
						{x: 48, y: 104, width:80, height:52},
						{x: 48, y: 156, width:80, height:52},
						{x: 48, y: 208, width:80, height:52},
						{x: 48, y: 260, width:80, height:52},
						{x: 48, y: 312, width:80, height:52}
					],
					dead: [
						{x: 128, y: 0, width:80, height:64},
						{x: 128, y: 64, width:80, height:64},
						{x: 128, y: 128, width:80, height:64},
						{x: 128, y: 192, width:80, height:64},
						{x: 128, y: 256, width:80, height:64},
						{x: 128, y: 320, width:80, height:64}
					],
					disable: [
						{x: 208, y: 0, width: 48, height: 48}
					]
				}
			}, this.options);
			this.options = oo.mix(this.options, options);

			Kinetic.Group.call(this, this.options);

			this.body = new Kinetic.Sprite({
				x: this.getFixX(),
				y: this.getFixY(),
				image: this.getImage(),
				animation: this.getDefaultAnimation(),
				animations: this.getAnimation(),
				frameRate: this.getFrameRate(),
				index: this.getIndex(),
				drawHitFunc: function(context){
					context.beginPath();
					context.rect(8, 16, 32, 32);
					context.closePath();
					context.fillStrokeShape(this);
				}
			});

			this.stars = new Kinetic.Sprite({
				x: 30,
				y: 0,
				image: resourceLoader.get('stars'),
				animation: 'flicker',
				animations: {
					flicker: [
						{x: 0, y: 0, width: 48, height: 48},
						{x: 0, y: 48, width: 48, height: 48},
						{x: 0, y: 96, width: 48, height: 48},
						{x: 0, y: 144, width: 48, height: 48},
						{x: 0, y: 192, width: 48, height: 48},
						{x: 0, y: 240, width: 48, height: 48}
					]
				},
				frameRate: this.getFrameRate(),
				visible: false
			});

			this.decreaseHitPoint = new Kinetic.Text({
				x: this.getFixX(),
				y: this.getFixY(),
				text : '-300',
				fontSize: 24,
				fontFamily: "Microsoft YaHei",
				fontStyle: 'bold',
				shadowColor: '#000000',
				shadowOffsetX: 2,
				shadowOffsetY: 2,
				width:50,
				fill: '#f00',
				align : 'center',
				listening : false,
				visible: false
			});
            this.bodyGroup = new Kinetic.Group({
                x:0,
                y:0
            });
			this.bodyGroup.add(this.body);
			this.bodyGroup.add(this.stars);
            this.add(this.bodyGroup);
			this.add(this.decreaseHitPoint);
		},

		getRealPos: function(c, offset){
			return c * 32 + offset;
		},

		changeIdColor: function(idColorType){
			switch (idColorType){
				case CharType.idColorType.blue:
					this.body.setImage(resourceLoader.get('solider'));
					this.setImage(resourceLoader.get('solider'));
					this.setDarkImage(resourceLoader.get('solider_dark'));
					break;
				case CharType.idColorType.red:
					this.body.setImage(resourceLoader.get('solider_red'));
					this.setImage(resourceLoader.get('solider_red'));
					this.setDarkImage(resourceLoader.get('solider_red_dark'));
					break;
				default :
					this.body.setImage(resourceLoader.get('solider'));
					break;
			}

		},
		//开始动画
		start: function(){
			this.body.start();
		},
		//设置坐标值，游戏格子坐标
		setCoordinate: function(x, y){
			this.setCx(x);
			this.setCy(y);

			this.setX(this.getRealPos(x, 0));
			this.setY(this.getRealPos(y, 0));
		},
		/**
		 * 攻击动作
		 */
		attack: function(){
			var self = this;
			this.body.setAnimation('atk');
			this.body.afterFrame(6, function() {
				self.body.setAnimation('idle');
			});
		},
		/**
		 * 翻转
		 * @param value
		 */
		flip: function(value){
			if(value == 'right'){
				this.bodyGroup.setScale(1, 1);
				this.bodyGroup.setOffset(0, 0);
			}

			if(value == 'left'){
				this.bodyGroup.setScale(-1, 1);
				this.bodyGroup.setOffset(32, 0);
			}
		},

		onCoordinateChange: function(event){
			if(event.direction.x < 0){
				this.flip('left');
			}else if(event.direction.x > 0){
				this.flip('right');
			}
			this.setCoordinate(event.cx, event.cy);
		},

		onActive: function(event){
			this.moveToTop();
		},

		onWaiting: function(event){
			this.body.setImage(this.getDarkImage());
			this.body.setAnimation('idle');
		},

		onNormal: function(event){
			this.body.setImage(this.getImage());
			this.body.setAnimation('idle');
		},

		onAttack: function(event){
			if(event.direction.x == -1){
				this.flip('right');
			}else if(event.direction.x == 1){
				this.flip('left');
			}
			this.attack();
			var self = this;
			setTimeout(function(){
				self.showStars();
			}, 600);

		},
		//攻击效果
		showStars: function(){
			var self = this;
			this.stars.show();
			this.stars.start();
			this.stars.afterFrame(5, function() {
				self.stars.stop();
				self.stars.hide();
			});
		},

		//死亡事件
		onDead: function(e){
			var self = this;
			setTimeout(function(){
				self.body.setAnimation('dead');
				self.body.afterFrame(4, function() {
					self.body.stop();
					self.destroy();
				});
			}, 500);
		},

		onHipPointDecrease: function(event){
			if(event.direction.x == -1){
				this.flip('left');
			}else if(event.direction.x == 1){
				this.flip('right');
			}
            if(event.hitPoint > 0){
                this.decreaseHitPoint.setFill('#0f0');
            }else{
                this.decreaseHitPoint.setFill('#f00');
            }
			this.decreaseHitPoint.setText(event.hitPoint);
			this.decreaseHitPoint.show();
			this.decreaseHitPoint.setOpacity(1);
			this.decreaseHitPoint.setY(0);

			var tween = new Kinetic.Tween({
				node: this.decreaseHitPoint,
				y: -40,
				opacity: 0,
				fontSize: 24,
				duration: 1,
				easing: Kinetic.Easings.EaseInOut
			});
			tween.play();
		}
	};

	Kinetic.Util.extend(AbstractChar, Kinetic.Group);
	Kinetic.Factory.addGetterSetter(AbstractChar, 'image');
	Kinetic.Factory.addGetterSetter(AbstractChar, 'darkImage');
	Kinetic.Factory.addGetterSetter(AbstractChar, 'fixX');
	Kinetic.Factory.addGetterSetter(AbstractChar, 'fixY');
	Kinetic.Factory.addGetterSetter(AbstractChar, 'cx');
	Kinetic.Factory.addGetterSetter(AbstractChar, 'cy');
	Kinetic.Factory.addGetterSetter(AbstractChar, 'defaultAnimation');
	Kinetic.Factory.addGetterSetter(AbstractChar, 'frameRate');
	Kinetic.Factory.addGetterSetter(AbstractChar, 'index');
	Kinetic.Factory.addGetterSetter(AbstractChar, 'animation');

	module.exports = AbstractChar;
});