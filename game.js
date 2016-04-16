(function()
{
    window.requestAnimFrame = (function()
    {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback)
            {
                window.setTimeout(callback, 1000 / 30);
            };
    })();

    var ctx = null;

    var Game =
    {
        canvas: document.getElementById("gamecanvas"),

        setup: function()
        {
            if (this.canvas.getContext)
            {
                ctx = this.canvas.getContext('2d');
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                AssetLoader.loadAssets();
                this.runGame();
                this.frameCount = 0;
            }
        },

        init: function()
        {
            Ctrl.init();
            GameState.init();
            Screen.init();
            CharacterSet.init();
        },

        animate: function()
        {
            Game.play = requestAnimFrame(Game.animate);
            Game.draw();
        },

        draw: function()
        {
            this.frameCount++;
            Screen.draw();
            if (this.frameCount >= Number.MAX_VALUE - 1000) this.frameCount = 0;
        },

        runGame: function()
        {
            Game.init();
            Game.animate();
        }
    };

    var GameState = 
    {
        roomWidth : 3,
        roomHeight : 3,
        rooms : [],
        curRoom: 0,
        possibleDoors : [],
        walls: [],

        init: function()
        {
            this.curRoom = Math.floor(this.roomWidth * this.roomHeight / 2);
            this.walls = [
                [150, 50, 650, 50],
                [150, 550, 150, 50],
                [150, 550, 650, 550],
                [650, 550, 650, 50],
            ];
            this.genRooms();
        },

        genRooms: function()
        {
            this.possibleDoors = [
                [400, 50,  -1 * this.roomWidth, 390, 455],//top
                [650, 300, 1,                   180, 235],//right
                [400, 550, this.roomWidth,      390, 15],//bottom
                [150, 300, -1,                  600, 235]//left
            ];

            this.rooms = [
                {},
                {doors: [0,0,1,0], boxes: [], chars: []},
                {},
                {doors: [0,1,0,0], boxes: [], chars: []},
                {doors: [1,1,1,1], boxes: [], chars: []},
                {doors: [0,0,0,1], boxes: [], chars: []},
                {},
                {doors: [1,0,0,0], boxes: [], chars: []},
                {},
            ];
        },

        draw: function()
        {
            for(var i = 0; i < 4; i++)
            {        
                var line = this.walls[i];    
                ctx.beginPath();
                ctx.strokeStyle = 'orange';
                ctx.moveTo(line[0],line[1]);
                ctx.lineTo(line[2],line[3]);
                ctx.stroke();
            }

            var theRoom = this.rooms[this.curRoom];

            for(var j = 0; j < 4; j++)
            {
                if(theRoom.doors[j] == 1)
                {
                    drawCircle(this.possibleDoors[j][0], this.possibleDoors[j][1], 10);
                }
            }
        }
    };

    var Screen =
    {
        init: function()
        {
        },

        draw: function()
        {
            this.update();

            ctx.save();
            ctx.clearRect(0, 0, Game.width, Game.height);
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, Game.width, Game.height);
            ctx.restore();

            GameState.draw();
            Ctrl.draw();
            CharacterSet.draw();
        },

        update: function()
        {
            var speed = 5;

            var player = CharacterSet.positions[0];
            if(player[0] != Ctrl.dest[0] || player[1] != Ctrl.dest[1])
            {
                var dist = getDist(player[0], player[1], Ctrl.dest[0], Ctrl.dest[1]);

                if(dist <= speed)
                {
                    CharacterSet.positions[0] = Ctrl.dest;
                }
                else
                {
                    var xDist = player[0] - Ctrl.dest[0];
                    var yDist = player[1] - Ctrl.dest[1];

                    var xMove = speed * xDist / dist;
                    var yMove = speed * yDist / dist;

                    CharacterSet.positions[0] = [Math.floor(player[0] - xMove), Math.floor(player[1] - yMove)];
                }
            }

            for(var j = 0; j < 4; j++)
            {
                if(GameState.rooms[GameState.curRoom].doors[j] == 1)
                {
                    var dist = getDist(GameState.possibleDoors[j][0], GameState.possibleDoors[j][1], CharacterSet.positions[0][0] + 10, CharacterSet.positions[0][1] + 65);

                    if(dist < 20)
                    {
                        var newX = GameState.possibleDoors[j][3];
                        var newY = GameState.possibleDoors[j][4];
                        GameState.curRoom += GameState.possibleDoors[j][2];
                        CharacterSet.positions[0] = [newX, newY];
                        Ctrl.dest = [newX, newY];
                        CharacterSet.sprites[0][4] = GameState.curRoom;
                        break;
                    }
                }
            }
        }
    };

    var AssetLoader = {
        loadAssets: function() {
            this.cSprites = new Image();
            this.cSprites.src = 'res/ld35-chars.png';            
            this.ui = new Image();
            this.ui.src = 'res/ld35-ui.png';
        }
    };

    var CharacterSet =
    {
        cCount : 20,
        sprites : [],
        positions: [],
        selectedChar : 0,

        init: function()
        {
            this.generateCharacters();
        },

        generateCharacters: function()
        {
            for (var i = 0; i < this.cCount; i++)
            {
                var hair = getRand(0,4);
                var face = getRand(0,4);
                var shirt = getRand(0,4);
                var pants = getRand(0,4);
                var x = getRand(200, 600);
                var y = getRand(100, 500);
                var room = getRand(0,7);
                while(room == 0 || room == 2 || room == 6)
                {
                    room = getRand(0,7);
                }
                if(i == 0) room = 4;

                if(this.sprites.indexOf([hair, face, shirt, pants, room]) == -1)
                {
                    this.sprites.push([hair, face, shirt, pants, room]);
                    this.positions.push([x, y]);
                }
                else
                {
                    i--;
                }
            }
        },

        draw: function()
        {
            var overChar = false;
            for(var i = this.cCount - 1; i >= 0; i--)
            //for(var i = 0; i >= 0; i--)
            {
                var char = this.sprites[i];
                if(char[4] == GameState.curRoom)
                {
                    var pos = this.positions[i];
                    var x = pos[0];
                    var y = pos[1];

                    drawImage(AssetLoader.cSprites, x, y + 45,  20, 20, char[3] * 20, 60,  20, 20);
                    drawImage(AssetLoader.cSprites, x, y + 25,  20, 20, char[2] * 20, 40,  20, 20);
                    drawImage(AssetLoader.cSprites, x, y + 5,   20, 20, char[1] * 20, 20,  20, 20);
                    drawImage(AssetLoader.cSprites, x, y,       20, 20, char[0] * 20, 0,   20, 20);

                    var mX = Ctrl.mousePos[0];
                    var mY = Ctrl.mousePos[1];

                    if(i != 0)
                    {
                        if(mX >= x && mX <= x + 20 && mY >= y && mY <= y + 65)
                        {
                            overChar = true;
                            this.selectedChar = i;
                            drawText("NAME", x, y-5, 10);
                        }
                    }
                }
            }

            if(!overChar) this.selectedChar = 0;
        }
    };

    var Ctrl = 
    {
        init: function() {
            this.dest = [300,300];
            this.mousePos = [0,0];
            //window.addEventListener('keydown', this.keyDown, true);
            //window.addEventListener('keyup', this.keyUp, true);
            Game.canvas.addEventListener('mousemove', this.getMouseMove, true);
            Game.canvas.addEventListener('mousedown', this.getMouseClick, true);
        },

        getMouseMove: function(event)
        {
            var x = event.x;
            var y = event.y;
            x -= Game.canvas.offsetLeft;
            y -= Game.canvas.offsetTop;

            Ctrl.mousePos = [x,y];
        },

        getMouseClick: function(event)
        {
            var x = event.x;
            var y = event.y;
            x -= Game.canvas.offsetLeft;
            y -= Game.canvas.offsetTop;

            if(x >= 150 && x <= 650 && y >= 50 && y <= 550) Ctrl.dest = [x - 10, y - 65];
            if(CharacterSet.selectedChar > 0)
            {
                Ctrl.dest = [   CharacterSet.positions[CharacterSet.selectedChar][0] + 10,
                                CharacterSet.positions[CharacterSet.selectedChar][1] + 30
                            ];
            }
        },

        draw: function()
        {
            drawDestCursor(this.dest[0], this.dest[1] + 55);
        }
    };

    function drawCircle(x, y, size)
    {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'orange';
        ctx.fill();        
    }

    function drawImage(src, x, y, w, h, sx, sy, cw, ch)
    {
        ctx.drawImage(src, sx, sy, cw, ch, x, y, w, h);
    }

    function drawDestCursor(x, y)
    {
        ctx.drawImage(AssetLoader.ui, 0, 0, 20, 20, x, y, 20, 20);
    }

    function getRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getDist(x1, y1, x2, y2)
    {
        var xd = x1 - x2;
        var yd = y1 - y2;
        return Math.sqrt(xd * xd + yd * yd);
    }

    function drawText(text, x, y, size)
    {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = size + "px Arial";
        ctx.fillText(text, x, y);
    }

    window.onload = function()
    {
        Game.setup();
    }
}());