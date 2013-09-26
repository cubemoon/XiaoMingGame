define(function(require, exports, module){
	var GameMainView = require('app/views/game-main-view');
	var AbstractController = require('xiaoming/abstract-controller');
	var oo = require('xiaoming/oo');
	var resourceLoader = require('xiaoming/resource-loader');
	var GameModel = require('app/models/game-model');
    var CharType = require('app/models/chars/char-type');
    var CharFactory = require('app/models/chars/char-factory');
    var CPTCharFactory = require('app/components/chars/char-factory');
	
	var GameMainController = function(options){
		this._initGameMainController(options);
	};
	
	GameMainController.prototype = {
		_initGameMainController: function(options){
			AbstractController.call(this, options);
			this.gameModel = new GameModel();

            this.player1 = CharFactory.createCharacter(CharType.swordman);
		},
		
		initEvents: function(){
			this.get('eventManager').addEventListener(GameMainView.EVENT_LAYER_CLICK, this.onLayerClick, this);
			this.get('eventManager').addEventListener(GameMainView.EVENT_ATK_CLICK, this.onAtkClick, this);
		},

		onRender: function(){
            /*
            var image = new Kinetic.Image({
                x: 0,
                y: 0,
                image: resourceLoader.get('forest'),
                width: 512,
                height: 512
            });
            this.get('view').layer.add(image);
            */
            var cptPlayer1 = this.cptPlayer1 = CPTCharFactory.createCharacter(this.player1.charType);
            this.get('view').layer.add(cptPlayer1);
			cptPlayer1.change2Red();
			cptPlayer1.start();
			cptPlayer1.setCoordinate(10, 8);
		},

        onLayerClick: function(e){
            //console.log(e);
        },

		onAtkClick: function(e){
			this.cptPlayer1.attack();
		}
		
	};
	oo.extend(GameMainController, AbstractController);
	module.exports = GameMainController;
});
