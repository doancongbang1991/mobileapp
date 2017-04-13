//------------------------------------------------------------------
// Systems
//------------------------------------------------------------------
function InputSystem() {
}

InputSystem.prototype = new System();

InputSystem.prototype.update = function (dt) {
	var boardList = this.ces.getListOfComponent(Board);
	var tokenList = this.ces.getListOfComponent(Token);

	for (var boardId in boardList) {
		var board = boardList[boardId];

		if (input.left && this.canMoveTokens(-1, board.controllableTokens, tokenList, board))
			this.moveTokens(-1, board.controllableTokens, tokenList, board);

		if (input.right && this.canMoveTokens(1, board.controllableTokens, tokenList, board))
			this.moveTokens(1, board.controllableTokens, tokenList, board);

		if (input.rotate && this.canRotateTokens(0, board.controllableTokens, tokenList, board))
			this.rotateTokens(0, board.controllableTokens, tokenList, board);
		else if (input.rotate && this.canRotateTokens(-1, board.controllableTokens, tokenList, board))
			this.rotateTokens(-1, board.controllableTokens, tokenList, board);
		else if (input.rotate && this.canRotateTokens(1, board.controllableTokens, tokenList, board))
			this.rotateTokens(1, board.controllableTokens, tokenList, board);

		if (input.down && board.controllableTokens.length > 0) {
			for (var i in board.controllableTokens) {
				tokenList[board.controllableTokens[i]].controllable = false;
			}
			board.controllableTokens = [];
		}
	}

	input.rotate = false;
	input.left = false;
	input.right = false;
	input.down = false;
}

InputSystem.prototype.canMoveTokens = function(dir, controllableTokens, tokenList, board) {
	for (var it in controllableTokens) {
		var tokenId = controllableTokens[it];
		var token = tokenList[tokenId];

		if (this.isAFullTile(token.column + dir, token.row, tokenList, board))
			return false;
	}

	return true;
}

InputSystem.prototype.moveTokens = function(dir, controllableTokens, tokenList, board) {
	var it;
	var tokenId;
	var token;

	for (it in controllableTokens) {
		tokenId = controllableTokens[it];
		token = tokenList[tokenId];
		board.tiles[token.column][token.row] = null;
	}

	for (it in controllableTokens) {
		tokenId = controllableTokens[it];
		token = tokenList[tokenId];
		token.column += dir;
		board.tiles[token.column][token.row] = tokenId;
	}
}

InputSystem.prototype.canRotateTokens = function(dir, controllableTokens, tokenList, board) {
	var centerToken = tokenList[controllableTokens[0]];

	for (var i = 0; i < controllableTokens.length; i ++) {
		var tokenId = controllableTokens[i];
		var token = tokenList[tokenId];
		var columnDiff = token.column - centerToken.column;
		var rowDiff = token.row - centerToken.row;

		if (this.isAFullTile(centerToken.column + dir + rowDiff, centerToken.row - columnDiff, tokenList, board))
			return false;
	}

	return true;
}

InputSystem.prototype.rotateTokens = function(dir, controllableTokens, tokenList, board) {
	var tokenId;
	var token;
	var i;

	for (i = 0; i < controllableTokens.length; i ++) {
		tokenId = controllableTokens[i];
		token = tokenList[tokenId];
		board.tiles[token.column][token.row] = null;
	}

	var centerToken = tokenList[controllableTokens[0]];

	for (i = 0; i < controllableTokens.length; i ++) {
		tokenId = controllableTokens[i];
		token = tokenList[tokenId];
		var columnDiff = token.column - centerToken.column;
		var rowDiff = token.row - centerToken.row;
		token.column = centerToken.column + rowDiff;
		token.row = centerToken.row - columnDiff;
	}

	for (i = 0; i < controllableTokens.length; i ++) {
		tokenId = controllableTokens[i];
		token = tokenList[tokenId];
		token.column += dir;
		board.tiles[token.column][token.row] = tokenId;
	}

	playSound("turn");
}

