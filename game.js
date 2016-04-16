(function() {
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var ctx = null;

    var Game = {
        canvas: document.getElementById("gamecanvas"),

        setup: function() {
            if (this.canvas.getContext) {
                ctx = this.canvas.getContext('2d');
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                this.runGame();
                this.frameCount = 0;
            }
        },

        init: function() {
            Screen.init();
        },

        animate: function() {
            Game.play = requestAnimFrame(Game.animate);
            Game.draw();
        },

        draw: function() {
            this.frameCount++;
            Screen.draw();
            if (this.frameCount >= Number.MAX_VALUE - 1000) this.frameCount = 0;
        },

        runGame: function() {
            Game.init();
            Game.animate();
        }
    };

    var Screen = {
        init: function() {
        },

        draw: function() {
            ctx.save();
            ctx.clearRect(0, 0, Game.width, Game.height);
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, Game.width, Game.height);
            ctx.restore();
        }
    };

    window.onload = function() {
        Game.setup();
    }
}());