var GameOfLife;
(function (GameOfLife) {
    var Main = (function () {
        function Main(canvas, size) {
            var _this = this;
            this.gameEnginge = new GameOfLife.GameEngine();
            this.aliveMatrix = new GameOfLife.CellMatrix();
            this.grid = new GameOfLife.Grid(canvas, size);
            this.pausebox = document.getElementById("pauseBox");
            this.pauseBackground = document.getElementById("pauseBackground");
            this.pausebox.style.display = "none";

            canvas.onmousemove = function (e) {
                _this.OnMouseMove(e);
            };
            canvas.onmouseout = function (e) {
                _this.OnMouseOut(e);
            };
            canvas.onmousedown = function (e) {
                _this.OnMouseDown(e);
            };
        }
        Main.prototype.Connect = function () {
            var _this = this;
            this.aliveFirebaseRef = new Firebase("https://gameoflife.firebaseio.com/Alive");
            this.aliveFirebaseRef.once("value", function (data) {
                _this.ReceiveData(_this, data);
                _this.timerToken = setInterval(function () {
                    _this.CreateNextGeneration();
                }, 500);
            });

            this.manualFirebaseRef = new Firebase("https://gameoflife.firebaseio.com/Manual");
            this.manualFirebaseRef.onDisconnect().remove();

            this.manualFirebaseRef.on("value", function (data) {
                _this.ManuallyUpdated(data);
            });
        };

        Main.prototype.OnMouseMove = function (event) {
            var cell = this.grid.CellFromPixels(event.clientX, event.clientY);
            var wasChanged = this.grid.SetHooverCell(cell);

            if (wasChanged) {
                this.grid.DrawGrid(this.aliveMatrix.cells);
            }
        };

        Main.prototype.OnMouseOut = function (event) {
            this.grid.SetHooverCell(null);
            this.grid.DrawGrid(this.aliveMatrix.cells);
        };

        Main.prototype.OnMouseDown = function (event) {
            var clickedCell = this.grid.CellFromPixels(event.clientX, event.clientY);

            var isAlive = this.aliveMatrix.Get(clickedCell.Col, clickedCell.Row) != null;

            if (isAlive) {
                this.aliveMatrix.Remove(clickedCell.Col, clickedCell.Row);
                this.aliveFirebaseRef.child(clickedCell.CellKey.toString()).remove();
            } else {
                this.aliveMatrix.Set(clickedCell.Col, clickedCell.Row);
                this.aliveFirebaseRef.child(clickedCell.CellKey.toString()).set(clickedCell);
            }

            this.manualFirebaseRef.child("AliveMatrix").set(this.aliveMatrix);

            this.grid.DrawGrid(this.aliveMatrix.cells);
        };

        Main.prototype.ReceiveData = function (context, data) {
            var _this = this;
            this.aliveMatrix = new GameOfLife.CellMatrix();

            data.child("cells").forEach(function (cellModel) {
                var cell = cellModel.val();
                _this.aliveMatrix.Set(cell.Col, cell.Row);
                return false;
            });

            context.grid.DrawGrid(context.aliveMatrix.cells);
        };

        Main.prototype.ManuallyUpdated = function (data) {
            var _this = this;
            var manualData = data.val();
            if (manualData == null) {
                return;
            }

            this.aliveMatrix.cells = new Array();

            var cells = data.child("AliveMatrix").child("cells");
            cells.forEach(function (cellData) {
                var cell = cellData.val();
                _this.aliveMatrix.Set(cell.Col, cell.Row);
                return false;
            });

            this.PauseGame();
            this.grid.DrawGrid(this.aliveMatrix.cells);
        };

        Main.prototype.PauseGame = function () {
            var _this = this;
            clearInterval(this.timerToken);
            this.pauseCounter = 0;
            this.pausebox.style.display = "block";
            clearInterval(this.pauseToken);
            this.pauseToken = setInterval(function () {
                _this.PauseIntervalTick();
            }, 100);
        };

        Main.prototype.PauseIntervalTick = function () {
            var _this = this;
            this.pauseBackground.style.height = (50 - this.pauseCounter * (50 / 40)) + "px";

            if (this.pauseCounter === 40) {
                this.pausebox.style.display = "none";
                clearInterval(this.pauseToken);
                this.timerToken = setInterval(function () {
                    _this.CreateNextGeneration();
                }, 500);
            }

            this.pauseCounter++;
        };

        Main.prototype.CreateNextGeneration = function () {
            var _this = this;
            var survivors = this.gameEnginge.GetSurvivingCells(this.aliveMatrix);

            this.aliveMatrix = new GameOfLife.CellMatrix();
            survivors.forEach(function (cell) {
                _this.aliveMatrix.cells[cell.CellKey] = cell;
            });
            this.grid.DrawGrid(this.aliveMatrix.cells);

            this.aliveFirebaseRef.set(this.aliveMatrix);
        };
        return Main;
    })();
    GameOfLife.Main = Main;
})(GameOfLife || (GameOfLife = {}));

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var mainApp = new GameOfLife.Main(canvas, 500);
    mainApp.Connect();
};
//# sourceMappingURL=app.js.map