InputSystem.prototype.isAFullTile = function(column, row, tokenList, board) {
	if (column < 0) return true;
	if (row < 0) return true;
	if (column > board.tiles.length - 1) return true;
	if (row > board.tiles[column].length - 1) return true;

	var tokenId = board.tiles[column][row];
	if (tokenId) {
		return !tokenList[tokenId].controllable;
	} 

	return false
}

function TokenFall() {
}

TokenFall.prototype = new System();

TokenFall.prototype.update = function (dt) {
	var boardList = this.ces.getListOfComponent(Board);
	var tokenList = this.ces.getListOfComponent(Token);

	for (var entityId in boardList) {
		var board = boardList[entityId];
		
		var updateTime = board.updateTime / (board.controllableTokens.length > 0 ? 1 : 5);

		if (board.currentTime > updateTime) {
			board.currentTime = 0;
			board.allLock = true;

			for (var column = 0; column < board.tiles.length; column ++) {
				for (var row = board.tiles[column].length - 1; row >= 0; row --) {
					var tokenId = board.tiles[column][row];

					if (tokenId) {
						var token = tokenList[tokenId];
						if (token.row == board.tiles[column].length - 1 || board.tiles[column][row + 1] != null) {
							token.lock = true;
							if (token.controllable) {
								this.cancelControl(board, tokenList);
							}
						} else {
							board.tiles[token.column][token.row] = null;
							token.row ++;
							board.tiles[token.column][token.row] = tokenId;
							board.allLock = false;
							token.lock = false;
						}
					}
				}				
			}

			playSound("down");
		} else {
			board.currentTime += dt;
		}
	}
}

TokenFall.prototype.cancelControl = function (board, tokenList) {
	for (var it in board.controllableTokens) {
		var tokenId = board.controllableTokens[it];
		tokenList[tokenId].controllable = false;
	}

	board.controllableTokens = [];
}

function TokenSpawner(spriteSheet, container) {
	this.spriteSheet = spriteSheet;
	this.container = container;
}

TokenSpawner.prototype = new System();

TokenSpawner.prototype.update = function (dt) {
	var boardList = this.ces.getListOfComponent(Board);
	var tokenList = this.ces.getListOfComponent(Token);

	for (var entityId in boardList) {
		var board = boardList[entityId];

		if (board.allLock) {
			if (board.currentDropTime > board.dropTime) {
				board.currentDropTime = 0;
				board.allLock = false;

				board.controllableTokens = [];
				board.controllableTokens.push(this.createTokenEntity(board, 4));
				board.controllableTokens.push(this.createTokenEntity(board, 5));

				board.combo = 0;
				board.matchScore = 10;
			} else {
				board.currentDropTime += dt;
			}
		} else {
			board.currentDropTime = 0;
		}
	}
}

TokenSpawner.prototype.createTokenEntity = function(board, column) {
	var id = this.ces.getNewEntityId();
	var row = 0;
	var randomType = this.getRandomToken(board.tokens);

	this.ces.addComponentToEntity(new Transform(), id);
	this.ces.addComponentToEntity(new Token(randomType, column, row, true), id);
	board.tiles[column][row] = id;

	var rect = this.spriteSheet.getFrame(this.spriteSheet.getAnimation(randomType).frames[0]).rect
	var bitmapAnimation = new createjs.Sprite(this.spriteSheet);
	bitmapAnimation.regX = Math.round(rect.width / 2);
	bitmapAnimation.regY = Math.round(rect.height / 2);
	bitmapAnimation.gotoAndPlay(randomType);
	bitmapAnimation.snapToPixel = true;

	this.ces.addComponentToEntity(new View(bitmapAnimation, this.container), id);

	return id;
}

TokenSpawner.prototype.getRandomToken = function(boardTokens) {
	var random = Math.floor(Math.random() * boardTokens);
	var type = "";

	switch (random) {
		case 0: 
			type = "finn";
			break;
		case 1: 
			type = "jake";
			break;
		case 2: 
			type = "bubblegum";
			break;
		case 3: 
			type = "marceline";
			break;
		case 4: 
			type = "tree_trunks";
			break;
		case 5: 
			type = "flame";
			break;
	}

	return type;
}

