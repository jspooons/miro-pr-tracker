interface ColumnInfo {
    title: string;
    color: string;
    fillColor: string;
}

export async function addDefaultKanbanBoard(repoName: string) {
    const columnInfo: ColumnInfo[] = [
        {
            title: "No Reviews",
            color: "#525252",
            fillColor: "#cfcfcf",
        },
        {
            title: "In Review",
            color: "#002eab",
            fillColor: "#a8c0ff",
        },
        {
            title: "Approved",
            color: "#0d750d",
            fillColor: "#a5e8b7",
        },
        {
            title: "Merged",
            color: "#5a00a3",
            fillColor: "#d8a8ff",
        }
    ]

    await addKanbanBoard(1600, 900, 20, columnInfo, repoName);
}

async function addKanbanBoard(width: number, height: number, padding: number, columns: ColumnInfo[], repoName: string) {
    const frame = await miro.board.createFrame({
        title: `${repoName} board`,
        style: {
          fillColor: '#ffffff',
        },
        x: 0, // Default value: horizontal center of the board
        y: 0, // Default value: vertical center of the board
        width: width,
        height: height,
    });

    const columnHeight = height - (padding * 2);
    const columnWidth = (width - (columns.length + 1) * padding) / columns.length;

    columns.forEach(async (column, index) => {
        const x = ((-width / 2) + padding * (index + 1) + columnWidth / 2) + columnWidth * index;
        const columnShape = await addKanbanColumn(column.title, x, column.color, column.fillColor, columnHeight, columnWidth);
        frame.add(columnShape);
    });
}

async function addKanbanColumn(title: string, x: number, color: string, fillColor: string, height: number, width: number) {
    return await miro.board.createShape({
        content: title,
        shape: 'rectangle',
        style: {
          color: color, 
          fillColor: fillColor, 
          fontFamily: 'arial', 
          fontSize: 32, 
          textAlign: 'center', 
          textAlignVertical: 'top', 
          borderStyle: 'normal', 
          borderOpacity: 1.0, 
          borderColor: color, 
          borderWidth: 2, 
          fillOpacity: 1,
        },
        x: x, 
        y: 0, 
        width: width,
        height: height,
    });
}
