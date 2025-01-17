import java.util.Random;
import java.util.Scanner;

public class Game2048 {
    private static final int SIZE = 4;
    private int[][] board;
    private Random random;

    public Game2048() {
        board = new int[SIZE][SIZE];
        random = new Random();
        addNewTile();
        addNewTile();
    }

    private void addNewTile() {
        int row, col;
        do {
            row = random.nextInt(SIZE);
            col = random.nextInt(SIZE);
        } while (board[row][col] != 0);
        board[row][col] = random.nextInt(10) == 0 ? 4 : 2;  // 10% chance of 4, 90% chance of 2
    }

    public void printBoard() {
        for (int[] row : board) {
            for (int val : row) {
                System.out.printf("%4d", val);
            }
            System.out.println();
        }
    }

    private boolean slideLeft() {
        boolean moved = false;
        for (int i = 0; i < SIZE; i++) {
            int[] row = board[i];
            int[] newRow = new int[SIZE];
            int insertPosition = 0;
            for (int j = 0; j < SIZE; j++) {
                if (row[j] != 0) {
                    newRow[insertPosition] = row[j];
                    insertPosition++;
                }
            }
            for (int j = 0; j < SIZE - 1; j++) {
                if (newRow[j] != 0 && newRow[j] == newRow[j + 1]) {
                    newRow[j] *= 2;
                    newRow[j + 1] = 0;
                    moved = true;
                }
            }
            int[] finalRow = new int[SIZE];
            insertPosition = 0;
            for (int j = 0; j < SIZE; j++) {
                if (newRow[j] != 0) {
                    finalRow[insertPosition] = newRow[j];
                    insertPosition++;
                }
            }
            board[i] = finalRow;
        }
        return moved;
    }

    private void rotateBoard() {
        int[][] newBoard = new int[SIZE][SIZE];
        for (int i = 0; i < SIZE; i++) {
            for (int j = 0; j < SIZE; j++) {
                newBoard[j][SIZE - 1 - i] = board[i][j];
            }
        }
        board = newBoard;
    }

    public boolean move(char direction) {
        boolean moved = false;
        for (int i = 0; i < "wsad".indexOf(direction); i++) {
            rotateBoard();
        }
        moved = slideLeft();
        for (int i = 0; i < 4 - "wsad".indexOf(direction); i++) {
            rotateBoard();
        }
        if (moved) {
            addNewTile();
        }
        return moved;
    }

    public boolean isGameOver() {
        for (int i = 0; i < SIZE; i++) {
            for (int j = 0; j < SIZE; j++) {
                if (board[i][j] == 0) {
                    return false;
                }
                if (i > 0 && board[i][j] == board[i - 1][j]) {
                    return false;
                }
                if (j > 0 && board[i][j] == board[i][j - 1]) {
                    return false;
                }
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Game2048 game = new Game2048();
        while (!game.isGameOver()) {
            game.printBoard();
            System.out.print("Move (w=up, s=down, a=left, d=right): ");
            char move = scanner.next().charAt(0);
            if ("wsad".indexOf(move) != -1) {
                game.move(move);
            } else {
                System.out.println("Invalid move!");
            }
        }
        game.printBoard();
        System.out.println("Game Over!");
    }
}
