/// <reference path="firebase/firebase.d.ts" />
/// <reference path="cell.ts" />
/// <reference path="cellmatrix.ts" />
/// <reference path="gameengine.ts" />

module GameOfLife {

    export class Main {
        grid: Grid;
        aliveFirebaseRef: Firebase;
        manualFirebaseRef: Firebase;
        span: HTMLElement;
        timerToken: number;
        pauseToken: number;
        pauseCounter: number;
        pausebox: HTMLDivElement;
        pauseBackground: HTMLDivElement;
        gameEnginge: GameEngine = new GameEngine();

        aliveMatrix: CellMatrix = new CellMatrix();

        constructor(canvas: HTMLCanvasElement, size: number) {
            this.grid = new Grid(canvas, size);
            this.pausebox = <HTMLDivElement>document.getElementById("pauseBox");
            this.pauseBackground = <HTMLDivElement>document.getElementById("pauseBackground");
            this.pausebox.style.display = "none";

            canvas.onmousemove = (e) => { this.OnMouseMove(e); };
            canvas.onmouseout = (e)=> { this.OnMouseOut(e); };
            canvas.onmousedown = (e) => { this.OnMouseDown(e); };
        }

        public Connect() {
            this.aliveFirebaseRef = new Firebase("https://gameoflife.firebaseio.com/Alive");
            this.aliveFirebaseRef.once("value", data=> {
                this.ReceiveData(this, data);
                this.timerToken = setInterval(() => { this.CreateNextGeneration(); }, 500);
            });

            this.manualFirebaseRef = new Firebase("https://gameoflife.firebaseio.com/Manual");
            this.manualFirebaseRef.onDisconnect().remove();

            this.manualFirebaseRef.on("value", data => { this.ManuallyUpdated(data); });
        }

        private OnMouseMove(event: MouseEvent): void {
            var cell = this.grid.CellFromPixels(event.clientX, event.clientY);
            var wasChanged = this.grid.SetHooverCell(cell);

            if (wasChanged) {
                this.grid.DrawGrid(this.aliveMatrix.cells);
            }
        }

        private OnMouseOut(event: MouseEvent): void {
            this.grid.SetHooverCell(null);
            this.grid.DrawGrid(this.aliveMatrix.cells);
        }

        private OnMouseDown(event: MouseEvent): void {
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
        }

        private ReceiveData(context: Main, data: IFirebaseDataSnapshot): void {
            this.aliveMatrix = new CellMatrix();

            data.child("cells").forEach(cellModel => {
                var cell = <Cell>cellModel.val();
                this.aliveMatrix.Set(cell.Col, cell.Row);
                return false;
            });

            context.grid.DrawGrid(context.aliveMatrix.cells);
        }

        private ManuallyUpdated(data: IFirebaseDataSnapshot): void {
            var manualData = data.val();
            if (manualData == null) {
                return;
            }

            this.aliveMatrix.cells = new Array<Cell>();

            var cells = data.child("AliveMatrix").child("cells");
            cells.forEach(cellData=> {
                var cell = cellData.val();
                this.aliveMatrix.Set(cell.Col, cell.Row);
                return false;
            });

            this.PauseGame();
            this.grid.DrawGrid(this.aliveMatrix.cells);
        }

        private PauseGame(): void {
            clearInterval(this.timerToken);
            this.pauseCounter = 0;
            this.pausebox.style.display = "block";
            clearInterval(this.pauseToken);
            this.pauseToken = setInterval(() => { this.PauseIntervalTick(); }, 100);
        }

        private PauseIntervalTick(): void {
            this.pauseBackground.style.height = (50 - this.pauseCounter * (50 / 40)) + "px";

            if (this.pauseCounter === 40) {
                this.pausebox.style.display = "none";
                clearInterval(this.pauseToken);
                this.timerToken = setInterval(() => { this.CreateNextGeneration(); }, 500);
            }

            this.pauseCounter++;
        }

        private CreateNextGeneration(): void {
            var survivors = this.gameEnginge.GetSurvivingCells(this.aliveMatrix);

            this.aliveMatrix = new CellMatrix();
            survivors.forEach(cell=> {
                this.aliveMatrix.cells[cell.CellKey] = cell;
            });
            this.grid.DrawGrid(this.aliveMatrix.cells);

            this.aliveFirebaseRef.set(this.aliveMatrix);
        }
    }
}

window.onload = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("canvas");
    var mainApp = new GameOfLife.Main(canvas, 500);
    mainApp.Connect();
};