function TokenMatch(onMatchHandler, onChainExplode) {
	this.onMatchHandler = onMatchHandler;
	this.onChainExplode = onChainExplode;
}

TokenMatch.prototype = new System();

TokenMatch.prototype.update = function (dt) {
	var boardList = this.ces.getListOfComponent(Board);
	var tokenList = this.ces.getListOfComponent(Token);
	var viewList = this.ces.getListOfComponent(View);

	for (var entityId in boardList) {
		var board = boardList[entityId];
		
		if (board.allLock) {
			this.unvisiteTokens(tokenList, viewList);

			for (var column = 0; column < board.tiles.length; column ++) {
				for (var row = board.tiles[column].length - 1; row >= 0; row --) {
					var tokenId = board.tiles[column][row];

					if (tokenId) {
						var token = tokenList[tokenId];

						if (!token.visited) {
							var chain = [];
							
							this.getTokensChain(board.tiles, token, chain, tokenList);

							if (chain.length > 3) {
								board.score += chain.length * board.matchScore;
								this.onChainExplode(chain, board.matchScore);
								board.matchScore = Math.min(160, board.matchScore * 2);
								board.matches ++;
								if (board.matches % 10 == 0) {
									board.tokens = Math.min(6, board.tokens + 1);
									board.updateTime -= 0.05;	
								}
								
								board.combo += 1;
								board.allLock = false;

								this.removeTokens(this.ces, chain, board, viewList);
								this.onMatchHandler(board.score);
							} else if (chain.length > 1) {
								this.highlightTokens(chain, viewList);
							}
						}
					}
				}
			}
		}
	}
}

TokenMatch.prototype.removeTokens = function(ces, chain, board, viewList) {
	for (var key in chain) {
		var token = chain[key];
		board.tiles[token.column][token.row] = null;

		var sprite = viewList[token.entityId].sprite;
		var viewNode = viewList[token.entityId].node;
		var viewNodeContainer = viewNode.parent;
		
		ces.removeEntity(token.entityId);

		viewNodeContainer.setChildIndex(viewNode, viewNodeContainer.getNumChildren());
		sprite.addEventListener("animationend", function (event) {
			// This is awful, but it works.
			event.target.parent.parent.removeChild(event.target.parent);
		});

		sprite.gotoAndPlay("fx0" + Math.ceil(Math.random() * 2));
	}

	playSound("match");
}

TokenMatch.prototype.highlightTokens = function(chain, viewList) {
	for (var key in chain) {
		var token = chain[key];
		var sprite = viewList[token.entityId].sprite;
		if (sprite.currentAnimation == token.type)
			sprite.gotoAndPlay(token.type + "_match");
	}
}

TokenMatch.prototype.unvisiteTokens = function(tokenList, viewList) {
	for (var tokenId in tokenList) {
		var token = tokenList[tokenId];
		token.visited = false;
		var sprite = viewList[token.entityId].sprite;
		if (sprite.currentAnimation == token.type + "_match")
			sprite.gotoAndPlay(token.type);
	}
}

TokenMatch.prototype.getTokensChain = function(board, token, chain, tokenList) {
	token.visited = true;
	chain.push(token);

	if (token.column > 0 && 
		board[token.column - 1][token.row] && 
		!(tokenList[board[token.column - 1][token.row]].visited) && 
		tokenList[board[token.column - 1][token.row]].type == chain[0].type) 
		this.getTokensChain(board, tokenList[board[token.column - 1][token.row]], chain, tokenList);

	if (token.column < (board.length - 1)
		&& board[token.column + 1][token.row] 
		&& !(tokenList[board[token.column + 1][token.row]].visited)
		&& tokenList[board[token.column + 1][token.row]].type == chain[0].type)
		this.getTokensChain(board, tokenList[board[token.column + 1][token.row]], chain, tokenList);

	if (token.row > 0 
		&& board[token.column][token.row - 1] 
		&& !(tokenList[board[token.column][token.row - 1]].visited)
		&& tokenList[board[token.column][token.row - 1]].type == chain[0].type)
		this.getTokensChain(board, tokenList[board[token.column][token.row - 1]], chain, tokenList);

	if (token.row < (board[token.column].length - 1) 
		&& board[token.column][token.row + 1] 
		&& !(tokenList[board[token.column][token.row + 1]].visited)
		&& tokenList[board[token.column][token.row + 1]].type == chain[0].type)
		this.getTokensChain(board, tokenList[board[token.column][token.row + 1]], chain, tokenList);
}

function PositionConvert() {
	this.zero = new Vec2(5 + 15, 6 + 15);
	this.tileSize = 31;
}

PositionConvert.prototype = new System();

PositionConvert.prototype.update = function (dt) {
	var transformList = this.ces.getListOfComponent(Transform);
	var tokenList = this.ces.getListOfComponent(Token);
	var boardList = this.ces.getListOfComponent(Board);

	for (var boardId in boardList) {
		var board = boardList[boardId];

		for (var column = 0; column < board.tiles.length; column ++) {
			for (var row = board.tiles[column].length - 1; row >= 0; row --) {
				var tokenId = board.tiles[column][row];
				
				if (tokenId) {
					var token = tokenList[tokenId];
					var transform = transformList[tokenId];

					var yInc = 0;
					// if (!token.lock) {
					// 	yInc = Math.min(board.currentTime / board.updateTime, 1) - 1;
					// }

					transform.position = new Vec2(this.zero.x + (this.tileSize * token.column), this.zero.y + (this.tileSize * (token.row + yInc)));
				}
			}
		}
	}
}

function GameOver(handler) {
	this.handler = handler;
}

GameOver.prototype = new System();

GameOver.prototype.update = function (dt) {
	var transformList = this.ces.getListOfComponent(Transform);
	var tokenList = this.ces.getListOfComponent(Token);
	var boardList = this.ces.getListOfComponent(Board);

	for (var boardId in boardList) {
		var board = boardList[boardId];

		if (!board.allLock) return;

		for (var column = 0; column < board.tiles.length; column ++) {
			var tokenId = board.tiles[column][0];
				
			if (tokenId) {
				var token = tokenList[tokenId];
				if (token.lock) {
					this.handler(board.score);
					board.updateTime = 999;
					break;
				}
			}
		}
	}
}

function HelperSystem(container) {
	this.container = container;
}

HelperSystem.prototype = new System();

HelperSystem.prototype.update = function (dt) {
	var viewList = this.ces.getListOfComponent(View);
	var transformList = this.ces.getListOfComponent(Transform);
	var boardList = this.ces.getListOfComponent(Board);
	var tokenList = this.ces.getListOfComponent(Token);

	for (var boardId in boardList) {
		var board = boardList[boardId];
		this.container.graphics.clear();

		if (board.controllableTokens.length > 0) {
			var min = 99999;
			var max = -99999;

			for (var index in board.controllableTokens) {
				var token = tokenList[board.controllableTokens[index]];
				var transform = transformList[board.controllableTokens[index]];

				min = Math.min(transform.position.x, min);
				max = Math.max(transform.position.x, max);
			}

			min -= 15;
			max += 15;

			var rectWidth = max - min;

			this.container.graphics.beginFill("rgba(255, 255, 255, 0.1)");
			this.container.graphics.drawRect(min, 6, rectWidth, 309);
			this.container.graphics.endFill();
		}
	}
}



function RenderSystem() {
}

RenderSystem.prototype = new System();

RenderSystem.prototype.update = function (dt) {
	var viewList = this.ces.getListOfComponent(View);
	var transformList = this.ces.getListOfComponent(Transform);

	for (var entityId in viewList) {
		if (transformList[entityId]) {
			var view = viewList[entityId];
			var transform = transformList[entityId];
			var absolutePosition = transform.getAbsolutePosition();

			view.node.x = Math.floor(absolutePosition.x);
			view.node.y = Math.floor(absolutePosition.y);
			view.node.rotation = transform.getAbsoluteRotation() * 180 / Math.PI;
		}
	}
}